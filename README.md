# API de Gestion de Contacts avec FastAPI

Une API REST complète pour gérer vos contacts avec authentification JWT.

## 🚀 Fonctionnalités

- ✅ **Authentification JWT** : Inscription et connexion sécurisées
- ✅ **Gestion des contacts** : CRUD complet (Créer, Lire, Mettre à jour, Supprimer)
- ✅ **Sécurité** : Mots de passe hashés avec bcrypt
- ✅ **Base de données SQLite** : Simple et facile à utiliser
- ✅ **Documentation automatique** : Swagger UI et ReDoc

## 📁 Structure du projet

```
Project-FastAPI/
├── main.py              # Point d'entrée de l'application
├── database.py          # Configuration de la base de données
├── models.py            # Modèles SQLAlchemy
├── schemas.py           # Schémas Pydantic
├── auth.py              # Logique d'authentification JWT
├── routes/
│   ├── __init__.py
│   ├── auth.py          # Routes d'authentification
│   └── contacts.py      # Routes des contacts
├── requirements.txt     # Dépendances Python
└── README.md           # Ce fichier
```

## 🛠️ Installation

### 1. Cloner le projet

```bash
git clone <votre-repo>
cd Project-FastAPI
```

### 2. Créer un environnement virtuel

```bash
python -m venv venv
source venv/bin/activate  # Sur macOS/Linux
# ou
venv\Scripts\activate  # Sur Windows
```

### 3. Installer les dépendances

```bash
pip install -r requirements.txt
```

## 🚀 Lancement de l'application

```bash
uvicorn main:app --reload
```

L'API sera accessible à l'adresse : `http://localhost:8000`

## 📚 Documentation

Une fois l'application lancée, accédez à :
- **Swagger UI** : http://localhost:8000/docs
- **ReDoc** : http://localhost:8000/redoc

## 🔐 Utilisation de l'API

### 1. Inscription d'un utilisateur

```bash
POST /register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "motdepasse123"
}
```

### 2. Connexion

```bash
POST /login
Content-Type: application/x-www-form-urlencoded

username=john_doe&password=motdepasse123
```

Vous recevrez un token JWT :
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### 3. Créer un contact

```bash
POST /contacts/
Authorization: Bearer <votre_token>
Content-Type: application/json

{
  "nom": "Alice Martin",
  "email": "alice@example.com",
  "telephone": "+33612345678"
}
```

### 4. Lister les contacts

```bash
GET /contacts/
Authorization: Bearer <votre_token>
```

### 5. Récupérer un contact spécifique

```bash
GET /contacts/{contact_id}
Authorization: Bearer <votre_token>
```

### 6. Mettre à jour un contact

```bash
PUT /contacts/{contact_id}
Authorization: Bearer <votre_token>
Content-Type: application/json

{
  "nom": "Alice Dupont",
  "telephone": "+33698765432"
}
```

### 7. Supprimer un contact

```bash
DELETE /contacts/{contact_id}
Authorization: Bearer <votre_token>
```

## 🔒 Sécurité

- Les mots de passe sont hashés avec bcrypt
- L'authentification utilise JWT (JSON Web Tokens)
- Chaque utilisateur ne peut accéder qu'à ses propres contacts
- **⚠️ IMPORTANT** : Changez la `SECRET_KEY` dans `auth.py` avant de déployer en production !

```python
# Dans auth.py, ligne 13
SECRET_KEY = "votre_cle_secrete_super_securisee_a_changer_en_production"
```

## 🧪 Tests avec cURL

### Inscription
```bash
curl -X POST "http://localhost:8000/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"test123"}'
```

### Connexion
```bash
curl -X POST "http://localhost:8000/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test&password=test123"
```

### Créer un contact (remplacez TOKEN par votre token)
```bash
curl -X POST "http://localhost:8000/contacts/" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nom":"Jean Dupont","email":"jean@example.com","telephone":"0612345678"}'
```

## 📝 Modèles de données

### User
- `id` : Identifiant unique
- `username` : Nom d'utilisateur (unique)
- `email` : Email (unique)
- `hashed_password` : Mot de passe hashé

### Contact
- `id` : Identifiant unique
- `nom` : Nom du contact
- `email` : Email du contact
- `telephone` : Numéro de téléphone
- `user_id` : Référence à l'utilisateur propriétaire

## 🛠️ Technologies utilisées

- **FastAPI** : Framework web moderne et rapide
- **SQLAlchemy** : ORM pour la gestion de la base de données
- **Pydantic** : Validation des données
- **python-jose** : Gestion des JWT
- **passlib** : Hachage des mots de passe
- **uvicorn** : Serveur ASGI

## 📄 Licence

Ce projet est libre d'utilisation pour vos projets personnels et commerciaux.
