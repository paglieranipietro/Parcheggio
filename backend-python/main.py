import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.auth.router import router as auth_router

from app.database import engine
from app.models import Base  

# CREAZIONE TABELLE AUTOMATICA
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Parking Auth System SQL")


# ... (Configurazione CORS resta uguale a prima) ...
origins = ["*"] # Per brevità qui metto *, usa quella di prima
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1/auth", tags=["Auth"])

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
