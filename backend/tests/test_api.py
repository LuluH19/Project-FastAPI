"""
Tests unitaires pour l'API de gestion de contacts
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from main import app
from database import Base, get_db

# Créer une base de données en mémoire pour les tests
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Créer les tables
Base.metadata.create_all(bind=engine)


def override_get_db():
    """Override de la dépendance get_db pour les tests"""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


@pytest.fixture
def test_user():
    """Fixture pour créer un utilisateur de test"""
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpassword123"
    }
    response = client.post("/register", json=user_data)
    assert response.status_code == 201
    return user_data


@pytest.fixture
def auth_token(test_user):
    """Fixture pour obtenir un token d'authentification"""
    response = client.post(
        "/login",
        data={"username": test_user["username"], "password": test_user["password"]}
    )
    assert response.status_code == 200
    return response.json()["access_token"]


# Tests de santé
def test_health_check():
    """Test du endpoint de santé"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "OK"}


def test_root():
    """Test du endpoint racine"""
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()


# Tests d'authentification
def test_register_user():
    """Test de l'inscription d'un utilisateur"""
    response = client.post(
        "/register",
        json={
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "password123"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "newuser"
    assert data["email"] == "newuser@example.com"
    assert "id" in data


def test_register_duplicate_username(test_user):
    """Test de l'inscription avec un nom d'utilisateur existant"""
    response = client.post(
        "/register",
        json={
            "username": test_user["username"],
            "email": "another@example.com",
            "password": "password123"
        }
    )
    assert response.status_code == 400


def test_register_duplicate_email(test_user):
    """Test de l'inscription avec un email existant"""
    response = client.post(
        "/register",
        json={
            "username": "anotheruser",
            "email": test_user["email"],
            "password": "password123"
        }
    )
    assert response.status_code == 400


def test_login_success(test_user):
    """Test de connexion réussie"""
    response = client.post(
        "/login",
        data={"username": test_user["username"], "password": test_user["password"]}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(test_user):
    """Test de connexion avec mauvais mot de passe"""
    response = client.post(
        "/login",
        data={"username": test_user["username"], "password": "wrongpassword"}
    )
    assert response.status_code == 401


def test_login_wrong_username():
    """Test de connexion avec mauvais nom d'utilisateur"""
    response = client.post(
        "/login",
        data={"username": "nonexistent", "password": "password"}
    )
    assert response.status_code == 401


# Tests des contacts
def test_create_contact(auth_token):
    """Test de création d'un contact"""
    response = client.post(
        "/contacts/",
        json={
            "nom": "Jean Dupont",
            "email": "jean@example.com",
            "telephone": "+33612345678"
        },
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["nom"] == "Jean Dupont"
    assert data["email"] == "jean@example.com"
    assert "id" in data


def test_create_contact_without_auth():
    """Test de création d'un contact sans authentification"""
    response = client.post(
        "/contacts/",
        json={
            "nom": "Jean Dupont",
            "email": "jean@example.com",
            "telephone": "+33612345678"
        }
    )
    assert response.status_code == 401


def test_get_contacts(auth_token):
    """Test de récupération de la liste des contacts"""
    # Créer quelques contacts
    for i in range(3):
        client.post(
            "/contacts/",
            json={
                "nom": f"Contact {i}",
                "email": f"contact{i}@example.com",
                "telephone": f"+3361234567{i}"
            },
            headers={"Authorization": f"Bearer {auth_token}"}
        )
    
    response = client.get(
        "/contacts/",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 3


def test_get_contact_by_id(auth_token):
    """Test de récupération d'un contact par ID"""
    # Créer un contact
    create_response = client.post(
        "/contacts/",
        json={
            "nom": "Alice Martin",
            "email": "alice@example.com",
            "telephone": "+33698765432"
        },
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    contact_id = create_response.json()["id"]
    
    # Récupérer le contact
    response = client.get(
        f"/contacts/{contact_id}",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["nom"] == "Alice Martin"


def test_get_nonexistent_contact(auth_token):
    """Test de récupération d'un contact inexistant"""
    response = client.get(
        "/contacts/99999",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 404


def test_update_contact(auth_token):
    """Test de mise à jour d'un contact"""
    # Créer un contact
    create_response = client.post(
        "/contacts/",
        json={
            "nom": "Bob Ancien",
            "email": "bob@example.com",
            "telephone": "+33611111111"
        },
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    contact_id = create_response.json()["id"]
    
    # Mettre à jour le contact
    response = client.put(
        f"/contacts/{contact_id}",
        json={
            "nom": "Bob Nouveau",
            "telephone": "+33622222222"
        },
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["nom"] == "Bob Nouveau"
    assert data["telephone"] == "+33622222222"


def test_delete_contact(auth_token):
    """Test de suppression d'un contact"""
    # Créer un contact
    create_response = client.post(
        "/contacts/",
        json={
            "nom": "Contact à supprimer",
            "email": "delete@example.com",
            "telephone": "+33600000000"
        },
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    contact_id = create_response.json()["id"]
    
    # Supprimer le contact
    response = client.delete(
        f"/contacts/{contact_id}",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 204
    
    # Vérifier que le contact n'existe plus
    get_response = client.get(
        f"/contacts/{contact_id}",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert get_response.status_code == 404


def test_user_isolation(auth_token):
    """Test que les utilisateurs ne peuvent voir que leurs propres contacts"""
    # Créer un contact avec le premier utilisateur
    client.post(
        "/contacts/",
        json={
            "nom": "Contact User 1",
            "email": "user1@example.com",
            "telephone": "+33611111111"
        },
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    
    # Créer un deuxième utilisateur
    client.post(
        "/register",
        json={
            "username": "user2",
            "email": "user2@example.com",
            "password": "password123"
        }
    )
    login_response = client.post(
        "/login",
        data={"username": "user2", "password": "password123"}
    )
    user2_token = login_response.json()["access_token"]
    
    # Vérifier que user2 ne voit pas les contacts de user1
    response = client.get(
        "/contacts/",
        headers={"Authorization": f"Bearer {user2_token}"}
    )
    assert response.status_code == 200
    assert len(response.json()) == 0
