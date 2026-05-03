from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Annotated

from app.database import get_db
from app import models
from . import schemas, service

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")

@router.post("/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = service.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email già registrata")
    
    return service.create_user(db=db, user=user)

@router.post("/token", response_model=schemas.Token)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], 
    db: Session = Depends(get_db)
):
    user = service.get_user_by_email(db, email=form_data.username)
    
    if not user or not service.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o password non corretti",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    """Nel payload JWT vengono salvati email e ruolo in italiano ('utente' o 'amministratore')."""
    access_token = service.create_access_token(
        data={"sub": user.email, "role": user.ruolo}
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/verify", response_model=schemas.VerifyResponse)
async def verify_token(token: str):
    payload = service.decode_token(token)
    if not payload:
        return {"valid": False, "error": "Token scaduto o non valido"}
    
    return {
        "valid": True, 
        "email": payload.get("sub"), 
        "ruolo": payload.get("role")
    }

@router.get("/me", response_model=schemas.UserResponse)
async def read_users_me(
    token: Annotated[str, Depends(oauth2_scheme)], 
    db: Session = Depends(get_db)
):
    payload = service.decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token non valido")
        
    user = service.get_user_by_email(db, email=payload.get("sub"))
    if not user:
        raise HTTPException(status_code=404, detail="Utente non trovato")
        
    return user