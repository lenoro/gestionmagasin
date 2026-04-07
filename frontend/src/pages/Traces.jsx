// src/pages/Traces.jsx — Journal d'audit (lecture seule)
import { useState, useEffect } from 'react';
import { TraceAPI } from '../data/api';

const COULEUR_ACTION = {
  AJOUT:            { bg: '#e8f5e9', color: '#2e7d32', label: '➕ AJOUT' },
  MODIFICATION:     { bg: '#fff3e0', color: '#e65100', label: '✏️ MODIFICATION' },
  SUPPRESSION:      { bg: '#fce4ec', color: '#c62828', label: '🗑️ SUPPRESSION' },
  CONNEXION:        { bg: '#e3f2fd', color: '#1565c0', label: '🔑 CONNEXION' },
  ECHEC_CONNEXION:  { bg: '#ffebee', color: '#b71c1c', label: '⛔ ÉCHEC CONNEXION' },
};

const ENTITES = ['Toutes', 'ARTICLE', 'CLIENT', 'VENDEUR', 'FACTURE', 'AUTH'];
const ACTIONS  = ['Toutes', 'AJOUT', 'MODIFICATION', 'SUPPRESSION', 'CONNEXION', 'ECHEC_CONNEXION'];

const fmt = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('fr-DZ') + ' ' + d.toLocaleTimeString('fr-DZ');
};

