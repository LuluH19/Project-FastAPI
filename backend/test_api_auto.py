"""
Script de test automatique pour l'API de gestion de contacts
Utilise requests pour tester tous les endpoints
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def print_response(title, response):
    """Affiche joliment la réponse"""
    print(f"\n{'='*60}")
    print(f"🔹 {title}")
    print(f"{'='*60}")
    print(f"Status Code: {response.status_code}")
    try:
        print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    except:
        print(f"Response: {response.text}")

def test_api():
    """Test complet de l'API"""
    
    # 1. Vérifier que l'API est en ligne
    print("\n🚀 Démarrage des tests de l'API de gestion de contacts")
    response = requests.get(f"{BASE_URL}/health")
    print_response("1. Health Check", response)
    
    # 2. Inscription d'un nouvel utilisateur
    user_data = {
        "username": "testuser123",
        "email": "test123@example.com",
        "password": "password123"
    }
    response = requests.post(f"{BASE_URL}/register", json=user_data)
    print_response("2. Inscription", response)
    
    # 3. Connexion
    login_data = {
        "username": "testuser123",
        "password": "password123"
    }
    response = requests.post(f"{BASE_URL}/login", data=login_data)
    print_response("3. Connexion", response)
    
    if response.status_code != 200:
        print("❌ Échec de la connexion. Arrêt des tests.")
        return
    
    # Récupérer le token
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print(f"\n✅ Token JWT récupéré: {token[:50]}...")
    
    # 4. Créer un contact
    contact_data = {
        "nom": "Jean Dupont",
        "email": "jean.dupont@example.com",
        "telephone": "+33612345678"
    }
    response = requests.post(f"{BASE_URL}/contacts/", json=contact_data, headers=headers)
    print_response("4. Création d'un contact", response)
    
    if response.status_code == 201:
        contact_id = response.json()["id"]
        print(f"\n✅ Contact créé avec l'ID: {contact_id}")
    else:
        print("❌ Échec de la création du contact")
        return
    
    # 5. Créer un deuxième contact
    contact_data2 = {
        "nom": "Marie Martin",
        "email": "marie.martin@example.com",
        "telephone": "+33698765432"
    }
    response = requests.post(f"{BASE_URL}/contacts/", json=contact_data2, headers=headers)
    print_response("5. Création d'un deuxième contact", response)
    
    # 6. Lister tous les contacts
    response = requests.get(f"{BASE_URL}/contacts/", headers=headers)
    print_response("6. Liste de tous les contacts", response)
    
    # 7. Récupérer un contact spécifique
    response = requests.get(f"{BASE_URL}/contacts/{contact_id}", headers=headers)
    print_response(f"7. Récupération du contact #{contact_id}", response)
    
    # 8. Mettre à jour un contact
    update_data = {
        "nom": "Jean Martin",
        "telephone": "+33687654321"
    }
    response = requests.put(f"{BASE_URL}/contacts/{contact_id}", json=update_data, headers=headers)
    print_response(f"8. Mise à jour du contact #{contact_id}", response)
    
    # 9. Vérifier la mise à jour
    response = requests.get(f"{BASE_URL}/contacts/{contact_id}", headers=headers)
    print_response(f"9. Vérification de la mise à jour", response)
    
    # 10. Supprimer un contact
    response = requests.delete(f"{BASE_URL}/contacts/{contact_id}", headers=headers)
    print_response(f"10. Suppression du contact #{contact_id}", response)
    
    # 11. Vérifier la suppression
    response = requests.get(f"{BASE_URL}/contacts/{contact_id}", headers=headers)
    print_response(f"11. Vérification de la suppression (devrait échouer)", response)
    
    # 12. Lister les contacts restants
    response = requests.get(f"{BASE_URL}/contacts/", headers=headers)
    print_response("12. Liste finale des contacts", response)
    
    print("\n" + "="*60)
    print("✅ Tests terminés avec succès!")
    print("="*60)

if __name__ == "__main__":
    try:
        test_api()
    except requests.exceptions.ConnectionError:
        print("\n❌ Erreur: Impossible de se connecter à l'API")
        print("Assurez-vous que le serveur est lancé avec: uvicorn main:app --reload")
    except Exception as e:
        print(f"\n❌ Erreur inattendue: {e}")
