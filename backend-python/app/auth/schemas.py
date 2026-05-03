from pydantic import BaseModel, EmailStr
from typing import Optional

"""Schema per i dati di registrazione dell'utente."""
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    nome: str        
    cognome: str     

# Output Utente (senza password!)
class UserResponse(BaseModel):
    id_utente: str   
    email: EmailStr
    nome: str
    cognome: str
    ruolo: str       

    class Config:
        from_attributes = True

# Output Token JWT (Standard OAuth2 in inglese)
class Token(BaseModel):
    access_token: str
    token_type: str

# Output Verifica (per PHP)
class VerifyResponse(BaseModel):
    valid: bool
    email: Optional[str] = None
    ruolo: Optional[str] = None
    error: Optional[str] = None