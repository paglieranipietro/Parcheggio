import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

"""Importazione dei router di autenticazione, parcheggi e prenotazioni."""
from app.auth.router import router as auth_router
from app.parcheggi.router import router as parcheggi_router
from app.prenotazioni.router import router as prenotazioni_router

from app.database import engine
from app.models import Base  

# Creazione Tabelle Automatica (SQLAlchemy)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Parking System SQL - API Backend")

# Configurazione CORS per far comunicare React e FastAPI
origins = ["*"] 
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusione delle rotte
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(parcheggi_router, prefix="/api/v1/parcheggi", tags=["Parcheggi"])
app.include_router(prenotazioni_router, prefix="/api/v1/prenotazioni", tags=["Prenotazioni"])

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)