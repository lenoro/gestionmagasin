// src/pages/Accueil.jsx
import { useState } from 'react';

export default function Accueil({ navigate }) {
  const [hovered, setHovered] = useState(null);

  const boutons = [
    {
      key: 'orderform',
      label: 'Nouvelle\nFacture',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="12" height="16" rx="1"/>
          <line x1="7" y1="6"  x2="13" y2="6"/>
          <line x1="7" y1="9"  x2="13" y2="9"/>
          <line x1="7" y1="12" x2="10" y2="12"/>
          <circle cx="17" cy="17" r="4"/>
          <line x1="17" y1="15" x2="17" y2="19"/>
          <line x1="15" y1="17" x2="19" y2="17"/>
        </svg>
      ),
    },
    {
      key: 'recherche',
      label: 'Recherche',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7"/>
          <line x1="16.65" y1="16.65" x2="21" y2="21"/>
        </svg>
      ),
    },
    {
      key: 'articles',
      label: 'Articles',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
      ),
    },
    {
      key: 'approvisionnement',
      label: 'Approvision.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <line x1="12" y1="12" x2="12" y2="22"/>
          <line x1="3.27" y1="6.96" x2="12" y2="12"/>
          <line x1="20.73" y1="6.96" x2="12" y2="12"/>
        </svg>
      ),
    },
    {
      key: 'retours',
      label: 'Retours',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1 4 1 10 7 10"/>
          <path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
        </svg>
      ),
    },
    {
      key: 'etats',
      label: 'États',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="8" y1="13" x2="16" y2="13"/>
          <line x1="8" y1="17" x2="16" y2="17"/>
        </svg>
      ),
    },
    {
      key: 'aides',
      label: 'Aide',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
          <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none"/>
        </svg>
      ),
    },
    {
      key: '__quitter',
      label: 'Quitter',
      danger: true,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      ),
    },
  ];

  const handleClick = (key) => {
    if (key === '__quitter') {
      if (window.confirm('Quitter GestionMagasin ?')) window.close();
    } else {
      navigate(key);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70vh',
      gap: 32,
    }}>

      {/* Titre */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 52, height: 52,
          background: '#1a1a1a',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 12px',
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
            <path d="M3 3h18v2H3V3zm0 4h18v2H3V7zm0 4h18v2H3v-2zm0 4h12v2H3v-2z"/>
          </svg>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 4px' }}>GestionMagasin</h1>
        <p style={{ fontSize: 13, color: '#888780', margin: 0 }}>Que souhaitez-vous faire ?</p>
      </div>

      {/* Barre d'outils */}
      <div style={{
        display: 'flex',
        alignItems: 'stretch',
        gap: 2,
        padding: '6px 8px',
        background: '#ffffff',
        border: '1px solid #e8e7e0',
        borderRadius: 12,
        boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
      }}>
        {boutons.map((b, i) => (
          <div key={b.key} style={{ display: 'flex', alignItems: 'stretch' }}>
            {/* séparateur avant Quitter */}
            {b.key === '__quitter' && (
              <div style={{ width: 1, background: '#e8e7e0', margin: '4px 6px' }} />
            )}
            <button
              onClick={() => handleClick(b.key)}
              onMouseEnter={() => setHovered(b.key)}
              onMouseLeave={() => setHovered(null)}
              title={b.label.replace('\n', ' ')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
                padding: '8px 10px',
                width: 72,
                border: 'none',
                borderRadius: 8,
                background: hovered === b.key
                  ? (b.danger ? '#fff0f0' : '#f5f5f3')
                  : 'transparent',
                color: b.danger
                  ? (hovered === b.key ? '#a32d2d' : '#888780')
                  : (hovered === b.key ? '#1a1a1a' : '#444'),
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 11,
                fontWeight: 500,
                whiteSpace: 'pre-line',
                lineHeight: 1.3,
                textAlign: 'center',
                transition: 'background 0.12s, color 0.12s',
              }}
            >
              {b.icon}
              <span>{b.label}</span>
            </button>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 11, color: '#b4b2a9', margin: 0 }}>GestionMagasin v1.0 — © 2026</p>
    </div>
  );
}
