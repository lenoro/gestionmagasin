// src/components/ModalArticle.jsx
import { useState } from 'react';
import { ARTICLES } from '../data/articles';

export default function ModalArticle({ onSelect, onClose }) {
  const [search, setSearch] = useState('');

  const filtered = ARTICLES.filter(a =>
    a.id.toLowerCase().includes(search.toLowerCase()) ||
    a.designation.toLowerCase().includes(search.toLowerCase()) ||
    a.categorie.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h2>Choisir un article</h2>

        <div style={{ marginBottom: 10 }}>
          <input
            type="search"
            placeholder="Rechercher par clé, désignation ou catégorie..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        <div className="modal-body">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 70 }}>Clé</th>
                <th>Désignation</th>
                <th style={{ width: 90 }}>Catégorie</th>
                <th style={{ width: 80, textAlign: 'right' }}>Prix</th>
                <th style={{ width: 60, textAlign: 'right' }}>Stock</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: '#888780', padding: '1.5rem' }}>Aucun article trouvé</td></tr>
              ) : filtered.map(a => (
                <tr key={a.id} className="selectable" onClick={() => onSelect(a)}>
                  <td style={{ fontWeight: 600 }}>{a.id}</td>
                  <td>{a.designation}</td>
                  <td><span className="badge-cat" style={{ padding: '2px 7px', borderRadius: 20, fontSize: 11, background: '#f0efea', color: '#5f5e5a' }}>{a.categorie}</span></td>
                  <td style={{ textAlign: 'right' }}>{a.prix.toFixed(2)} $</td>
                  <td style={{ textAlign: 'right', color: a.stock === 0 ? '#a32d2d' : a.stock <= a.seuil ? '#854f0b' : '#3b6d11', fontWeight: 600 }}>{a.stock}</td>
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
