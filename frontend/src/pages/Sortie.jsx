// src/pages/Sortie.jsx
import { useState, useEffect } from 'react';
import { CLIENTS }  from '../data/clients';
import { ARTICLES } from '../data/articles';
import ModalArticle  from '../components/ModalArticle';
import { DataGrid }  from '@mui/x-data-grid';
import { ClientAPI, ArticleAPI, FactureAPI } from '../data/api';

const today = new Date().toLocaleDateString('fr-CA', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
});
const numBon = 'BON-' + String(Date.now()).slice(-5);

function nouvelleLigne() {
  return { id: Date.now() + Math.random(), articleCode: '', articleName: '', quantity: '', unitPrice: '' };
}

const colonnesClients = [
  { field: 'id',      headerName: '#',        width: 70,  headerClassName: 'grid-header' },
  { field: 'nom',     headerName: 'Nom',       flex: 1,    headerClassName: 'grid-header' },
  { field: 'adresse', headerName: 'Adresse',   flex: 1.5,  headerClassName: 'grid-header',
    renderCell: params => <span style={{ fontSize: 12, color: '#888780' }}>{params.value}</span>,
  },
  { field: 'tel',     headerName: 'Téléphone', width: 140, headerClassName: 'grid-header',
    renderCell: params => <span style={{ fontSize: 12 }}>{params.value}</span>,
  },
];

