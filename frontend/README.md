# 📇 Application de Gestion de Contacts

Application web complète de gestion de contacts avec authentification sécurisée.

## 📖 Description du Projet

Ce projet est une **application full-stack** permettant de gérer vos contacts personnels de manière sécurisée. Chaque utilisateur peut créer un compte, se connecter et gérer sa propre liste de contacts (ajout, modification, suppression).

### 🎯 Objectif
Créer une solution simple et efficace pour organiser vos contacts avec une interface moderne et une API robuste.

## 🏗️ Architecture

Le projet est divisé en deux parties :

### **Backend - FastAPI** (`/backend`)
- **Framework** : FastAPI (Python)
- **Base de données** : SQLite avec SQLAlchemy ORM
- **Authentification** : JWT (JSON Web Tokens)
- **Sécurité** : Mots de passe hashés avec bcrypt
- **Documentation** : Swagger UI automatique
- **API REST** : Endpoints CRUD complets

### **Frontend - React TypeScript** (`/frontend`)
- **Framework** : React 18 avec TypeScript
- **Gestion d'état** : Context API
- **Requêtes HTTP** : Fetch API
- **Styling** : CSS3 avec animations
- **Design** : Interface responsive et moderne

## ✨ Fonctionnalités

### 🔐 Authentification
- ✅ Inscription avec validation (username, email, mot de passe)
- ✅ Connexion sécurisée avec token JWT
- ✅ Déconnexion avec nettoyage du localStorage
- ✅ Protection des routes avec authentification

### 📇 Gestion des Contacts
- ✅ **Créer** un nouveau contact (nom, email, téléphone)
- ✅ **Afficher** la liste de tous vos contacts
- ✅ **Modifier** les informations d'un contact
- ✅ **Supprimer** un contact (avec confirmation)
- ✅ Chaque utilisateur voit uniquement ses propres contacts

### 🎨 Interface Utilisateur
- ✅ Design moderne avec dégradés et animations
- ✅ Responsive (mobile, tablette, desktop)
- ✅ Formulaires inline intuitifs
- ✅ Cartes de contacts avec effet hover
- ✅ Messages d'erreur clairs
- ✅ Feedback visuel sur les actions

## 🚀 Installation et Lancement

### Prérequis
- Python 3.8+
- Node.js 14+
- npm ou yarn

### 1. Backend (FastAPI)

```bash
# Aller dans le dossier backend
cd backend

# Créer un environnement virtuel
python -m venv venv
source venv/bin/activate  # macOS/Linux
# ou venv\Scripts\activate  # Windows

# Installer les dépendances
pip install -r requirements.txt

# Lancer le serveur
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Le backend sera accessible sur **http://127.0.0.1:8000**

### 2. Frontend (React)

```bash
# Aller dans le dossier frontend
cd frontend

# Installer les dépendances
npm install

# Lancer l'application
npm start
```

Le frontend sera accessible sur **http://localhost:3000**

## 📱 Utilisation

1. **Première visite** : Cliquez sur "S'inscrire" et créez votre compte
2. **Connexion** : Entrez vos identifiants pour vous connecter
3. **Ajouter un contact** : Remplissez le formulaire en haut de la page
4. **Gérer vos contacts** :
   - ✏️ Cliquez sur le bouton jaune pour modifier
   - 🗑️ Cliquez sur le bouton rouge pour supprimer

## 🔗 Endpoints API

### Authentification
- `POST /register` - Inscription
- `POST /login` - Connexion

### Contacts (authentification requise)
- `GET /contacts` - Liste des contacts
- `POST /contacts` - Créer un contact
- `GET /contacts/{id}` - Détails d'un contact
- `PUT /contacts/{id}` - Modifier un contact
- `DELETE /contacts/{id}` - Supprimer un contact

## 🛠️ Technologies Utilisées

### Backend
- FastAPI 0.104+
- SQLAlchemy (ORM)
- Pydantic (validation)
- python-jose (JWT)
- passlib + bcrypt (hashing)
- uvicorn (serveur ASGI)

### Frontend
- React 18
- TypeScript 5
- CSS3
- Fetch API

## 📂 Structure du Projet

```
Project-FastAPI/
├── backend/
│   ├── main.py              # Point d'entrée FastAPI
│   ├── database.py          # Config base de données
│   ├── models.py            # Modèles SQLAlchemy
│   ├── schemas.py           # Schémas Pydantic
│   ├── auth.py              # Logique JWT
│   └── routes/
│       ├── auth.py          # Routes authentification
│       └── contacts.py      # Routes contacts
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/      # Composants React
        │   ├── Auth.tsx
        │   ├── ContactList.tsx
        │   ├── ContactForm.tsx
        │   └── ContactCard.tsx
        ├── context/         # Context API
        │   └── AuthContext.tsx
        ├── types.ts         # Types TypeScript
        ├── api.ts           # Fonctions API
        └── App.tsx          # Composant principal
```

## 🔒 Sécurité

- ✅ Mots de passe hashés (bcrypt)
- ✅ Tokens JWT avec expiration (30 minutes)
- ✅ CORS configuré
- ✅ Validation des données (Pydantic)
- ✅ Protection des endpoints
- ✅ Isolation des données utilisateur

⚠️ **Important** : Changez la `SECRET_KEY` dans `backend/auth.py` avant tout déploiement en production !

## 📊 Modèles de Données

### User
- `id`: integer (clé primaire)
- `username`: string (unique)
- `email`: string (unique)
- `hashed_password`: string

### Contact
- `id`: integer (clé primaire)
- `nom`: string
- `email`: string
- `telephone`: string
- `user_id`: integer (clé étrangère vers User)

## 🎓 Apprentissage

Ce projet démontre :
- Architecture REST API complète
- Authentification JWT
- CRUD avec base de données
- Frontend moderne en TypeScript
- Séparation backend/frontend
- Gestion d'état avec Context API
- Typage strict avec TypeScript

## 🤝 Contribution

Libre d'utilisation pour vos projets personnels ou commerciaux.

## 📝 Licence

MIT License - Utilisez librement ce code !

---

💡 **Conseil** : Consultez la documentation Swagger à l'adresse http://127.0.0.1:8000/docs une fois le backend lancé pour tester directement les endpoints de l'API.
