import { useState } from 'react';
import { AuthAPI } from '../data/api';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await AuthAPI.login(username, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      onLogin(data.username);
    } catch {
      setError('Identifiants incorrects. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>🏪 Gestion Magasin</h1>
        <p style={styles.subtitle}>Connectez-vous pour accéder à l'application</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Nom d'utilisateur</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            style={styles.input}
            placeholder="admin"
            autoFocus
          />

          <label style={styles.label}>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={styles.input}
            placeholder="••••••••"
          />

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    background: '#1a1a2e',
  },
  card: {
    background: '#fff', padding: '3rem', borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)', width: '100%', maxWidth: '400px',
    textAlign: 'center',
  },
  title: { margin: '0 0 0.5rem', color: '#1a1a2e', fontSize: '1.8rem' },
  subtitle: { color: '#888', marginBottom: '2rem', fontSize: '0.95rem' },
  error: {
    background: '#ffeaea', color: '#d32f2f', padding: '10px',
    borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' },
  label: { fontSize: '0.9rem', fontWeight: 600, color: '#333' },
  input: {
    padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd',
    fontSize: '1rem', marginBottom: '0.8rem', outline: 'none',
  },
  btn: {
    marginTop: '0.5rem', padding: '12px', background: '#1a73e8',
    color: '#fff', border: 'none', borderRadius: '8px',
    fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer',
  },
};
