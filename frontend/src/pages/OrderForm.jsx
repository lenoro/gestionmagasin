// src/pages/OrderForm.jsx
import { useState, useEffect } from 'react';
import { CLIENTS }  from '../data/clients';
import { ARTICLES } from '../data/articles';
import SelectAPart  from '../components/SelectAPart';
import { ClientAPI, ArticleAPI, FactureAPI } from '../data/api';

// ── Données de référence ──────────────────────────────────────────────
const VENDEURS    = ['Parker, Bill', 'Martin, Jean', 'Tremblay, Luc', 'Côté, Marie'];
const TERMES      = ['FOB', 'Net 30', 'Net 60', 'COD'];
const PAIEMENTS   = ['Credit', 'Cash', 'Chèque', 'Virement'];
const TRANSPORTEURS = ['UPS', 'FedEx', 'Purolator', 'Canada Post'];

const today = new Date().toLocaleDateString('fr-CA');

function normalizeFacture(f) {
  return {
    id:            f.id,
    clientId:      f.client?.clientCode || f.clientId || '',
    shipTo:        f.shipTo || '',
    invoiceDate:   f.invoiceDate || today,
    vendeur:       f.vendeur?.vendorName || f.vendeur || VENDEURS[0],
    termes:        f.termes  || TERMES[0],
    paiement:      f.paiement || PAIEMENTS[0],
    transporteur:  f.transporteur || TRANSPORTEURS[0],
    poNum:         f.invoiceNumber || f.poNum || '',
    taxRate:       f.taxRate ?? 4.50,
    freight:       f.freight ?? 0,
    paid:          f.paid ?? 0,
    items: (f.items || []).map(item => ({
      id:          item.id,
      articleCode: item.article?.articleCode || item.articleCode || '',
      articleName: item.article?.articleName || item.articleName || '',
      unitPrice:   item.unitPrice  ?? 0,
      quantity:    item.quantity   ?? 1,
      remise:      item.remise     ?? 0,
    })),
  };
}

function nouvelleCommande(id) {
  return {
    id,
    clientId: CLIENTS[0].id,
    shipTo: '',
    invoiceDate: today,
    vendeur: VENDEURS[0],
    termes: TERMES[0],
    paiement: PAIEMENTS[0],
    transporteur: TRANSPORTEURS[0],
    poNum: '',
    taxRate: 4.50,
    freight: 0,
    paid: 0,
    items: [],
  };
}

// Données initiales — simule un dataset Delphi
const COMMANDES_INIT = [
  { ...nouvelleCommande(1), clientId: 'C001', invoiceDate: '2026-01-15', poNum: 'PO-001',
    items: [
      { id: 1, articleCode: 'A001', articleName: 'Laptop Pro 15"', unitPrice: 1299.00, quantity: 1, remise: 0 },
      { id: 2, articleCode: 'A003', articleName: 'Clavier mécanique', unitPrice: 89.50, quantity: 2, remise: 5 },
    ],
    paid: 1306.25,
  },
  { ...nouvelleCommande(2), clientId: 'C002', invoiceDate: '2026-02-03', poNum: 'PO-002',
    items: [
      { id: 1, articleCode: 'A004', articleName: 'Écran 27" 4K', unitPrice: 549.00, quantity: 1, remise: 0 },
    ],
    paid: 0,
  },
  { ...nouvelleCommande(3), clientId: 'C003', invoiceDate: '2026-03-10', poNum: 'PO-003',
    items: [
      { id: 1, articleCode: 'A006', articleName: 'Casque audio BT', unitPrice: 149.00, quantity: 3, remise: 10 },
      { id: 2, articleCode: 'A007', articleName: 'Hub USB-C 7 ports', unitPrice: 45.00, quantity: 5, remise: 0  },
    ],
    paid: 500,
  },
];

function validateCommande(cmd) {
  const e = {};
  if (!cmd.clientId)              e.clientId    = 'Veuillez sélectionner un client.';
  if (!cmd.invoiceDate)           e.invoiceDate = 'La date est obligatoire.';
  if (!cmd.vendeur)               e.vendeur     = 'Veuillez sélectionner un vendeur.';
  if ((cmd.items || []).length === 0) e.items   = 'La commande doit contenir au moins un article.';
  (cmd.items || []).forEach((l, i) => {
    if (!l.articleCode)               e[`item_${i}_code`] = 'Article requis.';
    if (!l.quantity || l.quantity < 1) e[`item_${i}_qty`] = 'Qté ≥ 1.';
    if ((l.remise ?? 0) < 0 || (l.remise ?? 0) > 100) e[`item_${i}_remise`] = 'Remise 0–100%.';
  });
  return e;
}

