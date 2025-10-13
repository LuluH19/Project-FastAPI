import React, { useState, useEffect } from 'react';

const API = 'http://localhost:8000';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ username: '', email: '', password: '', nom: '', telephone: '' });
  const [isLogin, setIsLogin] = useState(true);
  const [edit, setEdit] = useState(null);

  useEffect(() => { token && fetchContacts(); }, [token]);

  const fetchContacts = async () => {
    const res = await fetch(`${API}/contacts`, { headers: { Authorization: `Bearer ${token}` } });
    res.ok && setContacts(await res.json());
  };

  const auth = async (e) => {
    e.preventDefault();
    if (isLogin) {
      const data = new URLSearchParams({ username: form.username, password: form.password });
      const res = await fetch(`${API}/login`, { method: 'POST', body: data });
      if (res.ok) {
        const { access_token } = await res.json();
        localStorage.setItem('token', access_token);
        setToken(access_token);
      } else alert('Erreur de connexion');
    } else {
      const res = await fetch(`${API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, email: form.email, password: form.password })
      });
      res.ok ? (alert('Inscription réussie'), setIsLogin(true)) : alert('Erreur d\'inscription');
    }
  };

  const saveContact = async (e) => {
    e.preventDefault();
    const body = { nom: form.nom, email: form.email, telephone: form.telephone };
    const opts = { method: edit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) };
    const res = await fetch(`${API}/contacts${edit ? `/${edit}` : ''}`, opts);
    res.ok && (fetchContacts(), setForm({ ...form, nom: '', email: '', telephone: '' }), setEdit(null));
  };

  const deleteContact = async (id) => {
    const res = await fetch(`${API}/contacts/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    res.ok && fetchContacts();
  };

  const logout = () => { localStorage.removeItem('token'); setToken(null); setContacts([]); };

  if (!token) return (
    <div style={s.container}>
      <h1>{isLogin ? 'Connexion' : 'Inscription'}</h1>
      <form onSubmit={auth} style={s.form}>
        <input placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} style={s.input} required />
        {!isLogin && <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={s.input} required />}
        <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={s.input} required />
        <button type="submit" style={s.btn}>{isLogin ? 'Se connecter' : 'S\'inscrire'}</button>
        <button type="button" onClick={() => setIsLogin(!isLogin)} style={s.btnSec}>{isLogin ? 'Créer un compte' : 'Déjà inscrit ?'}</button>
      </form>
    </div>
  );

  return (
    <div style={s.container}>
      <div style={s.header}>
        <h1>Mes Contacts</h1>
        <button onClick={logout} style={s.btnSec}>Déconnexion</button>
      </div>
      <form onSubmit={saveContact} style={s.form}>
        <input placeholder="Nom" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} style={s.input} required />
        <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={s.input} required />
        <input placeholder="Téléphone" value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} style={s.input} required />
        <button type="submit" style={s.btn}>{edit ? 'Modifier' : 'Ajouter'}</button>
        {edit && <button type="button" onClick={() => (setEdit(null), setForm({ ...form, nom: '', email: '', telephone: '' }))} style={s.btnSec}>Annuler</button>}
      </form>
      <div style={s.list}>
        {contacts.map(c => (
          <div key={c.id} style={s.card}>
            <div><strong>{c.nom}</strong><br />{c.email}<br />{c.telephone}</div>
            <div>
              <button onClick={() => (setEdit(c.id), setForm({ ...form, nom: c.nom, email: c.email, telephone: c.telephone }))} style={s.btnSmall}>✏️</button>
              <button onClick={() => deleteContact(c.id)} style={s.btnDel}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  form: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' },
  input: { flex: '1', minWidth: '200px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' },
  btn: { padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  btnSec: { padding: '10px 20px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  btnSmall: { padding: '5px 10px', background: '#ffc107', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' },
  btnDel: { padding: '5px 10px', background: '#dc3545', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  list: { display: 'grid', gap: '10px' },
  card: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #ddd', borderRadius: '4px', background: '#f8f9fa' }
};
