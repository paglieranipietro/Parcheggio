from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

"""Configurazione della stringa di connessione al database. In produzione, utilizzare variabili d'ambiente con MariaDB."""
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./auth.db")

# Configurazione specifica per SQLite (check_same_thread=False necessario solo per SQLite)
connect_args = {"check_same_thread": False} if "sqlite" in SQLALCHEMY_DATABASE_URL else {}

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args=connect_args
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Funzione per ottenere la sessione DB (Dependency Injection)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()