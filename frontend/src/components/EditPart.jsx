// src/components/EditPart.jsx
import { useState } from 'react';
import { VENDORS } from '../data/articles';

const S = {
  label:   { fontSize: 13, color: '#000', display: 'block', marginBottom: 0, width: 90, flexShrink: 0 },
  input:   { padding: '3px 6px', fontSize: 13, border: '1px solid #aaa', borderRadius: 2, fontFamily: 'inherit', background: '#fff' },
  inputRO: { padding: '3px 6px', fontSize: 13, border: '1px solid #ccc', borderRadius: 2, fontFamily: 'inherit', background: '#d4d0c8', color: '#555' },
  inputNum:{ padding: '3px 6px', fontSize: 13, border: '1px solid #aaa', borderRadius: 2, fontFamily: 'inherit', background: '#fff', textAlign: 'right' },
  select:  { padding: '3px 6px', fontSize: 13, border: '1px solid #aaa', borderRadius: 2, fontFamily: 'inherit', background: '#fff', flex: 1 },
  btnNav:  { width: 26, height: 24, fontSize: 12, border: '1px solid #aaa', background: '#e8e8e8', cursor: 'pointer', borderRadius: 2, fontFamily: 'inherit' },
  row:     { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 },
};

const errStyle = { border: '1px solid #c00', background: '#fff0f0' };
const errMsg   = { fontSize: 11, color: '#c00', marginTop: 1 };

function validate(d) {
  const e = {};
  if (!d.articleName?.trim())           e.articleName = 'La description est obligatoire.';
  if ((d.price ?? 0) <= 0)              e.price       = 'Le prix doit être supérieur à 0.';
  if ((d.stock ?? 0) < 0)              e.stock       = 'Le stock ne peut pas être négatif.';
  if ((d.cost ?? 0) < 0)               e.cost        = 'Le coût ne peut pas être négatif.';
  if ((d.cost ?? 0) > (d.price ?? 0))  e.cost        = (e.cost ? e.cost + ' ' : '') + 'Le coût dépasse le prix de vente.';
  return e;
}

