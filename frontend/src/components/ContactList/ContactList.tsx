import React, { useEffect, useState } from 'react';
import { Contact, ContactCreate } from '../../types';
import { getContacts, createContact, updateContact, deleteContact } from '../../api';
import { useAuth } from '../../context/AuthContext';
import ContactForm from '../ContactForm/ContactForm';
import ContactCard from '../ContactCard/ContactCard';
import './ContactList.css';

const ContactList: React.FC = () => {
  const { token, logout } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, [token]);

  const fetchContacts = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getContacts(token);
      setContacts(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: ContactCreate) => {
    if (!token) return;
    try {
      await createContact(token, data);
      fetchContacts();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création du contact');
    }
  };

  const handleUpdate = async (data: ContactCreate) => {
    if (!token || !editingContact) return;
    try {
      await updateContact(token, editingContact.id, data);
      setEditingContact(null);
      fetchContacts();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour du contact');
    }
  };

  const handleDelete = async (id: number) => {
    if (!token || !window.confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) return;
    try {
      await deleteContact(token, id);
      fetchContacts();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression du contact');
    }
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
  };

  const handleCancelEdit = () => {
    setEditingContact(null);
  };

  return (
    <div className="contact-list-container">
      <header className="header">
        <h1>📇 Mes Contacts</h1>
        <button className="logout-btn" onClick={logout}>
          Déconnexion
        </button>
      </header>

      <ContactForm
        onSubmit={editingContact ? handleUpdate : handleCreate}
        initialData={editingContact || undefined}
        isEditing={!!editingContact}
        onCancel={handleCancelEdit}
      />

      {loading ? (
        <div className="loading">Chargement...</div>
      ) : contacts.length === 0 ? (
        <div className="empty-state">
          <p>Aucun contact pour le moment.</p>
          <p>Ajoutez votre premier contact ci-dessus !</p>
        </div>
      ) : (
        <div className="contacts-grid">
          {contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactList;