export default function Traces({ navigate }) {
  const [traces,   setTraces]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [entite,   setEntite]   = useState('Toutes');
  const [action,   setAction]   = useState('Toutes');
  const [search,   setSearch]   = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setLoading(true);
    const appel =
      entite !== 'Toutes' ? TraceAPI.getByEntite(entite)  :
      action !== 'Toutes' ? TraceAPI.getByAction(action)  :
      TraceAPI.getAll();
    appel
      .then(setTraces)
      .catch(() => setTraces([]))
      .finally(() => setLoading(false));
  }, [entite, action]);

  const filtered = traces.filter(t => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (t.utilisateur  || '').toLowerCase().includes(q) ||
      (t.refProduit   || '').toLowerCase().includes(q) ||
      (t.commentaire  || '').toLowerCase().includes(q) ||
      (t.nouvelleValeur || '').toLowerCase().includes(q) ||
      (t.ancienneValeur || '').toLowerCase().includes(q)
    );
  });

  return (
    <div style={S.page}>

      {/* ── En-tête ── */}
      <div style={S.header}>
        <div>
          <h2 style={S.title}>📋 Journal d'audit</h2>
          <div style={S.subtitle}>Traçabilité de toutes les actions — lecture seule</div>
        </div>
        <button style={S.btnRetour} onClick={() => navigate('accueil')}>← Retour</button>
      </div>

      {/* ── Filtres ── */}
      <div style={S.filtres}>
        <select style={S.select} value={entite} onChange={e => { setEntite(e.target.value); setAction('Toutes'); }}>
          {ENTITES.map(e => <option key={e} value={e}>{e === 'Toutes' ? '📂 Toutes entités' : e}</option>)}
        </select>
        <select style={S.select} value={action} onChange={e => { setAction(e.target.value); setEntite('Toutes'); }}>
          {ACTIONS.map(a => <option key={a} value={a}>{a === 'Toutes' ? '⚡ Toutes actions' : a}</option>)}
        </select>
        <input
          style={S.input}
          placeholder="🔍 Rechercher (utilisateur, ref, valeur…)"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <span style={S.compteur}>{filtered.length} enregistrement(s)</span>
      </div>

      {/* ── Tableau ── */}
      {loading ? (
        <div style={S.vide}>⏳ Chargement…</div>
      ) : filtered.length === 0 ? (
        <div style={S.vide}>Aucune trace trouvée.</div>
      ) : (
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead>
              <tr style={S.thead}>
                <th style={{...S.th, textAlign:'left'}}>Horodatage</th>
                <th style={{...S.th, textAlign:'left'}}>Utilisateur</th>
                <th style={{...S.th, textAlign:'left'}}>Entité</th>
                <th style={{...S.th, textAlign:'left'}}>Référence</th>
                <th style={{...S.th, textAlign:'left'}}>Action</th>
                <th style={{...S.th, textAlign:'left'}}>Commentaire</th>
                <th style={{...S.th, textAlign:'left'}}>Détails</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => {
                const ca = COULEUR_ACTION[t.typeAction] || { bg: '#f5f5f5', color: '#333', label: t.typeAction };
                return (
                  <tr key={t.id}
                      style={{ background: i % 2 === 0 ? '#fff' : '#fafafa', cursor: 'pointer' }}
                      onClick={() => setSelected(selected?.id === t.id ? null : t)}>
                    <td style={S.td}>{fmt(t.horodatage)}</td>
                    <td style={S.td}><strong>{t.utilisateur}</strong></td>
                    <td style={S.td}><span style={S.badge(t.entite)}>{t.entite}</span></td>
                    <td style={S.td}>{t.refProduit || '—'}</td>
                    <td style={S.td}>
                      <span style={{ background: ca.bg, color: ca.color,
                                     padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                        {ca.label}
                      </span>
                    </td>
                    <td style={S.td}>{t.commentaire || '—'}</td>
                    <td style={S.td}>
                      {(t.ancienneValeur || t.nouvelleValeur) &&
                        <span style={{ color: '#1565c0', fontSize: 11, cursor: 'pointer' }}>
                          🔎 Voir
                        </span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Panneau détail ── */}
      {selected && (
        <div style={S.detail}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <strong>Détail — {fmt(selected.horodatage)}</strong>
            <button style={S.btnClose} onClick={() => setSelected(null)}>✕</button>
          </div>
          {selected.ancienneValeur && (
            <div style={S.valeur('#fce4ec', '#c62828')}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>Ancienne valeur :</div>
              <div>{selected.ancienneValeur}</div>
            </div>
          )}
          {selected.nouvelleValeur && (
            <div style={S.valeur('#e8f5e9', '#2e7d32')}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>Nouvelle valeur :</div>
              <div>{selected.nouvelleValeur}</div>
            </div>
          )}
          {selected.adresseIp && (
            <div style={{ fontSize: 12, color: '#888', marginTop: 8 }}>
              IP : {selected.adresseIp}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Styles ── */
const S = {
  page:     { padding: 24, background: '#f5f5f5', minHeight: '100vh' },
  header:   { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  title:    { margin: 0, fontSize: 22, color: '#1a237e' },
  subtitle: { color: '#888', fontSize: 13, marginTop: 4 },
  btnRetour:{ background: '#455a64', color: '#fff', border: 'none', padding: '8px 16px',
              borderRadius: 4, cursor: 'pointer', fontSize: 13 },
  filtres:  { display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 },
  select:   { padding: '7px 12px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13 },
  input:    { padding: '7px 12px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13, minWidth: 260 },
  compteur: { fontSize: 12, color: '#888', marginLeft: 'auto' },
  tableWrap:{ overflowX: 'auto', background: '#fff', borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  table:    { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  thead:    { background: '#1a237e' },
  th:       { padding: '9px 12px', color: '#fff', fontWeight: 600, fontSize: 12 },
  td:       { padding: '8px 12px', borderBottom: '1px solid #f0f0f0', textAlign: 'left' },
  vide:     { textAlign: 'center', padding: 40, color: '#bbb', fontSize: 14 },
  badge:    (entite) => {
    const map = { ARTICLE:'#e8eaf6::#3949ab', CLIENT:'#e0f7fa::#00838f',
                  VENDEUR:'#f3e5f5::#7b1fa2', FACTURE:'#fff8e1::#f57f17', AUTH:'#eceff1::#546e7a' };
    const [bg, color] = (map[entite] || '#f5f5f5::#333').split('::');
    return { background: bg, color, padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 };
  },
  detail:   { marginTop: 16, background: '#fff', borderRadius: 8, padding: 20,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0' },
  valeur:   (bg, color) => ({
    background: bg, border: `1px solid ${color}30`, borderRadius: 4,
    padding: '10px 14px', marginBottom: 10, fontSize: 13, color: '#333'
  }),
  btnClose: { background: 'transparent', border: 'none', fontSize: 16, cursor: 'pointer', color: '#888' },
};