export default function EditPart({ articleId, allArticles, onSave, onClose }) {
  const [idx, setIdx]       = useState(() => { const i = allArticles.findIndex(a => a.id === articleId); return i >= 0 ? i : 0; });
  const [editing, setEditing] = useState(true);
  const [draft, setDraft]   = useState({ ...allArticles[Math.max(0, allArticles.findIndex(a => a.id === articleId))] });
  const [errors, setErrors] = useState({});

  const art = editing ? draft : allArticles[idx];

  if (!art) return null;

  /* ── Navigator ── */
  const goFirst = () => { if (!editing) setIdx(0); };
  const goPrev  = () => { if (!editing) setIdx(i => Math.max(0, i - 1)); };
  const goNext  = () => { if (!editing) setIdx(i => Math.min(allArticles.length - 1, i + 1)); };
  const goLast  = () => { if (!editing) setIdx(allArticles.length - 1); };

  const startEdit   = () => { setDraft({ ...allArticles[idx] }); setEditing(true); };
  const cancelEdit  = () => { setDraft(null); setEditing(false); };
  const startNew    = () => {
    const newId = 'A' + String(Date.now()).slice(-3);
    setDraft({ id: newId, articleName: '', vendor: VENDORS[0], onHand: 0, onOrder: 0, backordered: 'No', cost: 0, listPrice: 0, categorie: 'Électronique' });
    setEditing(true);
  };
  const deleteArt = () => {
    if (window.confirm('Supprimer cet article ?')) {
      onSave({ action: 'delete', id: allArticles[idx].id });
      setIdx(i => Math.max(0, i - 1));
      setEditing(false);
    }
  };

  const setF = (key, val) => setDraft(prev => ({ ...prev, [key]: val }));

  const handleOk = () => {
    if (editing) {
      const e = validate(draft);
      if (Object.keys(e).length > 0) { setErrors(e); return; }
      setErrors({});
      const exists = allArticles.find(a => a.id === draft.id);
      onSave({ action: exists ? 'update' : 'add', article: draft });
    }
    onClose();
  };

  const handleCancel = () => {
    if (editing) { cancelEdit(); return; }
    onClose();
  };

  const inputStyle = (align = 'left') => editing
    ? { ...S.input, flex: 1, textAlign: align }
    : { ...S.inputRO, flex: 1, textAlign: align };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ width: 400, background: '#d4d0c8', border: '2px solid #888', borderRadius: 3, boxShadow: '4px 4px 10px rgba(0,0,0,0.4)', fontFamily: 'Tahoma, Arial, sans-serif', fontSize: 13 }}>

        {/* Barre de titre */}
        <div style={{ background: 'linear-gradient(to right, #0a246a, #a6b8d8)', padding: '3px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14 }}>🔧</span>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>Edit Parts</span>
          </div>
          <div style={{ display: 'flex', gap: 2 }}>
            <button style={{ width: 16, height: 14, fontSize: 10, background: '#c0c0c0', border: '1px solid #888', cursor: 'pointer' }}>─</button>
            <button style={{ width: 16, height: 14, fontSize: 10, background: '#c0c0c0', border: '1px solid #888', cursor: 'pointer' }}>□</button>
            <button onClick={onClose} style={{ width: 16, height: 14, fontSize: 10, background: '#c0c0c0', border: '1px solid #888', cursor: 'pointer', color: '#900', fontWeight: 700, lineHeight: 1 }}>✕</button>
          </div>
        </div>

        <div style={{ padding: '10px 14px' }}>

          {/* ── Navigator ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 14, padding: '3px 5px', background: '#e8e8e8', border: '1px solid #ccc', borderRadius: 2 }}>
            <button style={S.btnNav} onClick={goFirst}   title="Premier">|◄</button>
            <button style={S.btnNav} onClick={goPrev}    title="Précédent">◄</button>
            <button style={S.btnNav} onClick={goNext}    title="Suivant">►</button>
            <button style={S.btnNav} onClick={goLast}    title="Dernier">►|</button>
            <button style={S.btnNav} onClick={startNew}  title="Nouveau">+</button>
            <button style={S.btnNav} onClick={deleteArt} title="Supprimer">−</button>
            <button style={S.btnNav} onClick={startEdit} title="Modifier">▲</button>
            <button style={{ ...S.btnNav, color: editing ? '#060' : '#bbb' }} onClick={handleOk}    title="Valider">✔</button>
            <button style={{ ...S.btnNav, color: editing ? '#c00' : '#bbb' }} onClick={cancelEdit}  title="Annuler édition">✕</button>
            <button style={S.btnNav} onClick={cancelEdit} title="Rafraîchir">↺</button>
            <div style={{ flex: 1 }} />
            <button style={S.btnNav}>🖨</button>
            <span style={{ fontSize: 11, color: '#666', marginLeft: 6 }}>{idx + 1}/{allArticles.length}</span>
          </div>

          {/* ── Champs ── */}

          {/* PartNo */}
          <div style={S.row}>
            <span style={S.label}>PartNo</span>
            <input style={{ ...S.inputRO, flex: 1 }} readOnly value={art.articleCode} />
          </div>

          {/* Description */}
          <div style={{ ...S.row, alignItems: 'flex-start', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
              <span style={S.label}>Description</span>
              <input
                style={{ ...inputStyle(), ...(errors.articleName ? errStyle : {}) }}
                value={art.articleName}
                onChange={e => { setF('articleName', e.target.value); setErrors(ev => ({ ...ev, articleName: undefined })); }}
                readOnly={!editing}
                autoFocus={editing}
              />
            </div>
            {errors.articleName && <span style={{ ...errMsg, marginLeft: 98 }}>{errors.articleName}</span>}
          </div>

          {/* Vendor — DBLookupComboBox */}
          <div style={S.row}>
            <span style={S.label}>Vendor</span>
            {editing
              ? <select style={S.select} value={art.producteur?.producerName} onChange={e => setF('producteur', { producerName: e.target.value })}>
                  {VENDORS.map(v => <option key={v.id} value={v.vendorName}>{v.vendorName}</option>)}
                </select>
              : <div style={{ ...S.inputRO, flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'default' }}>
                  <span>{art.producteur?.producerName ?? '—'}</span>
                  <span style={{ fontSize: 10, color: '#888' }}>▼</span>
                </div>
            }
          </div>

          {/* OnHand */}
          <div style={S.row}>
            <span style={S.label}>OnHand</span>
            <input
              style={inputStyle('right')}
              type={editing ? 'number' : 'text'}
              min="0"
              value={art.stock ?? 0}
              onChange={e => setF('stock', parseInt(e.target.value) || 0)}
              readOnly={!editing}
            />
          </div>

          {/* OnOrder */}
          <div style={S.row}>
            <span style={S.label}>OnOrder</span>
            <input
              style={inputStyle('right')}
              type={editing ? 'number' : 'text'}
              min="0"
              value={art.onOrder ?? 0}
              onChange={e => setF('onOrder', parseInt(e.target.value) || 0)}
              readOnly={!editing}
            />
          </div>

          {/* Backordered */}
          <div style={S.row}>
            <span style={S.label}>Backordered</span>
            {editing
              ? <select style={{ ...S.select, maxWidth: 80 }} value={art.backordered} onChange={e => setF('backordered', e.target.value)}>
                  <option>No</option>
                  <option>Yes</option>
                </select>
              : <input style={{ ...S.inputRO, width: 80 }} readOnly value={art.backordered ?? 'No'} />
            }
          </div>

          {/* Cost */}
          <div style={{ ...S.row, alignItems: 'flex-start', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
              <span style={S.label}>Cost</span>
              <input
                style={{ ...inputStyle('right'), ...(errors.cost ? errStyle : {}) }}
                type={editing ? 'number' : 'text'}
                min="0" step="0.01"
                value={editing ? (art.cost ?? 0) : ((art.cost ?? 0).toFixed(2) + ' $')}
                onChange={e => { setF('cost', parseFloat(e.target.value) || 0); setErrors(ev => ({ ...ev, cost: undefined })); }}
                readOnly={!editing}
              />
            </div>
            {errors.cost && <span style={{ ...errMsg, marginLeft: 98 }}>{errors.cost}</span>}
          </div>

          {/* ListPrice */}
          <div style={{ ...S.row, alignItems: 'flex-start', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
              <span style={S.label}>ListPrice</span>
              <input
                style={{ ...inputStyle('right'), ...(errors.price ? errStyle : {}) }}
                type={editing ? 'number' : 'text'}
                min="0" step="0.01"
                value={editing ? (art.price ?? 0) : ((art.price ?? 0).toFixed(2) + ' $')}
                onChange={e => { setF('price', parseFloat(e.target.value) || 0); setErrors(ev => ({ ...ev, price: undefined })); }}
                readOnly={!editing}
              />
            </div>
            {errors.price && <span style={{ ...errMsg, marginLeft: 98 }}>{errors.price}</span>}
          </div>

          {/* Marge calculée */}
          {!editing && (
            <div style={{ textAlign: 'right', fontSize: 11, color: '#666', marginBottom: 8, marginTop: -4 }}>
              Marge : {art.cost > 0 ? (((art.price - art.cost) / art.price) * 100).toFixed(1) + '%' : '—'}
            </div>
          )}

          {/* ── Boutons OK / Cancel ── */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 10 }}>
            <button
              style={{ padding: '4px 0', width: 80, fontSize: 13, border: '2px solid #0a246a', borderRadius: 3, background: '#e8e8e8', cursor: 'pointer', fontFamily: 'inherit' }}
              onClick={handleOk}
            >
              <span style={{ textDecoration: 'underline' }}>O</span>K
            </button>
            <button
              style={{ padding: '4px 0', width: 80, fontSize: 13, border: '1px solid #888', borderRadius: 3, background: '#e8e8e8', cursor: 'pointer', fontFamily: 'inherit' }}
              onClick={handleCancel}
            >
              <span style={{ textDecoration: 'underline' }}>C</span>ancel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
