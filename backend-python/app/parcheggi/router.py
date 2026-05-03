from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models

router = APIRouter()

@router.get("/")
def get_parcheggi(db: Session = Depends(get_db)):
    """Restituisce la lista di tutti i parcheggi."""
    return db.query(models.Parcheggio).all()

@router.post("/")
def create_parcheggio(nome: str, indirizzo: str, posti: int, tariffa: float = 0.0, db: Session = Depends(get_db)):
    """Aggiunge un nuovo parcheggio al database"""
    nuovo_parcheggio = models.Parcheggio(
        nome_parcheggio=nome,
        indirizzo=indirizzo,
        posti_totali=posti,
        posti_liberi=posti,
        tariffa_oraria=tariffa
    )
    db.add(nuovo_parcheggio)
    db.commit()
    db.refresh(nuovo_parcheggio)
    return nuovo_parcheggio

@router.delete("/{id_parcheggio}")
def delete_parcheggio(id_parcheggio: int, db: Session = Depends(get_db)):
    """Elimina un parcheggio esistente"""
    parcheggio = db.query(models.Parcheggio).filter(models.Parcheggio.id_parcheggio == id_parcheggio).first()
    if not parcheggio:
        raise HTTPException(status_code=404, detail="Parcheggio non trovato")
    
    db.delete(parcheggio)
    db.commit()
    return {"message": "Parcheggio eliminato con successo"}