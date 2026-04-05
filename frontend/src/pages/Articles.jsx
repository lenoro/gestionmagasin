// src/pages/Articles.jsx
import { useState, useEffect } from 'react';
import { ARTICLES } from '../data/articles';
import { ArticleAPI } from '../data/api';
import EditPart from '../components/EditPart';

const F = {
  win:       { fontFamily: 'Tahoma, Arial, sans-serif', fontSize: 13, background: '#f0f0f0', minHeight: '100vh', padding: '1rem' },
  titleBar:  { background: 'linear-gradient(to right, #0a246a, #a6b8d8)', padding: '3px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  btnNav:    { width: 52, height: 48, fontSize: 18, border: '1px solid #aaa', background: '#e8e8e8', cursor: 'pointer', borderRadius: 2, fontFamily: 'inherit' },
  btnAction: { padding: '4px 0', width: 90, height: 48, fontSize: 13, border: '1px solid #888', borderRadius: 3, background: '#e8e8e8', cursor: 'pointer', fontFamily: 'inherit' },
  th:        { padding: '3px 10px', textAlign: 'left', background: '#d4d0c8', fontWeight: 600, borderRight: '1px solid #aaa', borderBottom: '1px solid #aaa', whiteSpace: 'nowrap', userSelect: 'none' },
  td: sel => ({ padding: '3px 10px', borderBottom: '1px solid #eee', borderRight: '1px solid #eee', background: sel ? '#0a246a' : 'transparent', color: sel ? '#fff' : '#000', whiteSpace: 'nowrap' }),
};

export default function Articles({ navigate }) {
  const [articles,       setArticles]       = useState([]);
  const [selectedId,     setSelectedId]     = useState(null);
  const [editPartId,     setEditPartId]     = useState(null);
  const [showBackorders, setShowBackorders] = useState(false);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);

  /* ── Chargement initial depuis le backend ── */
  useEffect(() => {
    setLoading(true);
    ArticleAPI.getAll()
      .then(data => {
        const list = Array.isArray(data) ? data : (data.content ?? []);
        setArticles(list);
        if (list.length > 0) setSelectedId(list[0].articleCode);
      })
      .catch(() => {
        console.warn('Backend indisponible — données locales utilisées');
        const local = ARTICLES.map(a => ({ ...a }));
        setArticles(local);
        if (local.length > 0) setSelectedId(local[0].id);
        setError('Backend indisponible — données locales');
      })
      .finally(() => setLoading(false));
  }, []);

  /* ── Vue backorders ── */
  const displayed = showBackorders
    ? articles.filter(a => a.backordered === 'Yes')
    : articles;

  /* ── Navigation ── */
  const idx     = displayed.findIndex(a => a.articleCode === selectedId);
  const goFirst = () => displayed.length && setSelectedId(displayed[0].articleCode);
  const goPrev  = () => idx > 0 && setSelectedId(displayed[idx - 1].articleCode);
  const goNext  = () => idx < displayed.length - 1 && setSelectedId(displayed[idx + 1].articleCode);
  const goLast  = () => displayed.length && setSelectedId(displayed[displayed.length - 1].articleCode);

  /* ── CRUD ── */
  const handlePartSave = ({ action, article, id }) => {
    if (action === 'update') {
      setArticles(prev => prev.map(a => a.articleCode === article.id ? article : a));
      setSelectedId(article.id);
    } else if (action === 'add') {
      setArticles(prev => [...prev, article]);
      setSelectedId(article.id);
    } else if (action === 'delete') {
      setArticles(prev => {
        const updated = prev.filter(a => a.articleCode !== id);
        setSelectedId(updated[0]?.id || null);
        return updated;
      });
    }
  };

  return (
    <div style={F.win}>
      <div style={{ maxWidth: 640, margin: '0 auto', background: '#f0f0f0', border: '2px solid #888', borderRadius: 4, boxShadow: '3px 3px 8px rgba(0,0,0,0.3)' }}>

        {/* ── Barre de titre ── */}
        <div style={F.titleBar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14 }}>🔧</span>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>Parcourir les articles</span>
          </div>
          <div style={{ display: 'flex', gap: 2 }}>
            <button style={{ width: 16, height: 14, fontSize: 10, background: '#c0c0c0', border: '1px solid #888', cursor: 'pointer' }}>─</button>
            <button style={{ width: 16, height: 14, fontSize: 10, background: '#c0c0c0', border: '1px solid #888', cursor: 'pointer' }}>□</button>
            <button onClick={() => navigate('accueil')} style={{ width: 16, height: 14, fontSize: 10, background: '#c0c0c0', border: '1px solid #888', cursor: 'pointer', color: '#900', fontWeight: 700 }}>✕</button>
          </div>
        </div>

        <div style={{ padding: '8px 10px' }}>

          {/* ── Toolbar ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10, padding: '4px 6px', background: '#e8e8e8', border: '1px solid #ccc', borderRadius: 2 }}>
            <button style={F.btnNav} onClick={goFirst} title="Premier">|◄</button>
            <button style={F.btnNav} onClick={goPrev}  title="Précédent">◄</button>
            <button style={F.btnNav} onClick={goNext}  title="Suivant">►</button>
            <button style={F.btnNav} onClick={goLast}  title="Dernier">►|</button>
            <button style={F.btnNav} onClick={() => { setShowBackorders(false); }} title="Rafraîchir">↺</button>

            <div style={{ width: 1, height: 20, background: '#aaa', margin: '0 6px' }} />

            {/* Bouton Edit */}
            <button
              style={{ ...F.btnAction, marginLeft: '38px' }}
              onClick={() => selectedId && setEditPartId(selectedId)}
              disabled={!selectedId}
            >
              Modifier
            </button>

            {/* Bouton Backorders — bascule */}
            <button
              style={{
                ...F.btnAction,
                width: 100,
                background:  showBackorders ? '#a8c8e8' : '#e8e8e8',
                border:      showBackorders ? '2px inset #6090b8' : '1px solid #888',
                fontWeight:  showBackorders ? 700 : 400,
                color:       showBackorders ? '#003366' : '#000',
                boxShadow:   showBackorders ? 'inset 2px 2px 3px rgba(0,0,0,0.2)' : 'none',
              }}
              onClick={() => setShowBackorders(b => !b)}
              title="Afficher uniquement les articles en backorder"
            >
              Indisponible
            </button>

            <span style={{ marginLeft: 'auto', fontSize: 11, color: '#666' }}>
              {idx + 1}/{displayed.length}
            </span>
          </div>

          {/* ── Indicateur loading / error ── */}
          {loading && (
            <div style={{ padding: '8px 12px', background: '#e6f1fb', borderRadius: 4, marginBottom: 8, fontSize: 12, color: '#185fa5' }}>
              ⏳ Chargement des articles depuis le backend...
            </div>
          )}
          {error && (
            <div style={{ padding: '6px 12px', background: '#faeeda', borderRadius: 4, marginBottom: 8, fontSize: 12, color: '#854f0b' }}>
              ⚠ {error}
            </div>
          )}

          {/* ── Bandeau backorders actif ── */}
          {showBackorders && (
            <div style={{ marginBottom: 8, padding: '4px 10px', background: '#fff3cd', border: '1px solid #f0c040', borderRadius: 3, fontSize: 12, color: '#7a5c00', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>⚠ Affichage : articles en <strong>Backorder</strong> uniquement ({displayed.length})</span>
              <button onClick={() => setShowBackorders(false)} style={{ fontSize: 11, border: '1px solid #f0c040', background: 'none', cursor: 'pointer', color: '#7a5c00', borderRadius: 3, padding: '1px 8px' }}>✕ Tout afficher</button>
            </div>
          )}

          {/* ── DBGrid articles ── */}
          <div style={{ border: '2px inset #999', background: '#fff', marginBottom: 10, overflowX: 'auto', overflowY: 'auto', maxHeight: 320 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 500 }}>
              <thead>
                <tr>
                  <th style={{ ...F.th, width: 16, padding: '3px 4px' }}></th>
                  <th style={{ ...F.th, width: 80 }}>Clé article</th>
                  <th style={{ ...F.th, minWidth: 180 }}>Description</th>
                  <th style={{ ...F.th, width: 70, textAlign: 'right' }}>Disponible</th>
                  <th style={{ ...F.th, width: 70, textAlign: 'right' }}>OnOrder</th>
                  <th style={{ ...F.th, width: 70, textAlign: 'right', borderRight: 'none' }}>Indisponible</th>
                </tr>
              </thead>
              <tbody>
                {displayed.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '16px', textAlign: 'center', color: '#999', fontStyle: 'italic' }}>
                      {showBackorders ? 'Aucun article en backorder' : 'Aucun article'}
                    </td>
                  </tr>
                ) : displayed.map(a => {
                  const sel = a.articleCode === selectedId;
                  return (
                    <tr
                      key={a.articleCode}
                      onClick={() => setSelectedId(a.articleCode)}
                      onDoubleClick={() => setEditPartId(a.articleCode)}
                      style={{ cursor: 'default' }}
                    >
                      {/* Indicateur ligne courante */}
                      <td style={{ ...F.td(sel), width: 16, textAlign: 'center', fontSize: 10, padding: '3px 4px' }}>
                        {sel ? '▶' : ''}
                      </td>
                      <td style={{ ...F.td(sel), fontWeight: 600, fontSize: 12 }}>{a.articleCode}</td>
                      <td style={{ ...F.td(sel) }}>{a.articleName}</td>
                      <td style={{
                        ...F.td(sel),
                        textAlign: 'right',
                        fontWeight: 600,
                        color: sel ? '#fff' : a.stock === 0 ? '#c00' : a.stock <= 5 ? '#a05000' : '#000',
                      }}>
                        {a.stock}
                      </td>
                      <td style={{ ...F.td(sel), textAlign: 'right' }}>{a.onOrder}</td>
                      <td style={{
                        ...F.td(sel),
                        textAlign: 'left',
                        fontWeight: a.backordered === 'Yes' ? 700 : 400,
                        color: sel ? '#fff' : a.backordered === 'Yes' ? '#c00' : '#000',
                        borderRight: 'none',
                      }}>
                        {a.backordered}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Panneau détail article sélectionné ── */}
          {selectedId && (() => {
            const a = articles.find(x => x.articleCode === selectedId);
            if (!a) return null;
            return (
              <div style={{ marginBottom: 10, padding: '8px 12px', background: '#fff', border: '1px solid #ccc', borderRadius: 2, fontSize: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 20px' }}>
                <span><strong>Vendor :</strong> {a.producteur?.producerName}</span>
                <span><strong>Catégorie :</strong> {a.categorie}</span>
                <span><strong>Cost :</strong> {a.cost?.toFixed(2)} $</span>
                <span><strong>List Price :</strong> {a.price?.toFixed(2)} $</span>
                <span><strong>Marge :</strong> {a.cost > 0 ? (((a.price - a.cost) / a.price) * 100).toFixed(1) + '%' : '—'}</span>
                <span><strong>Backordered :</strong> <span style={{ color: a.backordered === 'Yes' ? '#c00' : '#060', fontWeight: 700 }}>{a.backordered}</span></span>
              </div>
            );
          })()}

          {/* ── Bouton Close ── */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              style={{ ...F.btnAction, width: 80 }}
              onClick={() => navigate('accueil')}
            >
              Fermer
            </button>
          </div>

        </div>
      </div>

      {/* ── Fenêtre Edit Part ── */}
      {editPartId && (
        <EditPart
          articleId={editPartId}
          allArticles={articles}
          onSave={handlePartSave}
          onClose={() => setEditPartId(null)}
        />
      )}
    </div>
  );
}
