# 🅿️ Green Parking Brescia

Sistema di gestione parcheggi intelligente per la città di Brescia, con focus sulla sostenibilità ambientale e la riduzione delle emissioni di CO₂.

## 📋 Indice

- [Architettura](#-architettura)
- [Tecnologie](#-tecnologie)
- [Installazione](#-installazione)
- [Avvio](#-avvio)
- [Funzionalità](#-funzionalità)
- [API Backend](#-api-backend)
- [Struttura Progetto](#-struttura-progetto)
- [Account Demo](#-account-demo)
- [Limitazioni e Note](#-limitazioni-e-note)

---

## 🏗️ Architettura

Il progetto è suddiviso in due componenti principali:

| Componente | Tecnologia | Porta |
|------------|-----------|-------|
| **Frontend** | React + Vite + TailwindCSS | `5173` |
| **Backend** | FastAPI + SQLAlchemy + SQLite | `8000` |

> **Nota**: Attualmente il frontend utilizza un **mockApi** locale (dati simulati in memoria) per la gestione dei parcheggi e delle prenotazioni. Il backend è strutturato e funzionante ma **non ancora collegato** al frontend.

---

## 🛠️ Tecnologie

### Frontend
- **React 19** — UI dichiarativa a componenti
- **Vite 7** — Build tool e dev server
- **React Router DOM 7** — Routing SPA
- **TailwindCSS 3** — Utility-first CSS framework
- **Axios** — Client HTTP (pronto per il collegamento API)

### Backend
- **FastAPI** — Framework API ad alte prestazioni
- **SQLAlchemy** — ORM per la gestione del database
- **SQLite** — Database locale (pronto per migrazione a MariaDB/MySQL)
- **JWT (PyJWT)** — Autenticazione basata su token
- **bcrypt** — Hashing sicuro delle password
- **Uvicorn** — ASGI server
- **Pydantic** — Validazione dati

### Librerie Aggiuntive (Backend)
- **pandas**, **numpy** — Analisi dati
- **scikit-learn** — Machine Learning (predisposizione futura)
- **matplotlib**, **seaborn** — Visualizzazione dati e grafici
- **email-validator** — Validazione email
- **python-dotenv** — Gestione variabili d'ambiente

---

## 📦 Installazione

### Prerequisiti
- **Node.js** (v18+)
- **Python** (v3.12+)
- **uv** (gestore pacchetti Python) — [Installazione uv](https://docs.astral.sh/uv/)

### Frontend
```bash
cd frontend
npm install
```

### Backend
```bash
cd backend-python
uv sync
```

---

## 🚀 Avvio

### Backend (porta 8000)
```bash
cd backend-python
uv run python main.py
```
Il server parte su `http://localhost:8000`. La documentazione Swagger è disponibile su `http://localhost:8000/docs`.

### Frontend (porta 5173)
```bash
cd frontend
npm run dev
```
L'app parte su `http://localhost:5173`.

---

## ✅ Funzionalità

### 🔐 Autenticazione
- **Login** con email e password (mock nel frontend, JWT nel backend)
- **Registrazione** nuovo utente
- **Routing protetto**: le pagine private richiedono autenticazione
- **Redirect automatico** in base al ruolo (`user` → Dashboard Utente, `admin` → Dashboard Admin)
- **Logout** con reset dello stato

### 👤 Dashboard Utente
- **Visualizzazione parcheggi** disponibili a Brescia con posti liberi e tariffa
- **Prenotazione parcheggio** con selezione di:
  - Data (non nel passato)
  - Orario di arrivo (con validazione temporale)
  - Durata (1–24 ore)
- **Calcolo automatico del prezzo** in base a tariffa × durata
- **Verifica disponibilità in tempo reale** con controllo di sovrapposizione temporale
- **Codice univoco** generato per ogni prenotazione (formato `GRN-XXXXXX`)
- **Lista prenotazioni** con:
  - Ricerca per codice univoco
  - Filtro per stato (attive / scadute / annullate)
  - Stato calcolato dinamicamente (attiva, scaduta, annullata)
- **Modifica prenotazione** attiva (data, ora, durata) con ricontrollo disponibilità
- **Cancellazione prenotazione** (contrassegnata come annullata)
- **Gestione profilo** con modifica inline dei dati personali
- **Gestione targhe**:
  - Aggiunta targhe con validazione formato italiano (AA123BB)
  - Rimozione targhe
  - Selezione targa attiva per la prenotazione
  - Verifica duplicati

### 🛡️ Dashboard Admin
- **Controllo di accesso**: solo utenti con ruolo `admin` possono accedere
- **Gestione parcheggi**:
  - Elenco parcheggi con selezione interattiva
  - Aggiunta nuovo parcheggio (nome, indirizzo, posti, tariffa) tramite modal
  - Rimozione parcheggio tramite modal con selezione da dropdown
- **Visualizzazione posti** del parcheggio selezionato con griglia grafica
- **Statistiche** del parcheggio selezionato (posti disponibili / occupati)

### 🎨 UI/UX
- **Design system** custom con variabili CSS (`lib-primary`, `lib-dark`, ecc.)
- **Dark mode** nativa
- **Layout responsive**
- **Animazioni e transizioni** fluide
- **Modal** per form di prenotazione, modifica, e gestione account

---

## 📡 API Backend

Il backend espone le seguenti API raggruppate per modulo:

### Auth (`/api/v1/auth`)
| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| `POST` | `/register` | Registrazione nuovo utente |
| `POST` | `/token` | Login (restituisce JWT) |
| `GET` | `/verify` | Verifica validità di un token |
| `GET` | `/me` | Dati dell'utente autenticato |

### Parcheggi (`/api/v1/parcheggi`)
| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| `GET` | `/` | Lista di tutti i parcheggi |
| `POST` | `/` | Aggiunta nuovo parcheggio |
| `DELETE` | `/{id_parcheggio}` | Eliminazione parcheggio |

### Prenotazioni (`/api/v1/prenotazioni`)
| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| `POST` | `/` | Creazione nuova prenotazione |
| `GET` | `/utente/{id_utente}` | Prenotazioni di un utente |

---

## 📁 Struttura Progetto

```
Parcheggio/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── AdminStats.jsx        # Statistiche parcheggio selezionato
│   │   │   │   ├── ParkingForm.jsx       # Gestione CRUD parcheggi (admin)
│   │   │   │   └── ParkingTable.jsx      # Griglia visiva dei posti
│   │   │   ├── auth/
│   │   │   │   └── LoginForm.jsx         # Form di login
│   │   │   ├── layout/
│   │   │   │   └── Header.jsx            # Header con navigazione
│   │   │   └── user/
│   │   │       ├── AccountSettings.jsx   # Gestione profilo + targhe
│   │   │       ├── BookingForm.jsx       # Form prenotazione
│   │   │       ├── BookingList.jsx       # Lista prenotazioni
│   │   │       ├── EditBookingForm.jsx   # Modifica prenotazione
│   │   │       └── ParkingList.jsx       # Lista parcheggi disponibili
│   │   ├── context/
│   │   │   ├── AuthContext.jsx           # Stato globale autenticazione
│   │   │   └── ThemeContext.jsx          # Gestione tema (predisposizione)
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx        # Pagina admin
│   │   │   ├── Login.jsx                 # Pagina login
│   │   │   ├── Register.jsx             # Pagina registrazione
│   │   │   └── UserDashboard.jsx        # Pagina utente
│   │   ├── services/
│   │   │   └── mockApi.js               # API simulata (dati in memoria)
│   │   ├── App.jsx                       # Routing principale
│   │   ├── main.jsx                      # Entry point React
│   │   └── index.css                     # Stili globali + design system
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── backend-python/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── router.py                 # Endpoint autenticazione
│   │   │   ├── schemas.py                # Schemi Pydantic (validazione)
│   │   │   └── service.py               # Logica JWT + hashing password
│   │   ├── parcheggi/
│   │   │   └── router.py                # CRUD parcheggi
│   │   ├── prenotazioni/
│   │   │   └── router.py                # Gestione prenotazioni
│   │   ├── database.py                   # Connessione DB (SQLite/MySQL)
│   │   └── models.py                     # Modelli SQLAlchemy
│   ├── main.py                           # Entry point FastAPI
│   ├── pyproject.toml                    # Dipendenze Python
│   ├── uv.lock                           # Lockfile dipendenze
│   └── auth.db                           # Database SQLite locale
│
└── README.md
```

---

## 🔑 Account Demo

Il frontend include account di test nel mockApi:

| Ruolo | Email | Password |
|-------|-------|----------|
| **Admin** | `admin@brescia.it` | `password123` |
| **Utente** | `studente@gmail.com` | `user2026` |

---

## ⚠️ Limitazioni e Note

### Frontend → Backend non collegati
- Il frontend utilizza un **mockApi** con dati in memoria. I dati vengono persi al refresh della pagina.
- Il backend è funzionante e testabile tramite Swagger (`/docs`), ma le chiamate dal frontend non sono ancora indirizzate alle API reali.
- Per il collegamento futuro: sostituire le chiamate in `mockApi.js` con chiamate **Axios** verso `http://localhost:8000/api/v1/`.

### Autenticazione
- Il **frontend** utilizza un sistema di autenticazione simulato (mock): l'utente viene salvato nello state React, senza token.
- Il **backend** ha un'autenticazione completa con JWT e bcrypt, ma non è integrata con il frontend.
- Non c'è persistenza della sessione: al refresh della pagina l'utente deve rifare il login.

### Database
- Il backend usa **SQLite** come database di sviluppo (`auth.db`). È predisposto per la migrazione a MariaDB/MySQL cambiando la variabile `DATABASE_URL` nel file `.env`.
- Le tabelle vengono create automaticamente all'avvio del server tramite `Base.metadata.create_all()`.

### Admin Dashboard
- Le **statistiche dei posti occupati** sono statiche (sempre 0), in quanto non ancora collegate ai dati delle prenotazioni reali.
- La **griglia dei posti** è puramente visiva e non riflette lo stato reale di occupazione.

### Prenotazioni (Frontend)
- I **posti disponibili** vengono calcolati lato client con logica di sovrapposizione temporale, ma non sono sincronizzati con un backend.
- Il **codice univoco** della prenotazione è generato lato client e non garantisce unicità globale.
- Il polling automatico di aggiornamento posti avviene ogni 30 secondi, ma solo su dati locali.

### Funzionalità Predisposte (Non ancora attive)
- **ThemeContext**: struttura per il cambio tema chiaro/scuro, non ancora implementata visivamente.
- **Librerie ML**: scikit-learn, pandas e numpy sono installati nel backend in previsione di analisi predittive (es. previsione occupazione parcheggi).
- **Statistiche Emissioni**: il modello `StatisticaEmissioni` nel database è pronto ma non ancora popolato.
- **Coordinate GPS**: i campi `latitudine` e `longitudine` nel modello Parcheggio sono pronti per l'integrazione con mappe.

---

## 👥 Autori

Progetto sviluppato per il corso di studi — Brescia, 2026.
