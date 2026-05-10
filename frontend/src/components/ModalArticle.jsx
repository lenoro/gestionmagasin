import { useState, useEffect } from 'react';
import { ArticleAPI } from '../data/api';

export default function ModalArticle({ onSelect, onClose }) {
  const [search,   setSearch]   = useState('');
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    ArticleAPI.getAll().then(setArticles).catch(() => setArticles([]));
  }, []);

  const q = search.toLowerCase();
  const filtered = articles.filter(a =>
    (a.articleCode  || '').toLowerCase().includes(q) ||
    (a.articleName  || '').toLowerCase().includes(q) ||
    (a.categorie    || '').toLowerCase().includes(q)
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h2>Choisir un article</h2>

        <div style={{ marginBottom: 10 }}>
          <input
            type="search"
            placeholder="Rechercher par code, désignation ou catégorie..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        <div className="modal-body">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 70 }}>Code</th>
                <th>Désignation</th>
                <th style={{ width: 90 }}>Catégorie</th>
                <th style={{ width: 80, textAlign: 'right' }}>Prix</th>
                <th style={{ width: 60, textAlign: 'right' }}>Stock</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: '#888', padding: '1.5rem' }}>Aucun article trouvé</td></tr>
              ) : filtered.map(a => (
                <tr key={a.articleCode} className="selectable" onClick={() => onSelect(a)}>
                  <td style={{ fontWeight: 600 }}>{a.articleCode}</td>
                  <td>{a.articleName}</td>
                  <td><span className="badge-cat" style={{ padding: '2px 7px', borderRadius: 20, fontSize: 11, background: '#f0efea', color: '#5f5e5a' }}>{a.categorie || '—'}</span></td>
                  <td style={{ textAlign: 'right' }}>{(a.price ?? 0).toFixed(2)} D.A</td>
                  <td style={{ textAlign: 'right', fontWeight: 600,
                    color: (a.stock ?? 0) === 0 ? '#a32d2d' : (a.stock ?? 0) <= 3 ? '#854f0b' : '#3b6d11'
                  }}>{a.stock ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
}
