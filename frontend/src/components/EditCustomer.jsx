// src/components/EditCustomer.jsx
import { useState } from 'react';
import { CLIENTS } from '../data/clients';

const S = {
  label:  { fontSize: 11, color: '#444', marginBottom: 2, display: 'block' },
  input:  { padding: '3px 6px', fontSize: 13, border: '1px solid #aaa', borderRadius: 2, width: '100%', fontFamily: 'inherit', background: '#fff' },
  inputRO:{ padding: '3px 6px', fontSize: 13, border: '1px solid #ccc', borderRadius: 2, width: '100%', fontFamily: 'inherit', background: '#d4d0c8', color: '#555' },
  btnNav: { width: 26, height: 24, fontSize: 12, border: '1px solid #aaa', background: '#e8e8e8', cursor: 'pointer', borderRadius: 2, fontFamily: 'inherit' },
  btnOk:  { padding: '4px 0', width: 80, fontSize: 13, border: '2px solid #0a246a', borderRadius: 3, background: '#e8e8e8', cursor: 'pointer', fontFamily: 'inherit' },
  btnCan: { padding: '4px 0', width: 80, fontSize: 13, border: '1px solid #888', borderRadius: 3, background: '#e8e8e8', cursor: 'pointer', fontFamily: 'inherit' },
  field:  { marginBottom: 8 },
};

