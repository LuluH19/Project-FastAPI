import { Contact, ContactCreate, Token, UserRegister, UserLogin } from './types';

const API_URL = process.env.API_URL 

// Auth API
export const registerUser = async (data: UserRegister): Promise<void> => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Erreur lors de l\'inscription');
  }
};

export const loginUser = async (data: UserLogin): Promise<Token> => {
  const formData = new URLSearchParams();
  formData.append('username', data.username);
  formData.append('password', data.password);

  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Identifiants incorrects');
  }
  return response.json();
};

// Contacts API
export const getContacts = async (token: string): Promise<Contact[]> => {
  const response = await fetch(`${API_URL}/contacts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Erreur lors de la récupération des contacts');
  return response.json();
};

export const createContact = async (token: string, data: ContactCreate): Promise<Contact> => {
  const response = await fetch(`${API_URL}/contacts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Erreur lors de la création du contact');
  return response.json();
};

export const updateContact = async (token: string, id: number, data: ContactCreate): Promise<Contact> => {
  const response = await fetch(`${API_URL}/contacts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Erreur lors de la mise à jour du contact');
  return response.json();
};

export const deleteContact = async (token: string, id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/contacts/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Erreur lors de la suppression du contact');
};
