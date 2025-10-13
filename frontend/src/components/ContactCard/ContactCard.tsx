import React from 'react';
import { Contact } from '../../types';
import './ContactCard.css';

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (id: number) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, onEdit, onDelete }) => {
  return (
    <div className="contact-card">
      <div className="contact-info">
        <h3>{contact.nom}</h3>
        <p className="email">📧 {contact.email}</p>
        <p className="phone">📱 {contact.telephone}</p>
      </div>
      <div className="contact-actions">
        <button className="edit-btn" onClick={() => onEdit(contact)} title="Modifier">
          ✏️
        </button>
        <button className="delete-btn" onClick={() => onDelete(contact.id)} title="Supprimer">
          🗑️
        </button>
      </div>
    </div>
  );
};

export default ContactCard;
