// src/pages/StockAlert.jsx
import { useState, useEffect } from 'react';
import { ArticleAPI } from '../data/api';

const SEUIL_DEFAULT = 5;

function niveauAlerte(stock) {
  if (stock === 0) return { label: 'Rupture',  bg: '#fde8e8', color: '#a32d2d', dot: '#c0392b' };
  if (stock <= 2)  return { label: 'Critique', bg: '#fff0e0', color: '#7a3a00', dot: '#e67e22' };
  return               { label: 'Alerte',   bg: '#fffbe6', color: '#7a5c00', dot: '#f0c040' };
}

export default function StockAlert({ navigate }) {
  const [articles,  setArticles]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [seuil,     setSeuil]     = useState(SEUIL_DEFAULT);
  const [seuilEdit, setSeuilEdit] = useState(String(SEUIL_DEFAULT));
  const [sortBy,    setSortBy]    = useState('stock'); // 'stock' | 'code' | 'name'

  useEffect(() => {
    ArticleAPI.getAll()
      .then(data => setArticles(data))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  const enAlerte = articles
    .filter(a => (a.stock ?? 0) <= seuil)
    .sort((a, b) => {
      if (sortBy === 'stock') return (a.stock ?? 0) - (b.stock ?? 0);
      if (sortBy === 'code')  return (a.articleCode || '').localeCompare(b.articleCode || '');
      return (a.articleName || '').localeCompare(b.articleName || '');
    });

  const ruptures  = enAlerte.filter(a => a.stock === 0).length;
  const critiques = enAlerte.filter(a => a.stock > 0 && a.stock <= 2).length;
  const alertes   = enAlerte.filter(a => a.stock > 2).length;

  const handleSeuil = () => {
    const v = parseInt(seuilEdit);
    if (!isNaN(v) && v >= 0) setSeuil(v);
  };

  const th = (label, key) => (
    <th
      onClick={() => setSortBy(key)}
      style={{
        padding: '4px 8px', textAlign: 'left', background: '#d4d0c8',
        fontWeight: 600, borderRight: '1px solid #aaa', borderBottom: '1px solid #aaa',
        cursor: 'pointer', whiteSpace: 'nowrap',
        color: sortBy === key ? '#0a246a' : '#000',
        userSelect: 'none',
      }}
    >
      {label} {sortBy === key ? '▲' : ''}
    </th>
  );

  return (
    <div style={{ fontFamily: 'Tahoma, Arial, sans-serif', fontSize: 13, background: '#f0f0f0', minHeight: '100vh', padding: '1rem' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', background: '#f0f0f0', border: '2px solid #888', borderRadius: 4, boxShadow: '3px 3px 8px rgba(0,0,0,0.3)' }}>

        {/* Barre de titre */}
        <div style={{ background: 'linear-gradient(to right, #7a1a1a, #c8a0a0)', padding: '3px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>⚠ Alertes Stock</span>
          <div style={{ display: 'flex', gap: 2 }}>
            <button onClick={() => navigate('accueil')} style={{ width: 16, height: 14, fontSize: 10, background: '#c0c0c0', border: '1px solid #888', cursor: 'pointer', color: '#900', fontWeight: 700 }}>✕</button>
          </div>
        </div>

        <div style={{ padding: '10px 12px' }}>

          {/* Compteurs résumé */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <div style={{ flex: 1, padding: '8px 12px', background: '#fde8e8', border: '1px solid #e0a0a0', borderRadius: 4, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#a32d2d' }}>{ruptures}</div>
              <div style={{ fontSize: 11, color: '#7a2020' }}>Rupture totale</div>
            </div>
            <div style={{ flex: 1, padding: '8px 12px', background: '#fff0e0', border: '1px solid #e0c080', borderRadius: 4, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#7a3a00' }}>{critiques}</div>
              <div style={{ fontSize: 11, color: '#7a3a00' }}>Stock critique (≤ 2)</div>
            </div>
            <div style={{ flex: 1, padding: '8px 12px', background: '#fffbe6', border: '1px solid #f0c040', borderRadius: 4, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#7a5c00' }}>{alertes}</div>
              <div style={{ fontSize: 11, color: '#7a5c00' }}>En alerte (≤ {seuil})</div>
            </div>
            <div style={{ flex: 1, padding: '8px 12px', background: '#e8f4ff', border: '1px solid #90bce0', borderRadius: 4, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#003366' }}>{articles.length}</div>
              <div style={{ fontSize: 11, color: '#003366' }}>Total articles</div>
            </div>
          </div>

          {/* Seuil d'alerte */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, padding: '6px 10px', background: '#fff', border: '1px solid #ccc', borderRadius: 3 }}>
            <span style={{ fontSize: 12, color: '#555' }}>Seuil d'alerte :</span>
            <input
              type="number" min="0" max="999"
              value={seuilEdit}
              onChange={e => setSeuilEdit(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSeuil()}
              style={{ width: 60, padding: '2px 6px', fontSize: 13, border: '1px solid #aaa', borderRadius: 2, textAlign: 'center' }}
            />
            <button onClick={handleSeuil}
              style={{ padding: '3px 12px', fontSize: 12, border: '1px solid #888', borderRadius: 3, background: '#e8e8e8', cursor: 'pointer' }}>
              Appliquer
            </button>
            <span style={{ fontSize: 11, color: '#888', marginLeft: 4 }}>
              {enAlerte.length} article{enAlerte.length !== 1 ? 's' : ''} concerné{enAlerte.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={() => ArticleAPI.getAll().then(setArticles).catch(() => {})}
              style={{ marginLeft: 'auto', padding: '3px 10px', fontSize: 12, border: '1px solid #888', borderRadius: 3, background: '#e8e8e8', cursor: 'pointer' }}
              title="Rafraîchir">
              ↺ Actualiser
            </button>
          </div>

          {/* Grille articles en alerte */}
          <div style={{ border: '2px inset #999', background: '#fff', height: 380, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: 24, textAlign: 'center', color: '#888' }}>⏳ Chargement…</div>
            ) : enAlerte.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center', color: '#3b6d11', fontWeight: 600 }}>
                ✔ Aucun article sous le seuil de {seuil} unités.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    <th style={{ width: 16, padding: '4px 4px', background: '#d4d0c8', borderRight: '1px solid #aaa', borderBottom: '1px solid #aaa' }}></th>
                    {th('Code',        'code')}
                    {th('Désignation', 'name')}
                    {th('Stock',       'stock')}
                    <th style={{ padding: '4px 8px', textAlign: 'right', background: '#d4d0c8', fontWeight: 600, borderRight: '1px solid #aaa', borderBottom: '1px solid #aaa', whiteSpace: 'nowrap' }}>Commandé</th>
                    <th style={{ padding: '4px 8px', textAlign: 'right', background: '#d4d0c8', fontWeight: 600, borderRight: '1px solid #aaa', borderBottom: '1px solid #aaa', whiteSpace: 'nowrap' }}>Indisponible</th>
                    <th style={{ padding: '4px 8px', textAlign: 'right', background: '#d4d0c8', fontWeight: 600, borderBottom: '1px solid #aaa', whiteSpace: 'nowrap' }}>Prix</th>
                  </tr>
                </thead>
                <tbody>
                  {enAlerte.map((a, i) => {
                    const niv = niveauAlerte(a.stock ?? 0);
                    return (
                      <tr key={a.id} style={{ background: i % 2 === 0 ? niv.bg : '#fff' }}>
                        <td style={{ padding: '3px 4px', textAlign: 'center', borderRight: '1px solid #eee', borderBottom: '1px solid #eee' }}>
                          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: niv.dot }} />
                        </td>
                        <td style={{ padding: '3px 8px', fontWeight: 700, borderRight: '1px solid #eee', borderBottom: '1px solid #eee', color: '#0a246a' }}>{a.articleCode}</td>
                        <td style={{ padding: '3px 8px', borderRight: '1px solid #eee', borderBottom: '1px solid #eee' }}>{a.articleName}</td>
                        <td style={{ padding: '3px 8px', textAlign: 'right', fontWeight: 700, borderRight: '1px solid #eee', borderBottom: '1px solid #eee', color: niv.color }}>
                          {a.stock ?? 0}
                          <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 400, padding: '1px 5px', borderRadius: 10, background: niv.dot, color: '#fff' }}>{niv.label}</span>
                        </td>
                        <td style={{ padding: '3px 8px', textAlign: 'right', borderRight: '1px solid #eee', borderBottom: '1px solid #eee', color: (a.onOrder ?? 0) > 0 ? '#3b6d11' : '#999' }}>
                          {a.onOrder ?? 0}
                        </td>
                        <td style={{ padding: '3px 8px', textAlign: 'right', borderRight: '1px solid #eee', borderBottom: '1px solid #eee', color: (a.indisponible ?? 0) > 0 ? '#a32d2d' : '#999' }}>
                          {a.indisponible ?? 0}
                        </td>
                        <td style={{ padding: '3px 8px', textAlign: 'right', borderBottom: '1px solid #eee', color: '#333' }}>
                          {(a.price ?? 0).toFixed(2)} D.A
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Bouton fermer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
            <button onClick={() => navigate('accueil')}
              style={{ padding: '4px 20px', fontSize: 13, border: '1px solid #888', borderRadius: 3, background: '#e8e8e8', cursor: 'pointer' }}>
              Fermer
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
