from sqlalchemy import Column, String, Integer, DateTime, Date, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

"""Modello di tabella per la gestione degli utenti."""
class Utente(Base):
    __tablename__ = "utenti"

    id_utente = Column(String(36), primary_key=True, index=True) # Conterrà l'UUIDv7
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    
    nome = Column(String(100))
    cognome = Column(String(100))
    
    # Ruolo: "utente" o "amministratore"
    ruolo = Column(String(20), default="utente", server_default="utente") 
    
    # Timestamp automatici
    data_creazione = Column(DateTime, default=func.now(), server_default=func.now())
    data_aggiornamento = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relazioni (Permettono a SQLAlchemy di navigare tra le tabelle)
    prenotazioni = relationship("Prenotazione", back_populates="utente")


# 2. TABELLA PARCHEGGI
class Parcheggio(Base):
    __tablename__ = "parcheggi"

    id_parcheggio = Column(Integer, primary_key=True, autoincrement=True)
    nome_parcheggio = Column(String(150), nullable=False)
    indirizzo = Column(String(255))
    citta = Column(String(100))
    
    # Coordinate per le mappe (Numeric = DECIMAL in SQL)
    latitudine = Column(Numeric(10, 8))
    longitudine = Column(Numeric(11, 8))
    
    posti_totali = Column(Integer)
    posti_liberi = Column(Integer)
    tariffa_oraria = Column(Numeric(6, 2))
    
    data_creazione = Column(DateTime, default=func.now(), server_default=func.now())

    # Relazioni
    prenotazioni = relationship("Prenotazione", back_populates="parcheggio")
    statistiche = relationship("StatisticaEmissioni", back_populates="parcheggio")


# 3. TABELLA PRENOTAZIONI
class Prenotazione(Base):
    __tablename__ = "prenotazioni"

    id_prenotazione = Column(Integer, primary_key=True, autoincrement=True)
    codice_prenotazione = Column(String(20), unique=True, index=True, nullable=False)
    
    # Chiavi Esterne (Foreign Keys) collegate alle altre tabelle
    id_utente = Column(String(36), ForeignKey("utenti.id_utente"), nullable=False)
    id_parcheggio = Column(Integer, ForeignKey("parcheggi.id_parcheggio"), nullable=False)
    
    data_ora_inizio = Column(DateTime, nullable=False)
    data_ora_fine = Column(DateTime, nullable=False)
    
    # Stati possibili: 'in_attesa', 'confermata', 'cancellata', 'completata'
    stato_prenotazione = Column(String(20), default="in_attesa") 
    costo_stimato = Column(Numeric(8, 2))
    
    data_creazione = Column(DateTime, default=func.now(), server_default=func.now())
    data_aggiornamento = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relazioni
    utente = relationship("Utente", back_populates="prenotazioni")
    parcheggio = relationship("Parcheggio", back_populates="prenotazioni")


# 4. TABELLA STATISTICHE EMISSIONI (Opzionale/Dashboard)
class StatisticaEmissioni(Base):
    __tablename__ = "statistiche_emissioni"

    id_statistica = Column(Integer, primary_key=True, autoincrement=True)
    
    # Se è NULL, la statistica riguarda tutta la città e non un singolo parcheggio
    id_parcheggio = Column(Integer, ForeignKey("parcheggi.id_parcheggio"), nullable=True)
    
    data_inizio_periodo = Column(Date, nullable=False)
    data_fine_periodo = Column(Date, nullable=False)
    
    numero_prenotazioni = Column(Integer, default=0)
    co2_risparmiata_kg = Column(Numeric(10, 2), default=0.00)
    tempo_ricerca_risparmiato_minuti = Column(Numeric(8, 2), default=0.00)
    
    data_calcolo = Column(DateTime, default=func.now(), server_default=func.now())

    # Relazioni
    parcheggio = relationship("Parcheggio", back_populates="statistiche")