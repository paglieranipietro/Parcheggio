from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
import random
import string
from datetime import datetime

router = APIRouter()

def genera_codice_green():
    """Genera un codice univoco alfanumerico per lo Scenario Green"""
    random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"GRN-{random_str}"

@router.post("/")
def create_prenotazione(id_utente: str, id_parcheggio: int, data_inizio: datetime, data_fine: datetime, db: Session = Depends(get_db)):
    """Crea una nuova prenotazione e scala i posti disponibili dal parcheggio"""
    parcheggio = db.query(models.Parcheggio).filter(models.Parcheggio.id_parcheggio == id_parcheggio).first()
    
    if not parcheggio or parcheggio.posti_liberi <= 0:
        raise HTTPException(status_code=400, detail="Parcheggio pieno o non trovato")

    # Riduciamo i posti liberi di 1
    parcheggio.posti_liberi -= 1

    nuova_prenotazione = models.Prenotazione(
        codice_prenotazione=genera_codice_green(),
        id_utente=id_utente,
        id_parcheggio=id_parcheggio,
        data_ora_inizio=data_inizio,
        data_ora_fine=data_fine,
        stato_prenotazione="confermata"
    )
    db.add(nuova_prenotazione)
    db.commit()
    db.refresh(nuova_prenotazione)
    return nuova_prenotazione

@router.get("/utente/{id_utente}")
def get_prenotazioni_utente(id_utente: str, db: Session = Depends(get_db)):
    """Restituisce tutte le prenotazioni fatte da un singolo utente"""
    return db.query(models.Prenotazione).filter(models.Prenotazione.id_utente == id_utente).all()