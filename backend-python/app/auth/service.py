import os
import uuid6
import jwt
import bcrypt
from datetime import datetime, timedelta, timezone
from typing import Optional
from sqlalchemy.orm import Session

from app import models  
from . import schemas

"""Variabili di configurazione per JWT (Secret Key, Algoritmo, Durata Token)."""
SECRET_KEY = os.getenv("JWT_SECRET", "secret")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

# --- Hashing & Token ---
def get_password_hash(password: str) -> str:
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except ValueError:
        return False

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.PyJWTError:
        return None

# --- DATABASE OPERATIONS ---
def get_user_by_email(db: Session, email: str):
    return db.query(models.Utente).filter(models.Utente.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    new_id = str(uuid6.uuid7())
    hashed_pwd = get_password_hash(user.password)
    
    db_user = models.Utente(
        id_utente=new_id,
        email=user.email,
        password_hash=hashed_pwd,
        nome=user.nome,
        cognome=user.cognome,
        ruolo="utente"  # Valore di default in italiano
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user