function calcLigne(l) {
  const base = (l.unitPrice || 0) * (l.quantity || 0);
  return base - (base * (l.remise || 0) / 100);
}

function calcTotaux(cmd) {
  const subtotal = (cmd.items || []).reduce((s, l) => s + calcLigne(l), 0);
  const tax      = subtotal * cmd.taxRate / 100;
  const freight  = parseFloat(cmd.freight) || 0;
  const paid     = parseFloat(cmd.paid)    || 0;
  const due      = subtotal + tax + freight - paid;
  return { subtotal, tax, freight, paid, due };
}

// ── Styles inline partagés ────────────────────────────────────────────
const S = {
  label:   { fontSize: 11, color: '#555', marginBottom: 2, display: 'block' },
  input:   { padding: '3px 6px', fontSize: 13, border: '1px solid #aaa', borderRadius: 2, width: '100%', fontFamily: 'inherit', background: '#fff' },
  inputRO: { padding: '3px 6px', fontSize: 13, border: '1px solid #ccc', borderRadius: 2, width: '100%', fontFamily: 'inherit', background: '#f0f0f0', color: '#444' },
  select:  { padding: '3px 6px', fontSize: 13, border: '1px solid #aaa', borderRadius: 2, width: '100%', fontFamily: 'inherit', background: '#fff' },
  btn:     { padding: '4px 14px', fontSize: 13, border: '1px solid #888', borderRadius: 3, background: '#e8e8e8', cursor: 'pointer', fontFamily: 'inherit', minWidth: 90 },
  btnNav:  { width: 52, height: 48, fontSize: 18, border: '1px solid #aaa', background: '#e8e8e8', cursor: 'pointer', borderRadius: 2 },
  cell:    { padding: '3px 6px', fontSize: 13, borderBottom: '1px solid #ddd', verticalAlign: 'middle' },
};

