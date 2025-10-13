import React, { useState, useEffect } from 'react';
import { ContactCreate, Contact } from '../../types';
import './ContactForm.css';

interface ContactFormProps {
  onSubmit: (data: ContactCreate) => void;
  initialData?: Contact;
  isEditing: boolean;
  onCancel: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit, initialData, isEditing, onCancel }) => {
  const [formData, setFormData] = useState<ContactCreate>({
    nom: '',
    email: '',
    telephone: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nom: initialData.nom,
        email: initialData.email,
        telephone: initialData.telephone,
      });
    } else {
      setFormData({ nom: '', email: '', telephone: '' });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (!isEditing) {
      setFormData({ nom: '', email: '', telephone: '' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="contact-form-container">
      <h2>{isEditing ? '✏️ Modifier le contact' : '➕ Ajouter un contact'}</h2>
      <form onSubmit={handleSubmit} className="contact-form">
        <input
          type="text"
          name="nom"
          placeholder="Nom complet"
          value={formData.nom}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="telephone"
          placeholder="Téléphone"
          value={formData.telephone}
          onChange={handleChange}
          required
        />
        <div className="form-buttons">
          <button type="submit" className="submit-btn">
            {isEditing ? 'Mettre à jour' : 'Ajouter'}
          </button>
          {isEditing && (
            <button type="button" onClick={onCancel} className="cancel-btn">
              Annuler
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
