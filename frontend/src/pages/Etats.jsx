// src/pages/Etats.jsx
import { useState, useEffect } from 'react';
import { CLIENTS }                       from '../data/clients';
import { ARTICLES }                      from '../data/articles';
import { COMMANDES, calcCommandeTotaux } from '../data/commandes';
import PrintPreview from '../components/PrintPreview';
import { ClientAPI, ArticleAPI, FactureAPI } from '../data/api';

const REPORTS = [
  { key: 'customers', label: 'État Employés'           },
  { key: 'orders',    label: 'État des affectations'   },
  { key: 'invoice',   label: 'État des Factures'        },
];

const S = {
  win:      { fontFamily: 'Tahoma, Arial, sans-serif', fontSize: 13, background: '#f0f0f0', minHeight: '100vh', padding: '1rem' },
  titleBar: { background: 'linear-gradient(to right, #0a246a, #a6b8d8)', padding: '3px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  btn:      { padding: '4px 0', width: 80, fontSize: 13, border: '1px solid #888', borderRadius: 3, background: '#e8e8e8', cursor: 'pointer', fontFamily: 'inherit' },
  btnPrint: { padding: '4px 0', width: 80, fontSize: 13, border: '2px solid #0a246a', borderRadius: 3, background: '#e8e8e8', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700 },
};

export default function Etats({ navigate }) {
  const [selected,  setSelected]  = useState('customers');
  const [preview,   setPreview]   = useState(false);
  const [apiClients,  setApiClients]  = useState(CLIENTS);
  const [apiArticles, setApiArticles] = useState(ARTICLES);
  const [apiCommandes,setApiCommandes]= useState(COMMANDES);
  const [loading,     setLoading]     = useState(true);

  /* ── Charger toutes les données pour les rapports ── */
  useEffect(() => {
    Promise.all([
      ClientAPI.getAll().catch(() => CLIENTS),
      ArticleAPI.getAll().catch(() => ARTICLES),
      FactureAPI.getAll().catch(() => COMMANDES),
    ]).then(([c, a, f]) => {
      setApiClients(c);
      setApiArticles(a);
      setApiCommandes(f);
    }).finally(() => setLoading(false));
  }, []);

  if (preview) {
    return (
      <PrintPreview
        reportType={selected}
        clients={apiClients}
        commandes={apiCommandes}
        articles={apiArticles}
        calcTotaux={calcCommandeTotaux}
        onClose={() => setPreview(false)}
      />
    );
  }

  return (
    <div style={S.win}>
      <div style={{ maxWidth: 400, margin: '4rem auto 0' }}>
        <div style={{ background: '#f0f0f0', border: '2px solid #888', borderRadius: 3, boxShadow: '4px 4px 10px rgba(0,0,0,0.3)', fontFamily: 'Tahoma, Arial, sans-serif' }}>

          {/* Barre de titre */}
          <div style={S.titleBar}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>Choix Rapports</span>
            <button onClick={() => navigate('accueil')} style={{ width: 16, height: 14, fontSize: 10, background: '#c0c0c0', border: '1px solid #888', cursor: 'pointer', color: '#900', fontWeight: 700 }}>✕</button>
          </div>

          <div style={{ padding: '14px 16px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>

            {/* GroupBox Report */}
            <div style={{ flex: 1, border: '1px solid #aaa', borderRadius: 3, padding: '10px 14px', position: 'relative' }}>
              <span style={{ position: 'absolute', top: -9, left: 8, background: '#f0f0f0', padding: '0 4px', fontSize: 12, fontWeight: 600 }}>Rapport</span>
              {REPORTS.map(r => (
                <label key={r.key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, cursor: 'pointer', fontSize: 13 }}>
                  <input
                    type="radio"
                    name="report"
                    value={r.key}
                    checked={selected === r.key}
                    onChange={() => setSelected(r.key)}
                    style={{ cursor: 'pointer' }}
                  />
                  {r.label}
                </label>
              ))}
            </div>

            {/* Boutons Print / View / Cancel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}>
              <button style={{ ...S.btnPrint, opacity: loading ? 0.6 : 1 }} onClick={() => !loading && setPreview(true)} disabled={loading}>
                {loading ? '⏳' : 'Imprimer'}
              </button>
              <button style={{ ...S.btn, opacity: loading ? 0.6 : 1 }} onClick={() => !loading && setPreview(true)} disabled={loading}>
                {loading ? '⏳' : 'Afficher'}
              </button>
              <button style={S.btn} onClick={() => navigate('accueil')}>
                Annuler
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
