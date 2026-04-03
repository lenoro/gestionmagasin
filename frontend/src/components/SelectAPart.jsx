// src/components/SelectAPart.jsx
import { useState, useEffect, useRef } from 'react';
import { ARTICLES } from '../data/articles';

const SEARCH_FIELDS = [
  { value: 'designation', label: 'Description' },
  { value: 'id',          label: 'PartNo'      },
  { value: 'vendor',      label: 'Vendor'      },
  { value: 'categorie',   label: 'Catégorie'   },
];

export default function SelectAPart({ onSelect, onClose }) {
  const [searchField, setSearchField] = useState('designation');
  const [searchText,  setSearchText]  = useState('');
  const [selectedId,  setSelectedId]  = useState(ARTICLES[0]?.id || null);
  const searchRef = useRef(null);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  /* Filtrer les articles selon le champ et le texte */
  const filtered = ARTICLES.filter(a => {
    if (!searchText.trim()) return true;
    return String(a[searchField])
      .toLowerCase()
      .includes(searchText.toLowerCase());
  });

  /* Sélectionner automatiquement le premier résultat quand la recherche change */
  useEffect(() => {
    if (filtered.length > 0) setSelectedId(filtered[0].id);
  }, [searchText, searchField]);

  const handleOk = () => {
    const art = ARTICLES.find(a => a.articleCode === selectedId);
    if (art) onSelect(art);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter')  handleOk();
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowDown') {
      const idx = filtered.findIndex(a => a.articleCode === selectedId);
      if (idx < filtered.length - 1) setSelectedId(filtered[idx + 1].id);
      e.preventDefault();
    }
    if (e.key === 'ArrowUp') {
      const idx = filtered.findIndex(a => a.articleCode === selectedId);
      if (idx > 0) setSelectedId(filtered[idx - 1].id);
      e.preventDefault();
    }
  };

  /* Style bouton OK/Cancel façon Windows classic */
  const btnStyle = (primary = false) => ({
    padding: '4px 0',
    width: 75,
    fontSize: 13,
    fontFamily: 'Tahoma, Arial, sans-serif',
    border: primary ? '2px solid #0a246a' : '1px solid #888',
    borderRadius: 3,
    background: '#e8e8e8',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  });

  return (
    /* Overlay */
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Fenêtre style Delphi */}
      <div
        style={{
          width: 360,
          background: '#f0f0f0',
          border: '2px solid #888',
          borderRadius: 3,
          boxShadow: '4px 4px 10px rgba(0,0,0,0.4)',
          fontFamily: 'Tahoma, Arial, sans-serif',
          fontSize: 13,
        }}
        onKeyDown={handleKeyDown}
      >
        {/* Barre de titre */}
        <div style={{
          background: 'linear-gradient(to right, #0a246a, #a6b8d8)',
          padding: '3px 8px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>Select a Part</span>
          <button
            onClick={onClose}
            style={{ width: 16, height: 14, fontSize: 10, background: '#c0c0c0', border: '1px solid #888', cursor: 'pointer', color: '#900', fontWeight: 700, lineHeight: 1 }}
          >✕</button>
        </div>

        <div style={{ padding: '12px 14px' }}>

          {/* Search Field */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <label style={{ fontSize: 13, whiteSpace: 'nowrap', width: 90 }}>Search Field:</label>
            <select
              value={searchField}
              onChange={e => { setSearchField(e.target.value); setSearchText(''); }}
              style={{ flex: 1, padding: '3px 6px', fontSize: 13, border: '1px solid #aaa', borderRadius: 2, fontFamily: 'inherit' }}
            >
              {SEARCH_FIELDS.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>

          {/* Search Text */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <label style={{ fontSize: 13, whiteSpace: 'nowrap', width: 90 }}>Search Text:</label>
            <input
              ref={searchRef}
              type="text"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ flex: 1, padding: '3px 6px', fontSize: 13, border: '1px solid #aaa', borderRadius: 2, fontFamily: 'inherit' }}
              placeholder=""
            />
            {/* Bouton loupe */}
            <button
              onClick={() => setSearchText('')}
              title="Effacer"
              style={{ width: 24, height: 24, fontSize: 13, border: '1px solid #aaa', background: '#e8e8e8', cursor: 'pointer', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >🔍</button>
          </div>

          {/* DBGrid articles */}
          <div style={{ border: '2px inset #999', background: '#fff', height: 220, overflowY: 'auto', marginBottom: 14 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#d4d0c8', position: 'sticky', top: 0 }}>
                  <th style={{ width: 16, padding: '2px 4px', borderRight: '1px solid #aaa', borderBottom: '1px solid #aaa' }}></th>
                  <th style={{ padding: '2px 10px', textAlign: 'left', borderRight: '1px solid #aaa', borderBottom: '1px solid #aaa', fontWeight: 600, width: 75 }}>PartNo</th>
                  <th style={{ padding: '2px 10px', textAlign: 'left', borderRight: '1px solid #aaa', borderBottom: '1px solid #aaa', fontWeight: 600 }}>Description</th>
                  <th style={{ padding: '2px 10px', textAlign: 'left', borderRight: '1px solid #aaa', borderBottom: '1px solid #aaa', fontWeight: 600, width: 100 }}>Vendor</th>
                  <th style={{ padding: '2px 10px', textAlign: 'right', borderBottom: '1px solid #aaa', fontWeight: 600, width: 80 }}>ListPrice</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '12px', textAlign: 'center', color: '#999', fontStyle: 'italic' }}>
                      Aucun article trouvé
                    </td>
                  </tr>
                ) : filtered.map(a => {
                  const isSelected = a.articleCode === selectedId;
                  return (
                    <tr
                      key={a.articleCode}
                      onClick={() => setSelectedId(a.articleCode)}
                      onDoubleClick={() => { setSelectedId(a.articleCode); onSelect(a); }}
                      style={{
                        background: isSelected ? '#0a246a' : 'transparent',
                        color:      isSelected ? '#fff'    : '#000',
                        cursor: 'pointer',
                      }}
                    >
                      {/* Indicateur de ligne courante */}
                      <td style={{
                        width: 16, textAlign: 'center', fontSize: 10,
                        borderRight: '1px solid #ddd',
                        borderBottom: '1px solid #eee',
                        color: isSelected ? '#fff' : '#000',
                      }}>
                        {isSelected ? '▶' : ''}
                      </td>
                      <td style={{
                        padding: '3px 10px',
                        borderRight: '1px solid #ddd',
                        borderBottom: '1px solid #eee',
                        fontWeight: 600,
                        fontSize: 12,
                      }}>
                        {a.articleCode}
                      </td>
                      <td style={{
                        padding: '3px 10px',
                        borderRight: '1px solid #ddd',
                        borderBottom: '1px solid #eee',
                      }}>
                        {a.articleName}
                      </td>
                      <td style={{ padding: '3px 10px', borderRight: '1px solid #ddd', borderBottom: '1px solid #eee', fontSize: 12, color: isSelected ? '#fff' : '#555' }}>
                        {a.producteur?.producerName || '—'}
                      </td>
                      <td style={{ padding: '3px 10px', borderBottom: '1px solid #eee', textAlign: 'right', fontWeight: 600 }}>
                        {(a.price || a.prix || 0).toFixed(2)} $
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Scrollbar info + boutons OK / Cancel */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
            <button style={btnStyle(true)} onClick={handleOk}>
              <span style={{ textDecoration: 'underline' }}>O</span>K
            </button>
            <button style={btnStyle(false)} onClick={onClose}>
              <span style={{ textDecoration: 'underline' }}>C</span>ancel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