export default function EditCustomer({ clientId, allClients, onSave, onClose }) {
  // Index courant dans la liste
  const [idx, setIdx]     = useState(allClients.findIndex(c => c.id === clientId) ?? 0);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(null);

  const client = editing ? draft : allClients[idx];

  const goFirst = () => { if (!editing) setIdx(0); };
  const goPrev  = () => { if (!editing) setIdx(i => Math.max(0, i - 1)); };
  const goNext  = () => { if (!editing) setIdx(i => Math.min(allClients.length - 1, i + 1)); };
  const goLast  = () => { if (!editing) setIdx(allClients.length - 1); };

  const startEdit  = () => { setDraft({ ...allClients[idx] }); setEditing(true); };
  const startNew   = () => {
    const newId = 'C' + String(Date.now()).slice(-3);
    setDraft({ id: newId, clientName: '', add1: '', add2: '', city: '', state: 'QC', zip: '', country: 'Canada', tel: '', fax: '', contact: '', lastInvoice: '', taxRate: 9.975 });
    setEditing(true);
  };
  const cancelEdit = () => { setDraft(null); setEditing(false); };
  const deleteClient = () => {
    if (window.confirm('Supprimer ce client ?')) {
      onSave({ action: 'delete', id: allClients[idx].id });
      setIdx(i => Math.max(0, i - 1));
    }
  };

  const setF = (key, val) => setDraft(prev => ({ ...prev, [key]: val }));

  const handleOk = () => {
    if (editing) {
      if (!draft.clientName.trim()) { alert('Le nom est obligatoire.'); return; }
      onSave({ action: draft.id && allClients.find(c => c.id === draft.id) ? 'update' : 'add', client: draft });
    }
    onClose();
  };

  const handleCancel = () => {
    if (editing) { cancelEdit(); return; }
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}
      onClick={e => e.target === e.currentTarget && onClose()}>

      <div style={{ width: 440, background: '#f0f0f0', border: '2px solid #888', borderRadius: 3, boxShadow: '4px 4px 10px rgba(0,0,0,0.4)', fontFamily: 'Tahoma, Arial, sans-serif', fontSize: 13 }}>

        {/* Barre de titre */}
        <div style={{ background: 'linear-gradient(to right, #0a246a, #a6b8d8)', padding: '3px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>Edit Customers</span>
          <button onClick={onClose} style={{ width: 16, height: 14, fontSize: 10, background: '#c0c0c0', border: '1px solid #888', cursor: 'pointer', color: '#900', fontWeight: 700, lineHeight: 1 }}>✕</button>
        </div>

        <div style={{ padding: '10px 14px' }}>

          {/* Navigator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 12, padding: '3px 5px', background: '#e8e8e8', border: '1px solid #ccc', borderRadius: 2 }}>
            <button style={S.btnNav} onClick={goFirst}  title="Premier">|◄</button>
            <button style={S.btnNav} onClick={goPrev}   title="Précédent">◄</button>
            <button style={S.btnNav} onClick={goNext}   title="Suivant">►</button>
            <button style={S.btnNav} onClick={goLast}   title="Dernier">►|</button>
            <button style={S.btnNav} onClick={startNew} title="Nouveau">+</button>
            <button style={S.btnNav} onClick={deleteClient} title="Supprimer">−</button>
            <button style={S.btnNav} onClick={startEdit} title="Modifier">▲</button>
            <button style={{ ...S.btnNav, color: editing ? '#060' : '#aaa' }} onClick={handleOk} title="Valider">✔</button>
            <button style={{ ...S.btnNav, color: editing ? '#c00' : '#aaa' }} onClick={cancelEdit} title="Annuler">✕</button>
            <button style={S.btnNav} onClick={cancelEdit} title="Rafraîchir">↺</button>
            <div style={{ flex: 1 }} />
            <button style={S.btnNav}>🖨</button>
            <span style={{ fontSize: 11, color: '#666', marginLeft: 6 }}>{idx + 1}/{allClients.length}</span>
          </div>

          {/* Company + CustNo */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: 10, marginBottom: 8 }}>
            <div style={S.field}>
              <span style={S.label}>Company</span>
              <input style={editing ? S.input : { ...S.input, background: '#fff' }}
                value={client.clientName}
                onChange={e => setF('nom', e.target.value)}
                readOnly={!editing}
              />
            </div>
            <div style={S.field}>
              <span style={S.label}>CustNo</span>
              <input style={S.inputRO} readOnly value={client.id} />
            </div>
          </div>

          {/* Add1 + Phone */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: 10, marginBottom: 8 }}>
            <div>
              <span style={S.label}>Add1</span>
              <input style={S.input} value={client.add1 || ''}
                onChange={e => setF('add1', e.target.value)} readOnly={!editing} />
            </div>
            <div>
              <span style={S.label}>Phone</span>
              <input style={S.input} value={client.phone || ''}
                onChange={e => setF('tel', e.target.value)} readOnly={!editing} />
            </div>
          </div>

          {/* Add2 + Fax */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: 10, marginBottom: 8 }}>
            <div>
              <span style={S.label}>Add2</span>
              <input style={S.input} value={client.add2 || ''}
                onChange={e => setF('add2', e.target.value)} readOnly={!editing} />
            </div>
            <div>
              <span style={S.label}>Fax</span>
              <input style={S.input} value={client.fax || ''}
                onChange={e => setF('fax', e.target.value)} readOnly={!editing} />
            </div>
          </div>

          {/* City / State / Zip / Country */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 60px 120px 100px', gap: 8, marginBottom: 8 }}>
            <div>
              <span style={S.label}>City</span>
              <input style={S.input} value={client.city || ''}
                onChange={e => setF('city', e.target.value)} readOnly={!editing} />
            </div>
            <div>
              <span style={S.label}>State</span>
              <input style={S.input} value={client.state || ''}
                onChange={e => setF('state', e.target.value)} readOnly={!editing} />
            </div>
            <div>
              <span style={S.label}>Zip Code</span>
              <input style={S.input} value={client.zip || ''}
                onChange={e => setF('zip', e.target.value)} readOnly={!editing} />
            </div>
            <div>
              <span style={S.label}>Country</span>
              <input style={S.input} value={client.country || ''}
                onChange={e => setF('country', e.target.value)} readOnly={!editing} />
            </div>
          </div>

          {/* Contact / Last Invoice / Tax Rate */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 130px 100px', gap: 8, marginBottom: 14 }}>
            <div>
              <span style={S.label}>Contact</span>
              <input style={S.input} value={client.contact || ''}
                onChange={e => setF('contact', e.target.value)} readOnly={!editing} />
            </div>
            <div>
              <span style={S.label}>Last Invoice</span>
              <input style={S.input} type={editing ? 'date' : 'text'}
                value={client.lastInvoice || ''}
                onChange={e => setF('lastInvoice', e.target.value)} readOnly={!editing} />
            </div>
            <div>
              <span style={S.label}>Tax Rate</span>
              <input style={{ ...S.input, textAlign: 'right' }}
                type="number" step="0.001" min="0" max="100"
                value={client.taxRate ?? ''}
                onChange={e => setF('taxRate', parseFloat(e.target.value) || 0)}
                readOnly={!editing} />
            </div>
          </div>

          {/* Boutons OK / Cancel */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
            <button style={S.btnOk} onClick={handleOk}>
              <span style={{ textDecoration: 'underline' }}>O</span>K
            </button>
            <button style={S.btnCan} onClick={handleCancel}>
              <span style={{ textDecoration: 'underline' }}>C</span>ancel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