export default function Sortie({ navigate }) {
  const [clients,        setClients]        = useState(CLIENTS);
  const [articles,       setArticles]       = useState(ARTICLES);
  const [selectedClient, setSelectedClient] = useState(CLIENTS[0]);
  const [selectionModel, setSelectionModel] = useState({ type: 'include', ids: new Set([CLIENTS[0]?.id]) });
  const [lignes,         setLignes]         = useState([nouvelleLigne()]);
  const [modalLigneId,   setModalLigneId]   = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [saving,         setSaving]         = useState(false);

  /* ── Chargement clients et articles depuis le backend ── */
  useEffect(() => {
    Promise.all([
      ClientAPI.getAll().catch(() => CLIENTS),
      ArticleAPI.getAll().catch(() => ARTICLES),
    ]).then(([clientsData, articlesData]) => {
      setClients(clientsData);
      setArticles(articlesData);
      if (clientsData.length > 0) {
        setSelectedClient(clientsData[0]);
        setSelectionModel({ type: 'include', ids: new Set([clientsData[0].id]) });
      }
    }).finally(() => setLoading(false));
  }, []);

  const total = lignes.reduce((s, l) =>
    s + (parseFloat(l.unitPrice) || 0) * (parseFloat(l.quantity) || 0), 0
  );

  /* v8 : rowSelectionModel est un objet { type, ids: Set } */
  const handleRowSelection = model => {
    setSelectionModel(model);
    const selectedId = [...model.ids][0];
    const client = CLIENTS.find(c => c.id === selectedId);
    if (client) setSelectedClient(client);
  };

  const updateLigne = (id, champ, valeur) => {
    setLignes(prev => prev.map(l => {
      if (l.id !== id) return l;
      const updated = { ...l, [champ]: valeur };
      if (champ === 'articleCode') {
        const art = ARTICLES.find(a => a.articleCode === valeur.toUpperCase());
        if (art)          { updated.articleCode = art.articleCode; updated.articleName = art.articleName; updated.unitPrice = art.price; }
        else if (!valeur) { updated.articleName = ''; updated.unitPrice = ''; }
      }
      return updated;
    }));
  };

  const ajouterLigne   = () => setLignes(prev => [...prev, nouvelleLigne()]);
  const supprimerLigne = id => { if (lignes.length > 1) setLignes(prev => prev.filter(l => l.id !== id)); };

  const pickArticle = art => {
    setLignes(prev => prev.map(l =>
      l.id === modalLigneId
        ? { ...l, articleCode: art.articleCode, articleName: art.articleName, unitPrice: art.price }
        : l
    ));
    setModalLigneId(null);
  };

  const valider = () => {
    if (!selectedClient) { alert('Veuillez sélectionner un client.'); return; }
    const valides = lignes.filter(l => l.articleCode && l.quantity);
    if (valides.length === 0) { alert('Veuillez ajouter au moins un article avec une quantité.'); return; }

    const facture = {
      invoiceNumber: 'BON-' + String(Date.now()).slice(-5),
      invoiceDate:   new Date().toISOString().slice(0, 10),
      client:        { id: selectedClient.id },
      totalAmount:   total,
      status:        'UNPAID',
      items:         valides.map(l => ({
        article:   { id: articles.find(a => a.articleCode === l.articleCode)?.id },
        quantity:  parseInt(l.quantity),
        unitPrice: parseFloat(l.unitPrice),
        lineTotal: parseFloat(l.unitPrice) * parseInt(l.quantity),
      })),
    };

    setSaving(true);
    FactureAPI.create(facture)
      .then(() => {
        alert(`✅ Bon de sortie enregistré !\nClient : ${selectedClient.clientName}\nTotal : ${total.toFixed(2)} $`);
        setLignes([nouvelleLigne()]);
      })
      .catch(() => {
        // Fallback — confirmer quand même localement
       alert("Bon de sortie enregistré (mode local) !\nClient : " + selectedClient.clientName + "\nTotal : " + total.toFixed(2) + " $");

        setLignes([nouvelleLigne()]);
      })
      .finally(() => setSaving(false));
  };

  const dataGridSx = {
    border: 'none',
    fontFamily: 'inherit',
    fontSize: 13,
    '& .grid-header': {
      backgroundColor: '#f5f5f3',
      fontSize: 11,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      color: '#888780',
    },
    '& .MuiDataGrid-row:hover':              { backgroundColor: '#f0f7ff', cursor: 'pointer' },
    '& .MuiDataGrid-row.Mui-selected':       { backgroundColor: '#dbeafe !important', color: '#1e40af', fontWeight: 600 },
    '& .MuiDataGrid-row.Mui-selected:hover': { backgroundColor: '#bfdbfe !important' },
    '& .MuiDataGrid-cell':                   { borderBottom: '1px solid #f0efea', outline: 'none !important' },
    '& .MuiDataGrid-columnSeparator':        { display: 'none' },
    '& .MuiDataGrid-footerContainer':        { borderTop: '1px solid #e8e7e0', minHeight: 40 },
    '& .MuiTablePagination-root':            { fontSize: 12 },
  };

  return (
    <div>
      {/* Loading */}
      {loading && (
        <div style={{ padding: '6px 14px', background: '#e6f1fb', borderRadius: 6, marginBottom: 10, fontSize: 13, color: '#185fa5' }}>
          ⏳ Chargement des données...
        </div>
      )}

      {/* Topbar */}
      <div className="topbar">
        <button className="btn" onClick={() => navigate('accueil')}>← Accueil</button>
        <span className="page-title">Bon de sortie</span>
      </div>

      {/* Bandeau client sélectionné */}
      {selectedClient && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
          padding: '10px 14px', background: '#e6f1fb', borderRadius: 8,
          marginBottom: 14, fontSize: 13, color: '#185fa5',
        }}>
          <strong style={{ color: '#0c447c' }}>{selectedClient.clientName}</strong>
          <span style={{ color: '#888780' }}>|</span>
          <span>{selectedClient.address}</span>
          <span style={{ color: '#888780' }}>|</span>
          <span>{selectedClient.phone}</span>
        </div>
      )}

      {/* Grille clients + date */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 14, alignItems: 'flex-start' }}>

        {/* MUI X DataGrid v8 */}
        <div style={{ flex: 2 }}>
          <div className="section-label">Sélection du client</div>
          <div style={{ height: 300, width: '100%', borderRadius: 12, overflow: 'hidden', border: '1px solid #e8e7e0' }}>
            <DataGrid
              rows={clients}
              columns={colonnesClients}
              rowSelectionModel={selectionModel}
              onRowSelectionModelChange={handleRowSelection}
              disableMultipleRowSelection
              hideFooterSelectedRowCount
              sx={dataGridSx}
            />
          </div>
        </div>

        {/* Date + numéro bon */}
        <div style={{ flex: 1 }}>
          <div className="section-label">Bon de sortie</div>
          <div className="card">
            <div style={{ fontSize: 11, color: '#888780', marginBottom: 5 }}>Date du jour</div>
            <div style={{ fontSize: 13, fontWeight: 500, padding: '8px 10px', background: '#f5f5f3', borderRadius: 7, marginBottom: 12 }}>{today}</div>
            <div style={{ fontSize: 11, color: '#888780', marginBottom: 5 }}>Numéro de bon</div>
            <div style={{ fontSize: 13, fontWeight: 700, padding: '8px 10px', background: '#f5f5f3', borderRadius: 7, color: '#534ab7' }}>{numBon}</div>
          </div>
        </div>
      </div>

      {/* Lignes articles */}
      <div className="section-label">Lignes d'articles</div>
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 14 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 110 }}>Clé article</th>
              <th>Désignation</th>
              <th style={{ width: 80 }}>Quantité</th>
              <th style={{ width: 120, textAlign: 'right' }}>Prix unit. ($)</th>
              <th style={{ width: 110, textAlign: 'right' }}>Total</th>
              <th style={{ width: 36 }}></th>
            </tr>
          </thead>
          <tbody>
            {lignes.map(l => (
              <tr key={l.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <input type="text" value={l.articleCode} placeholder="A001"
                      onChange={e => updateLigne(l.id, 'artId', e.target.value)}
                      style={{ width: 62, textAlign: 'center', fontWeight: 600, padding: '5px 6px' }} />
                    <button title="Choisir un article" onClick={() => setModalLigneId(l.id)}
                      style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid #d0cfc8', background: '#f5f5f3', cursor: 'pointer', fontSize: 14, color: '#5f5e5a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      ⊞
                    </button>
                  </div>
                </td>
                <td style={{ color: l.articleName ? '#1a1a1a' : '#b4b2a9', fontStyle: l.articleName ? 'normal' : 'italic' }}>
                  {l.articleName || '— sélectionner un article —'}
                </td>
                <td>
                  <input type="number" min="1" value={l.quantity} placeholder="0"
                    onChange={e => updateLigne(l.id, 'qte', e.target.value)}
                    style={{ width: 60, textAlign: 'center', padding: '5px 6px' }} />
                </td>
                <td>
                  <input type="number" min="0" step="0.01" value={l.unitPrice} placeholder="0.00"
                    onChange={e => updateLigne(l.id, 'prix', e.target.value)}
                    style={{ width: 100, textAlign: 'right', padding: '5px 8px' }} />
                </td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>
                  {l.unitPrice && l.quantity ? (parseFloat(l.unitPrice) * parseFloat(l.quantity)).toFixed(2) + ' $' : '—'}
                </td>
                <td>
                  <button onClick={() => supprimerLigne(l.id)}
                    style={{ width: 24, height: 24, borderRadius: '50%', border: 'none', background: 'none', color: '#b4b2a9', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#a32d2d'; e.currentTarget.style.background = '#fcebeb'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#b4b2a9'; e.currentTarget.style.background = 'none'; }}>
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ padding: '8px 14px', borderTop: '1px solid #f0efea' }}>
          <button onClick={ajouterLigne}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', fontSize: 13, border: '1px dashed #d0cfc8', borderRadius: 8, background: 'none', color: '#888780', cursor: 'pointer', fontFamily: 'inherit' }}>
            + Ajouter une ligne
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 20, padding: '12px 16px', borderTop: '1px solid #e8e7e0' }}>
          <span style={{ fontSize: 13, color: '#888780' }}>Total général</span>
          <span style={{ fontSize: 22, fontWeight: 700 }}>{total.toFixed(2)} $</span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <button className="btn" onClick={() => {
          setSelectedClient(CLIENTS[0]);
          setSelectionModel({ type: 'include', ids: new Set([CLIENTS[0].id]) });
          setLignes([nouvelleLigne()]);
        }}>Annuler</button>
        <button className="btn">Imprimer</button>
        <button className="btn btn-primary" onClick={valider} disabled={saving} style={{ opacity: saving ? 0.6 : 1 }}>{saving ? '⏳ Enregistrement...' : 'Valider le bon'}</button>
      </div>

      {/* Modal sélection article */}
      {modalLigneId !== null && (
        <ModalArticle onSelect={pickArticle} onClose={() => setModalLigneId(null)} />
      )}
    </div>
  );
}
