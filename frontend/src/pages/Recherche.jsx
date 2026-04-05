// src/pages/Recherche.jsx
import { useState, useEffect } from 'react';
import { CLIENTS }                       from '../data/clients';
import { COMMANDES, calcCommandeTotaux } from '../data/commandes';
import { ClientAPI, FactureAPI } from '../data/api';
import EditCustomer    from '../components/EditCustomer';
import SpecifyDateRange from '../components/SpecifyDateRange';

/* ── Styles partagés façon Windows classic ── */
const F = {
  win:       { fontFamily: 'Tahoma, Arial, sans-serif', fontSize: 13, background: '#f0f0f0', minHeight: '100vh', padding: '1rem' },
  titleBar:  { background: 'linear-gradient(to right, #0a246a, #a6b8d8)', padding: '3px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  btnNav:    { width: 52, height: 48, fontSize: 18, border: '1px solid #aaa', background: '#e8e8e8', cursor: 'pointer', borderRadius: 2, fontFamily: 'inherit' },
  btnAction: { padding: '4px 0', width: 100, height: 48, fontSize: 12, border: '1px solid #888', borderRadius: 3, background: '#e8e8e8', cursor: 'pointer', fontFamily: 'inherit' },
  grid:      { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th:        { padding: '3px 8px', textAlign: 'left', background: '#d4d0c8', fontWeight: 600, borderRight: '1px solid #aaa', borderBottom: '1px solid #aaa', whiteSpace: 'nowrap' },
  td: sel => ({ padding: '3px 8px', borderBottom: '1px solid #eee', borderRight: '1px solid #eee', background: sel ? '#0a246a' : 'transparent', color: sel ? '#fff' : '#000', cursor: 'pointer', whiteSpace: 'nowrap' }),
};

export default function Recherche({ navigate }) {
  const [clients,        setClients]        = useState([]);
  const [commandes,      setCommandes]      = useState(COMMANDES);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedCmdId,  setSelectedCmdId]  = useState(null);
  const [editClientId,   setEditClientId]   = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);

  /* ── Chargement initial clients ── */
  useEffect(() => {
    setLoading(true);
    ClientAPI.getAll()
      .then(data => {
        setClients(data);
        if (data.length > 0) setSelectedClient(data[0]);
      })
      .catch(() => {
        console.warn('Backend indisponible — données locales utilisées');
        const local = CLIENTS.map(c => ({ ...c }));
        setClients(local);
        if (local.length > 0) setSelectedClient(local[0]);
        setError('Backend indisponible — données locales');
      })
      .finally(() => setLoading(false));
  }, []);

  /* ── Chargement commandes quand client change ── */
  useEffect(() => {
    if (!selectedClient) return;
    FactureAPI.getByClient(selectedClient.id)
      .then(data => setCommandes(data))
      .catch(() => {
        // Fallback données locales filtrées par clientId
        setCommandes(COMMANDES.filter(c => c.clientId === selectedClient.id));
      });
  }, [selectedClient]);

  /* ── État de la requête paramétrée ── */
  const [showDefineQuery, setShowDefineQuery] = useState(false); // fenêtre Specify Date Range
  const [queryActive,     setQueryActive]     = useState(false); // bouton Activate Query enfoncé
  const [dateFrom,        setDateFrom]        = useState('2024-01-01');
  const [dateTo,          setDateTo]          = useState(new Date().toISOString().slice(0, 10));
  // Paramètres appliqués (copie au moment du OK)
  const [appliedFrom,     setAppliedFrom]     = useState('');
  const [appliedTo,       setAppliedTo]       = useState('');

  /* ── Requête paramétrée : filtre clients par LastInvoiceDate ── */
  const clientsFiltres = queryActive
    ? clients.filter(c => {
        const lastInv = c.lastInvoice || '';
        if (!lastInv) return false;           // pas de date = exclu
        if (appliedFrom && lastInv < appliedFrom) return false;
        if (appliedTo   && lastInv > appliedTo)   return false;
        return true;
      })
    : clients;

  /* ── Navigation clients ── */
  const idxClient = clientsFiltres.findIndex(c => c.id === selectedClient?.id);
  const goFirst = () => clientsFiltres.length && setSelectedClient(clientsFiltres[0]);
  const goPrev  = () => idxClient > 0 && setSelectedClient(clientsFiltres[idxClient - 1]);
  const goNext  = () => idxClient < clientsFiltres.length - 1 && setSelectedClient(clientsFiltres[idxClient + 1]);
  const goLast  = () => clientsFiltres.length && setSelectedClient(clientsFiltres[clientsFiltres.length - 1]);

  /* ── Commandes filtrées depuis le state ── */

  const derniereFacture = clientId => {
    const cmds = commandes.filter(c => c.clientId === clientId);
    if (!cmds.length) {
      // fallback données locales
      const local = COMMANDES.filter(c => c.clientId === clientId);
      if (!local.length) return '—';
      return local.sort((a, b) => (b.invoiceDate||'').localeCompare(a.invoiceDate||''))[0].invoiceDate || '—';
    }
    return cmds.sort((a, b) => (b.invoiceDate||'').localeCompare(a.invoiceDate||''))[0].invoiceDate || '—';
  };

  /* ── Handlers query ── */
  const handleDefineQuery = () => setShowDefineQuery(true);

  const handleDateChange = (which, val) => {
    if (which === 'from') setDateFrom(val);
    else                  setDateTo(val);
  };

  const handleDateRangeOk = () => {
    // Valider les dates
    if (dateFrom && dateTo && dateFrom > dateTo) {
      alert('La date "From" doit être antérieure à la date "To".');
      return;
    }
    setAppliedFrom(dateFrom);
    setAppliedTo(dateTo);
    setShowDefineQuery(false);
    // Active automatiquement la requête après OK
    setQueryActive(true);
    // Sélectionner le premier client résultat
    const filtered = clients.filter(c => {
      const li = c.lastInvoice || '';
      if (!li) return false;
      if (dateFrom && li < dateFrom) return false;
      if (dateTo   && li > dateTo)   return false;
      return true;
    });
    if (filtered.length > 0) setSelectedClient(filtered[0]);
  };

  const handleActivateQuery = () => {
    if (!queryActive) {
      // Doit d'abord définir une requête
      if (!appliedFrom && !appliedTo) {
        setShowDefineQuery(true);
        return;
      }
      setQueryActive(true);
      if (clientsFiltres.length > 0) setSelectedClient(clientsFiltres[0]);
    } else {
      // Désactiver — bouton se relève
      setQueryActive(false);
      setSelectedClient(clients[0]);
    }
  };

  const handleReset = () => {
    setQueryActive(false);
    setAppliedFrom('');
    setAppliedTo('');
    setSelectedClient(clients[0]);
    setSelectedCmdId(null);
  };

  /* ── CRUD clients ── */
  const handleClientSave = ({ action, client, id }) => {
    if (action === 'update') {
      ClientAPI.update(client.id, client)
        .then(updated => setClients(prev => prev.map(c => c.id === updated.id ? updated : c)))
        .catch(() => setClients(prev => prev.map(c => c.id === client.id ? client : c)));
      setSelectedClient(client);
    } else if (action === 'add') {
      ClientAPI.create(client)
        .then(created => { setClients(prev => [...prev, created]); setSelectedClient(created); })
        .catch(() => { setClients(prev => [...prev, client]); setSelectedClient(client); });
    } else if (action === 'delete') {
      ClientAPI.delete(id)
        .catch(() => console.warn('Erreur suppression client'));
      setClients(prev => {
        const updated = prev.filter(c => c.id !== id);
        setSelectedClient(updated[0] || null);
        return updated;
      });
    }
  };

  return (
    <div style={F.win}>
      <div style={{ maxWidth: 660, margin: '0 auto', background: '#f0f0f0', border: '2px solid #888', borderRadius: 4, boxShadow: '3px 3px 8px rgba(0,0,0,0.3)' }}>

        {/* ── Barre de titre ── */}
        <div style={F.titleBar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14 }}>📋</span>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>Affectation par Employé</span>
          </div>
          <div style={{ display: 'flex', gap: 2 }}>
            <button style={{ width: 16, height: 14, fontSize: 10, background: '#c0c0c0', border: '1px solid #888', cursor: 'pointer' }}>─</button>
            <button style={{ width: 16, height: 14, fontSize: 10, background: '#c0c0c0', border: '1px solid #888', cursor: 'pointer' }}>□</button>
            <button onClick={() => navigate('accueil')} style={{ width: 16, height: 14, fontSize: 10, background: '#c0c0c0', border: '1px solid #888', cursor: 'pointer', color: '#900', fontWeight: 700 }}>✕</button>
          </div>
        </div>

        <div style={{ padding: '8px 10px' }}>

          {/* ── Toolbar ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10, padding: '4px 6px', background: '#e8e8e8', border: '1px solid #ccc', borderRadius: 2, flexWrap: 'wrap' }}>

            {/* Navigator */}
            <button style={F.btnNav} title="Premier"    onClick={goFirst}>|◄</button>
            <button style={F.btnNav} title="Précédent"  onClick={goPrev}>◄</button>
            <button style={F.btnNav} title="Suivant"    onClick={goNext}>►</button>
            <button style={F.btnNav} title="Dernier"    onClick={goLast}>►|</button>
            <button style={F.btnNav} title="Réinitialiser" onClick={handleReset}>↺</button>

            <div style={{ width: 1, height: 20, background: '#aaa', margin: '0 4px' }} />

            {/* Indicateur de requête active */}
            {queryActive && (
              <div style={{ fontSize: 11, background: '#fffbe6', border: '1px solid #f0c040', borderRadius: 3, padding: '2px 8px', color: '#7a5c00', whiteSpace: 'nowrap' }}>
                🔍 {appliedFrom} → {appliedTo}
                &nbsp;({clientsFiltres.length} client{clientsFiltres.length !== 1 ? 's' : ''})
              </div>
            )}

            <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
              {/* Define Query — ouvre Specify Date Range */}
              <button
                style={{ ...F.btnAction, width: 95 }}
                onClick={handleDefineQuery}
                title="Définir les paramètres de la requête"
              >
                Définir Requête
              </button>

              {/* Activate Query — bouton bascule enfoncé/relevé */}
              <button
                style={{
                  ...F.btnAction,
                  width: 105,
                  background:  queryActive ? '#a8c8e8' : '#e8e8e8',
                  border:      queryActive ? '2px inset #6090b8' : '1px solid #888',
                  fontWeight:  queryActive ? 700 : 400,
                  color:       queryActive ? '#003366' : '#000',
                  boxShadow:   queryActive ? 'inset 2px 2px 3px rgba(0,0,0,0.2)' : 'none',
                }}
                onClick={handleActivateQuery}
                title={queryActive ? 'Désactiver la requête' : 'Activer la requête'}
              >
                Exécuter Requête
              </button>
            </div>
          </div>

          {/* ── Indicateur loading / error ── */}
          {loading && (
            <div style={{ padding: '5px 10px', background: '#e6f1fb', borderRadius: 3, marginBottom: 8, fontSize: 12, color: '#185fa5' }}>
              ⏳ Chargement des clients...
            </div>
          )}
          {error && (
            <div style={{ padding: '5px 10px', background: '#faeeda', borderRadius: 3, marginBottom: 8, fontSize: 12, color: '#854f0b' }}>
              ⚠ {error}
            </div>
          )}

          {/* ── Bandeau info requête active ── */}
          {queryActive && (
            <div style={{ marginBottom: 8, padding: '5px 10px', background: '#e8f4ff', border: '1px solid #90bce0', borderRadius: 3, fontSize: 12, color: '#003366', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>
                <strong>Requête active</strong> — Clients avec LastInvoiceDate entre&nbsp;
                <strong>{appliedFrom || '…'}</strong> et <strong>{appliedTo || '…'}</strong>
              </span>
              <button onClick={handleReset} style={{ fontSize: 11, border: '1px solid #90bce0', background: 'none', cursor: 'pointer', color: '#003366', borderRadius: 3, padding: '1px 8px' }}>
                ✕ Désactiver
              </button>
            </div>
          )}

          {/* ── DBGrid Clients ── */}
          <div style={{ border: '2px inset #999', background: '#fff', marginBottom: 8, height: 160, overflowY: 'auto' }}>
            <table style={F.grid}>
              <thead>
                <tr>
                  <th style={{ ...F.th, width: 16 }}></th>
                  <th style={{ ...F.th, width: 70 }}>Clé Em</th>
                  <th style={F.th}>Employé</th>
                  <th style={F.th}>Téléphone</th>
                  <th style={{ ...F.th, width: 110 }}>Dernière Aff</th>
                </tr>
              </thead>
              <tbody>
                {clientsFiltres.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '16px', textAlign: 'center', color: '#999', fontStyle: 'italic' }}>
                      {queryActive
                        ? `Aucun client avec une facture entre ${appliedFrom} et ${appliedTo}`
                        : 'Aucun client'}
                    </td>
                  </tr>
                ) : clientsFiltres.map(c => {
                  const sel = selectedClient?.id === c.id;
                  const lastInv = derniereFacture(c.id);
                  // Mise en évidence si dans la plage
                  const inRange = queryActive && c.lastInvoice >= appliedFrom && c.lastInvoice <= appliedTo;
                  return (
                    <tr
                      key={c.id}
                      onClick={() => { setSelectedClient(c); setSelectedCmdId(null); }}
                      onDoubleClick={() => setEditClientId(c.id)}
                      style={{ cursor: 'default' }}
                    >
                      <td style={{ ...F.td(sel), width: 16, textAlign: 'center', fontSize: 10 }}>{sel ? '▶' : ''}</td>
                      <td style={{ ...F.td(sel), fontWeight: 600, fontSize: 12 }}>{c.id}</td>
                      <td style={{ ...F.td(sel), fontWeight: sel ? 600 : 400 }}>{c.clientName}</td>
                      <td style={{ ...F.td(sel), fontSize: 12 }}>{c.phone}</td>
                      <td style={{ ...F.td(sel), fontSize: 12, color: sel ? '#fff' : inRange ? '#006600' : '#000', fontWeight: inRange && !sel ? 600 : 400 }}>
                        {lastInv}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── DBGrid Commandes ── */}
          <div style={{ border: '2px inset #999', background: '#fff', marginBottom: 10, height: 170, overflowY: 'auto' }}>
            <table style={F.grid}>
              <thead>
                <tr>
                  <th style={{ ...F.th, width: 16 }}></th>
                  <th style={{ ...F.th, width: 75 }}>N° Emp</th>
                  <th style={{ ...F.th, width: 95 }}>Date</th>
                  <th style={{ ...F.th, width: 95 }}>Date Effective</th>
                  <th style={{ display: 'none' }}>AmountPaid</th>
                  <th style={{ ...F.th, textAlign: 'right', borderRight: 'none' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {commandes.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: '12px', textAlign: 'center', color: '#999', fontStyle: 'italic' }}>
                    {selectedClient ? 'Aucune commande pour ce client' : 'Sélectionnez un client'}
                  </td></tr>
                ) : commandes.map(cmd => {
                  const sel    = selectedCmdId === cmd.id;
                  const totaux = calcCommandeTotaux(cmd);
                  return (
                    <tr key={cmd.id} onClick={() => setSelectedCmdId(cmd.id)} style={{ cursor: 'default' }}>
                      <td style={{ ...F.td(sel), width: 16, textAlign: 'center', fontSize: 10 }}>{sel ? '▶' : ''}</td>
                      <td style={{ ...F.td(sel), fontWeight: 600 }}>{cmd.id}</td>
                      <td style={{ ...F.td(sel), fontSize: 12 }}>{cmd.invoiceDate}</td>
                      <td style={{ ...F.td(sel), fontSize: 12 }}>{cmd.shipDate || '—'}</td>
                      <td style={{ display: 'none' }}></td>
                      <td style={{ ...F.td(sel), textAlign: 'right', color: sel ? '#fff' : totaux.due > 0 ? '#c00' : '#060', fontWeight: 600, borderRight: 'none' }}>
                        {totaux.due.toFixed(2)} $
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Détail commande ── */}
          {selectedCmdId && (() => {
            const cmd = commandes.find(c => c.id === selectedCmdId);
            if (!cmd) return null;
            return (
              <div style={{ marginBottom: 10, padding: '8px 10px', background: '#fff', border: '1px solid #ccc', borderRadius: 2, fontSize: 12 }}>
                <div style={{ display: 'flex', gap: 20, marginBottom: 6, flexWrap: 'wrap' }}>
                  <span><strong>Bon :</strong> {cmd.poNum}</span>
                  <span><strong>Vendeur :</strong> {cmd.vendeur?.vendorName || cmd.vendeur || '—'}</span>
                  <span><strong>Transport :</strong> {cmd.transporteur}</span>
                  <span><strong>Paiement :</strong> {cmd.paiement}</span>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: '#d4d0c8' }}>
                      <th style={{ padding: '2px 6px', textAlign: 'left',  borderRight: '1px solid #aaa' }}>PartNo</th>
                      <th style={{ padding: '2px 6px', textAlign: 'left',  borderRight: '1px solid #aaa' }}>Description</th>
                      <th style={{ padding: '2px 6px', textAlign: 'right', borderRight: '1px solid #aaa' }}>Prix</th>
                      <th style={{ padding: '2px 6px', textAlign: 'center',borderRight: '1px solid #aaa' }}>Qté</th>
                      <th style={{ padding: '2px 6px', textAlign: 'right', borderRight: '1px solid #aaa' }}>Remise</th>
                      <th style={{ padding: '2px 6px', textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cmd.items.map(l => {
                      const ext = l.unitPrice * l.quantity * (1 - l.remise / 100);
                      return (
                        <tr key={l.id}>
                          <td style={{ padding: '2px 6px', borderBottom: '1px solid #eee', fontWeight: 700 }}>{l.articleCode}</td>
                          <td style={{ padding: '2px 6px', borderBottom: '1px solid #eee' }}>{l.articleName}</td>
                          <td style={{ padding: '2px 6px', borderBottom: '1px solid #eee', textAlign: 'right' }}>{l.unitPrice.toFixed(2)} $</td>
                          <td style={{ padding: '2px 6px', borderBottom: '1px solid #eee', textAlign: 'center' }}>{l.quantity}</td>
                          <td style={{ padding: '2px 6px', borderBottom: '1px solid #eee', textAlign: 'right', color: l.remise > 0 ? '#c00' : '#000' }}>{l.remise.toFixed(2)}%</td>
                          <td style={{ padding: '2px 6px', borderBottom: '1px solid #eee', textAlign: 'right', fontWeight: 600 }}>{ext.toFixed(2)} $</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })()}

          {/* ── Boutons Edit / Close ── */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button
              style={{ ...F.btnAction, width: 80, opacity: selectedClient ? 1 : 0.5 }}
              onClick={() => selectedClient && setEditClientId(selectedClient.id)}
              disabled={!selectedClient}
            >
              Modifier
            </button>
            <button style={{ ...F.btnAction, width: 80 }} onClick={() => navigate('accueil')}>
              Fermer
            </button>
          </div>

        </div>
      </div>

      {/* ── Fenêtre Specify Date Range ── */}
      {showDefineQuery && (
        <SpecifyDateRange
          dateFrom={dateFrom}
          dateTo={dateTo}
          onChange={handleDateChange}
          onOk={handleDateRangeOk}
          onClose={() => setShowDefineQuery(false)}
        />
      )}

      {/* ── Fenêtre Edit Customer ── */}
      {editClientId && (
        <EditCustomer
          clientId={editClientId}
          allClients={clients}
          onSave={handleClientSave}
          onClose={() => setEditClientId(null)}
        />
      )}
    </div>
  );
}
