import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Auth from './components/Auth/Auth';
import ContactList from './components/ContactList/ContactList';
import './App.css';

const AppContent: React.FC = () => {
  const { token } = useAuth();
  return token ? <ContactList /> : <Auth />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