export default function OrderForm({ navigate }) {
  const [commandes, setCommandes] = useState(COMMANDES_INIT);
  const [idx, setIdx]             = useState(0);           // index courant dans le dataset
  const [editing, setEditing]     = useState(false);
  const [draft, setDraft]         = useState(null);        // copie en cours d'édition
  const [nextLigneId, setNextLigneId]       = useState(10);
  const [selectPartLigneId, setSelectPartLigneId] = useState(null);
  const [apiClients,   setApiClients]   = useState(CLIENTS);
  const [apiArticles,  setApiArticles]  = useState(ARTICLES);
  const [saving,       setSaving]       = useState(false);
  const [loadError,    setLoadError]    = useState(null);
  const [errors,       setErrors]       = useState({});

  /* ── Chargement depuis le backend au montage ── */
  useEffect(() => {
    Promise.all([
      ClientAPI.getAll().catch(() => null),
      ArticleAPI.getAll().catch(() => null),
      FactureAPI.getAll().catch(() => null),
    ]).then(([clientsData, articlesData, facturesData]) => {
      if (clientsData)  setApiClients(clientsData);
      if (articlesData) setApiArticles(articlesData);
      if (facturesData && facturesData.length > 0) {
        setCommandes(facturesData.map(normalizeFacture));
        setIdx(0);
      }
    }).catch(() => setLoadError('Backend indisponible — données locales utilisées'));
  }, []);

  const cmd     = editing ? draft : commandes[idx];
  const client  = CLIENTS.find(c => c.id === cmd.clientId) || CLIENTS[0];
  const totaux  = calcTotaux(cmd);
  const status  = editing ? 'Edit' : 'Browsing';

  // ── Navigation dataset ──
  const goFirst = () => { if (!editing) setIdx(0); };
  const goPrev  = () => { if (!editing) setIdx(i => Math.max(0, i - 1)); };
  const goNext  = () => { if (!editing) setIdx(i => Math.min(commandes.length - 1, i + 1)); };
  const goLast  = () => { if (!editing) setIdx(commandes.length - 1); };

  // ── CRUD commande ──
  const startNew = () => {
    const newCmd = nouvelleCommande(Date.now());
    setDraft(newCmd);
    setEditing(true);
  };

  const startEdit = () => {
    setDraft(JSON.parse(JSON.stringify(commandes[idx])));
    setEditing(true);
  };

  const saveEdits = () => {
    if (!draft) return;
    const e = validateCommande(draft);
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setSaving(true);

    const facturePayload = {
      ...draft,
      client:  { id: draft.clientId },
      vendeur: apiClients.find(c => c.id === draft.clientId) ? { id: 1 } : null,
      items:   (draft.items || []).map(l => ({
        id:        l.id > 9 ? undefined : l.id,
        article:   { id: apiArticles.find(a => a.articleCode === l.articleCode)?.id },
        quantity:  parseInt(l.quantity)  || 1,
        unitPrice: parseFloat(l.unitPrice) || 0,
        lineTotal: (parseFloat(l.unitPrice) || 0) * (parseInt(l.quantity) || 1),
      })),
    };

    const isExisting = draft.id && commandes.find(c => c.id === draft.id);
    const apiCall = isExisting
      ? FactureAPI.update(draft.id, facturePayload)
      : FactureAPI.create(facturePayload);

    apiCall
      .then(saved => {
        if (isExisting) {
          setCommandes(prev => prev.map(c => c.id === draft.id ? { ...draft, ...saved } : c));
        } else {
          setCommandes(prev => {
            const updated = [...prev, { ...draft, id: saved.id || draft.id }];
            setIdx(updated.length - 1);
            return updated;
          });
        }
      })
      .catch(() => {
        // Fallback local
        if (isExisting) {
          setCommandes(prev => prev.map(c => c.id === draft.id ? draft : c));
        } else {
          setCommandes(prev => {
            const updated = [...prev, draft];
            setIdx(updated.length - 1);
            return updated;
          });
        }
      })
      .finally(() => {
        setSaving(false);
        setEditing(false);
        setDraft(null);
      });
  };

  const cancelEdits = () => { setEditing(false); setDraft(null); setErrors({}); };

  const deleteCmd = () => {
    if (!editing && window.confirm('Supprimer cette commande ?')) {
      setCommandes(prev => {
        const updated = prev.filter((_, i) => i !== idx);
        setIdx(Math.min(idx, updated.length - 1));
        return updated;
      });
    }
  };

  // ── Mise à jour champ commande ──
  const setField = (champ, val) => {
    if (!editing) startEdit();
    setDraft(prev => {
      const updated = { ...prev, [champ]: val };
      if (champ === 'clientId') {
        // reset shipTo si client change
        updated.shipTo = '';
      }
      return updated;
    });
  };

  // ── Lignes articles ──
  const ajouterLigne = () => {
    if (!editing) startEdit();
    const newId = nextLigneId;
    setDraft(prev => ({
      ...prev,
      items: [...(prev.items || []), { id: newId, articleCode: '', articleName: '', unitPrice: 0, quantity: 1, remise: 0 }],
    }));
    setNextLigneId(n => n + 1);
    setSelectPartLigneId(newId);
  };

  const updateLigne = (ligneId, champ, val) => {
    setDraft(prev => ({
      ...prev,
      items: (prev.items || []).map(l => {
        if (l.id !== ligneId) return l;
        return { ...l, [champ]: val };
      }),
    }));
  };

  const supprimerLigne = ligneId => {
    setDraft(prev => ({ ...prev, items: (prev.items || []).filter(l => l.id !== ligneId) }));
  };

  const pickPart = art => {
    setDraft(prev => ({
      ...prev,
      items: (prev.items || []).map(l =>
        l.id === selectPartLigneId
          ? { ...l, articleCode: art.articleCode, articleName: art.articleName, unitPrice: art.price }
          : l
      ),
    }));
    setSelectPartLigneId(null);
  };

  return (
    <div style={{ fontFamily: 'Tahoma, Arial, sans-serif', fontSize: 13, background: '#f0f0f0', minHeight: '100vh', padding: '1rem' }}>

      {/* ── Fenêtre principale style Delphi ── */}
      <div style={{ maxWidth: 716, margin: '0 auto', background: '#f0f0f0', border: '2px solid #888', borderRadius: 4, boxShadow: '3px 3px 8px rgba(0,0,0,0.3)' }}>

        {/* Barre de titre */}
        <div style={{ background: 'linear-gradient(to right, #0a246a, #a6b8d8)', padding: '3px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>Affectation</span>
          <div style={{ display: 'flex', gap: 2 }}>
            <button onClick={() => navigate('accueil')} style={{ width: 16, height: 14, fontSize: 10, background: '#c0c0c0', border: '1px solid #888', cursor: 'pointer', lineHeight: 1 }}>─</button>
            <button style={{ width: 16, height: 14, fontSize: 10, background: '#c0c0c0', border: '1px solid #888', cursor: 'pointer', lineHeight: 1 }}>□</button>
            <button onClick={() => navigate('accueil')} style={{ width: 16, height: 14, fontSize: 10, background: '#c0c0c0', border: '1px solid #888', cursor: 'pointer', lineHeight: 1, color: '#900', fontWeight: 700 }}>✕</button>
          </div>
        </div>

        <div style={{ padding: '8px 10px' }}>

          {/* ── Erreur backend ── */}
          {loadError && (
            <div style={{ padding: '4px 10px', background: '#faeeda', borderRadius: 3, marginBottom: 8, fontSize: 12, color: '#854f0b' }}>
              ⚠ {loadError}
            </div>
          )}
          {/* ── Erreurs de validation ── */}
          {Object.keys(errors).filter(k => !k.startsWith('item_')).length > 0 && (
            <div style={{ padding: '5px 10px', background: '#fff0f0', border: '1px solid #c00', borderRadius: 3, marginBottom: 8, fontSize: 12, color: '#c00' }}>
              {errors.clientId    && <div>• {errors.clientId}</div>}
              {errors.invoiceDate && <div>• {errors.invoiceDate}</div>}
              {errors.vendeur     && <div>• {errors.vendeur}</div>}
              {errors.items       && <div>• {errors.items}</div>}
            </div>
          )}

          {/* ── Barre d'outils / Navigator ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10, padding: '4px 6px', background: '#e8e8e8', border: '1px solid #ccc', borderRadius: 2 }}>
            <button style={S.btnNav} title="Nouveau"    onClick={startNew}>+</button>
            <button style={S.btnNav} title="Supprimer"  onClick={deleteCmd}>−</button>
            <button style={S.btnNav} title="Modifier"   onClick={startEdit}>▲</button>
            <button style={S.btnNav} title="Rafraîchir" onClick={cancelEdits}>↺</button>
            <div style={{ width: 1, height: 20, background: '#aaa', margin: '0 4px' }} />
            <button style={S.btnNav} title="Premier"    onClick={goFirst}>|◄</button>
            <button style={S.btnNav} title="Précédent"  onClick={goPrev}>◄</button>
            <button style={S.btnNav} title="Suivant"    onClick={goNext}>►</button>
            <button style={S.btnNav} title="Dernier"    onClick={goLast}>►|</button>
            <div style={{ width: 1, height: 20, background: '#aaa', margin: '0 4px' }} />
            <button style={S.btnNav}>🖨</button>
            <span style={{ marginLeft: 'auto', color: '#0000cc', fontSize: 12 }}>[Orders: {status}] {idx + 1}/{commandes.length}</span>
          </div>

          {/* ── Bill To / CustNo / Ship To / Date ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 80px 120px 36px', gap: 6, marginBottom: 6 }}>
            <div style={{ width: 180 }}>
              <span style={S.label}>Destinataire</span>
              <select style={{ ...S.select, ...(errors.clientId ? { border: '1px solid #c00', background: '#fff0f0' } : {}) }}
                value={cmd.clientId}
                onChange={e => { setField('clientId', e.target.value); setErrors(ev => ({ ...ev, clientId: undefined })); }}>
                {apiClients.map(c => <option key={c.id} value={c.id}>{c.clientName}</option>)}
              </select>
              {errors.clientId && <span style={{ fontSize: 11, color: '#c00' }}>{errors.clientId}</span>}
            </div>
            <div>
              <span style={S.label}>Clé</span>
              <input style={S.inputRO} readOnly value={cmd.clientId} />
            </div>
            <div>
              <span style={S.label}>Date</span>
              <input style={{ ...S.input, ...(errors.invoiceDate ? { border: '1px solid #c00', background: '#fff0f0' } : {}) }}
                type="date" value={cmd.invoiceDate}
                onChange={e => { setField('invoiceDate', e.target.value); setErrors(ev => ({ ...ev, invoiceDate: undefined })); }} />
              {errors.invoiceDate && <span style={{ fontSize: 11, color: '#c00' }}>{errors.invoiceDate}</span>}
            </div>
            <div style={{ paddingTop: 16 }}>
              <button style={{ ...S.btnNav, width: 30 }}>📅</button>
            </div>
          </div>

          {/* ── Adresse client (lecture seule, tirée du client sélectionné) ── */}
          <div style={{ marginBottom: 6 }}>
            <input style={S.inputRO} readOnly value={client.address} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 6 }}>
            <input style={S.inputRO} readOnly value={client.phone} />
            <input style={S.inputRO} readOnly value="" />
          </div>

          {/* ── SoldBy / Terms / Payment / ShipVia / PO# ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr', gap: 6, marginBottom: 8 }}>
            <div style={{ width: 180 }}>
              <span style={S.label}>Fait par</span>
              <select style={S.select} value={cmd.vendeur?.vendorName || cmd.vendeur || ''}
                onChange={e => setField('vendeur', e.target.value)}>
                {VENDEURS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {/* ── DBGrid lignes ── */}
          <div style={{ border: '2px inset #999', background: '#fff', marginBottom: 10 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#d4d0c8' }}>
                  <th style={{ width: 16, padding: '2px 4px', borderRight: '1px solid #aaa' }}></th>
                  <th style={{ padding: '2px 8px', textAlign: 'left', borderRight: '1px solid #aaa', fontWeight: 600 }}>N° article</th>
                  <th style={{ padding: '2px 8px', textAlign: 'left', borderRight: '1px solid #aaa', fontWeight: 600 }}>Description</th>
                  <th style={{ padding: '2px 8px', textAlign: 'right', borderRight: '1px solid #aaa', fontWeight: 600 }}>Prix U</th>
                  <th style={{ padding: '2px 8px', textAlign: 'center', borderRight: '1px solid #aaa', fontWeight: 600 }}>Qty</th>
                  <th style={{ display: 'none' }}>Discount</th>
                  <th style={{ padding: '2px 8px', textAlign: 'right', fontWeight: 600 }}>Total</th>
                  {editing && <th style={{ width: 24 }}></th>}
                </tr>
              </thead>
              <tbody>
                {(cmd.items || []).map((l, i) => (
                  <tr key={l.id} style={{ background: i % 2 === 0 ? '#fff' : '#f5f5f5' }}>
                    <td style={{ ...S.cell, textAlign: 'center', color: '#000', borderRight: '1px solid #eee' }}>▶</td>
                    <td style={{ ...S.cell, borderRight: '1px solid #eee' }}>
                      {editing
                        ? <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <input value={l.articleCode} onChange={e => { updateLigne(l.id, 'articleCode', e.target.value); setErrors(ev => ({ ...ev, [`item_${i}_code`]: undefined })); }}
                              style={{ ...S.input, width: 55, textAlign: 'center', fontWeight: 700, ...(errors[`item_${i}_code`] ? { border: '1px solid #c00', background: '#fff0f0' } : {}) }} />
                            <button
                              title="Sélectionner un article"
                              onClick={() => { if (!editing) startEdit(); setSelectPartLigneId(l.id); }}
                              style={{ width: 20, height: 20, fontSize: 11, border: '1px solid #aaa', background: '#e8e8e8', cursor: 'pointer', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                            >…</button>
                          </div>
                        : <strong style={{ cursor: 'pointer', color: '#0a246a' }}
                            onClick={() => { startEdit(); setSelectPartLigneId(l.id); }}>{l.articleCode || '—'}</strong>}
                    </td>
                    <td style={{ ...S.cell, borderRight: '1px solid #eee' }}>
                      {editing
                        ? <input value={l.articleName} onChange={e => updateLigne(l.id, 'articleName', e.target.value)}
                            style={{ ...S.input, width: '100%' }} />
                        : l.articleName}
                    </td>
                    <td style={{ ...S.cell, textAlign: 'right', borderRight: '1px solid #eee' }}>
                      {editing
                        ? <input type="number" value={l.unitPrice} onChange={e => updateLigne(l.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                            style={{ ...S.input, width: 80, textAlign: 'right' }} />
                        : (l.unitPrice || 0).toFixed(2) + ' $'}
                    </td>
                    <td style={{ ...S.cell, textAlign: 'center', borderRight: '1px solid #eee' }}>
                      {editing
                        ? <input type="number" min="1" value={l.quantity} onChange={e => { updateLigne(l.id, 'quantity', parseInt(e.target.value) || 1); setErrors(ev => ({ ...ev, [`item_${i}_qty`]: undefined })); }}
                            style={{ ...S.input, width: 50, textAlign: 'center', ...(errors[`item_${i}_qty`] ? { border: '1px solid #c00', background: '#fff0f0' } : {}) }} />
                        : l.quantity}
                    </td>
                    <td style={{ display: 'none' }}></td>
                    <td style={{ ...S.cell, textAlign: 'right', background: '#dbeafe', fontWeight: 600 }}>
                      {calcLigne(l).toFixed(2)} $
                    </td>
                    {editing && (
                      <td style={{ ...S.cell, textAlign: 'center' }}>
                        <button onClick={() => supprimerLigne(l.id)}
                          style={{ border: 'none', background: 'none', color: '#c00', cursor: 'pointer', fontSize: 14 }}>×</button>
                      </td>
                    )}
                  </tr>
                ))}
                {/* Ligne vide pour saisie */}
                {editing && (
                  <tr>
                    <td colSpan={editing ? 8 : 7} style={{ padding: '4px 8px' }}>
                      <button onClick={ajouterLigne}
                        style={{ fontSize: 12, border: '1px dashed #aaa', background: 'none', cursor: 'pointer', padding: '2px 10px', color: '#555' }}>
                        + Ajouter un article
                      </button>
                    </td>
                  </tr>
                )}
                {(cmd.items || []).length === 0 && !editing && (
                  <tr><td colSpan={7} style={{ padding: '12px', textAlign: 'center', color: '#999', fontStyle: 'italic' }}>Aucun article</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ── Bas : image + totaux + boutons ── */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>

            {/* Logo bateau SVG */}
            <div style={{ width: 80, height: 80, border: '1px solid #ccc', background: '#e8f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg viewBox="0 0 80 80" width="76" height="76">
                {/* Eau */}
                <ellipse cx="40" cy="68" rx="34" ry="8" fill="#1a6bb5" opacity="0.7"/>
                {/* Coque */}
                <path d="M12 58 Q40 72 68 58 L60 50 H20 Z" fill="#c0392b"/>
                <path d="M20 50 H60 L56 44 H24 Z" fill="#fff"/>
                {/* Mât */}
                <line x1="40" y1="44" x2="40" y2="10" stroke="#555" strokeWidth="2"/>
                {/* Voile principale */}
                <path d="M40 12 L40 42 L14 38 Z" fill="#fff" stroke="#aaa" strokeWidth="0.5"/>
                {/* Voile avant */}
                <path d="M40 14 L40 38 L60 32 Z" fill="#f0f0f0" stroke="#aaa" strokeWidth="0.5"/>
              </svg>
            </div>

            {/* Totaux */}
            <div style={{ flex: 1 }}>
              {/* Due — en gras */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2, justifyContent: 'flex-end', marginRight: 20 }}>
                <span style={{ fontSize: 13, fontWeight: 700, textAlign: 'right' }}>Total Général</span>
                <input readOnly value={totaux.due.toFixed(2) + ' $'}
                  style={{ ...S.inputRO, width: 110, textAlign: 'right', fontWeight: 700,
                    color: totaux.due > 0 ? '#c00' : '#060' }} />
              </div>
            </div>

            {/* Boutons action */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 4 }}>
              <button style={{ ...S.btn, opacity: editing && !saving ? 1 : 0.5 }} onClick={saveEdits} disabled={!editing || saving}>{saving ? '⏳...' : 'Sauvegarder'}</button>
              <button style={{ ...S.btn, opacity: editing ? 1 : 0.5 }} onClick={cancelEdits} disabled={!editing}>Annuler</button>
              <button style={S.btn} onClick={() => navigate('accueil')}>Fermer</button>
            </div>
          </div>

        </div>{/* fin padding */}
      </div>{/* fin fenêtre */}
      {/* Modal Select a Part */}
      {selectPartLigneId !== null && (
        <SelectAPart
          onSelect={pickPart}
          onClose={() => setSelectPartLigneId(null)}
        />
      )}
    </div>
  );
}
