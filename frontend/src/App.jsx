// src/App.jsx
import { useState } from 'react';
import './styles/global.css';

import Login              from './pages/Login';
import Accueil           from './pages/Accueil';
import Recherche         from './pages/Recherche';
import Articles          from './pages/Articles';
import Aides             from './pages/Aides';
import OrderForm         from './pages/OrderForm';
import Etats             from './pages/Etats';
import Approvisionnement from './pages/Approvisionnement';
import Retours           from './pages/Retours';
import Traces            from './pages/Traces';

const PAGES = {
  accueil:           Accueil,
  recherche:         Recherche,
  articles:          Articles,
  aides:             Aides,
  etats:             Etats,
  approvisionnement: Approvisionnement,
  retours:           Retours,
  traces:            Traces,
};

export default function App() {
  const [page, setPage]       = useState('accueil');
  const [username, setUsername] = useState(localStorage.getItem('username'));

  const handleLogin = (user) => setUsername(user);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUsername(null);
    setPage('accueil');
  };

  // Si pas connecté → page Login
  if (!username) return <Login onLogin={handleLogin} />;

  if (page === 'orderform') return <OrderForm navigate={setPage} />;
  if (page === 'etats')     return <Etats     navigate={setPage} />;

  const PageComponent = PAGES[page] || Accueil;
  return (
    <div className="app-container">
      <div style={styles.topBar}>
        <span style={styles.user}>👤 {username}</span>
        <button onClick={handleLogout} style={styles.logoutBtn}>Déconnexion</button>
      </div>
      <PageComponent navigate={setPage} />
    </div>
  );
}

const styles = {
  topBar: {
    display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
    gap: '1rem', padding: '6px 16px',
    background: '#1a1a2e', color: '#fff', fontSize: '0.85rem',
  },
  user: { color: '#aaa' },
  logoutBtn: {
    background: 'transparent', border: '1px solid #555',
    color: '#ccc', padding: '3px 10px', borderRadius: '4px',
    cursor: 'pointer', fontSize: '0.8rem',
  },
};
