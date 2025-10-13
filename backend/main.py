from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes import auth, contacts

# Créer les tables dans la base de données
Base.metadata.create_all(bind=engine)

# Créer l'application FastAPI
app = FastAPI(
    title="API de Gestion de Contacts",
    description="Une API REST pour gérer vos contacts avec authentification JWT",
    version="1.0.0"
)

# Configuration CORS (à adapter selon vos besoins)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En production, spécifiez les origines autorisées
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclure les routes
app.include_router(auth.router, tags=["Authentification"])
app.include_router(contacts.router, prefix="/contacts", tags=["Contacts"])


@app.get("/")
def root():
    """Route racine"""
    return {
        "message": "Bienvenue sur l'API de Gestion de Contacts",
        "documentation": "/docs"
    }


@app.get("/health")
def health_check():
    """Vérification de l'état de l'API"""
    return {"status": "OK"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
