// src/pages/Approvisionnement.jsx
import { useState, useEffect } from 'react';
import { ApproAPI, ArticleAPI, ProducteurAPI } from '../data/api';

const STATUT_LABEL = { EN_ATTENTE: '⏳ En attente', RECU: '✅ Reçu' };
const STATUT_COLOR = { EN_ATTENTE: '#b45309', RECU: '#166534' };
const STATUT_BG    = { EN_ATTENTE: '#fef3c7', RECU: '#dcfce7' };

export default function Approvisionnement({ navigate }) {
  const [appros,      setAppros]      = useState([]);
  const [articles,    setArticles]    = useState([]);
  const [producteurs, setProducteurs] = useState([]);
  const [showForm,    setShowForm]    = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [msg,         setMsg]         = useState(null);

  const [form, setForm] = useState({
    dateAppro: new Date().toISOString().slice(0, 10),
    reference: '',
    producteur: null,
    notes: '',
    items: [{ article: null, quantite: 1, prixAchat: 0 }],
  });

  useEffect(() => {
    ApproAPI.getAll().then(setAppros).catch(console.error);
    ArticleAPI.getAll().then(setArticles).catch(console.error);
    ProducteurAPI.getAll().then(setProducteurs).catch(console.error);
  }, []);

  const reload = () => ApproAPI.getAll().then(setAppros);

  const addLigne = () =>
    setForm(f => ({ ...f, items: [...f.items, { article: null, quantite: 1, prixAchat: 0 }] }));

  const removeLigne = (i) =>
    setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));

  const updateLigne = (i, field, value) =>
    setForm(f => {
      const items = [...f.items];
      items[i] = { ...items[i], [field]: value };
      return { ...f, items };
    });

  const handleSave = async () => {
    if (form.items.some(it => !it.article)) { setMsg({ type: 'error', text: 'Sélectionnez un article pour chaque ligne.' }); return; }
    setSaving(true);
    try {
      const payload = {
        dateAppro:   form.dateAppro,
        reference:   form.reference,
        notes:       form.notes,
        statut:      'EN_ATTENTE',
        producteur:  form.producteur ? { id: parseInt(form.producteur) } : null,
        items:       form.items.map(it => ({
          article:   { id: parseInt(it.article) },
          quantite:  parseInt(it.quantite),
          prixAchat: parseFloat(it.prixAchat) || 0,
        })),
      };
      await ApproAPI.create(payload);
      setMsg({ type: 'ok', text: 'Approvisionnement créé.' });
      setShowForm(false);
      setForm({ dateAppro: new Date().toISOString().slice(0,10), reference:'', producteur:null, notes:'', items:[{article:null,quantite:1,prixAchat:0}] });
      reload();
    } catch (e) {
      setMsg({ type: 'error', text: 'Erreur lors de la sauvegarde.' });
    }
    setSaving(false);
  };

  const handleValider = async (id) => {
    if (!window.confirm('Valider cet approvisionnement ? Le stock sera mis à jour.')) return;
    try {
      await ApproAPI.valider(id);
      setMsg({ type: 'ok', text: 'Stock mis à jour avec succès !' });
      reload();
    } catch (e) {
      setMsg({ type: 'error', text: 'Erreur lors de la validation.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet approvisionnement ?')) return;
    await ApproAPI.delete(id);
    reload();
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px', fontFamily: 'inherit' }}>
      {/* En-tête */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ margin:0, fontSize:18, fontWeight:700 }}>📦 Approvisionnements</h2>
          <p style={{ margin:'4px 0 0', fontSize:12, color:'#888' }}>Gestion des entrées de stock</p>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={() => setShowForm(s => !s)} style={btnStyle('#0a246a')}>
            {showForm ? '✕ Annuler' : '+ Nouveau'}
          </button>
          <button onClick={() => navigate('accueil')} style={btnStyle('#666')}>Fermer</button>
        </div>
      </div>

      {/* Message */}
      {msg && (
        <div style={{ padding:'8px 14px', borderRadius:6, marginBottom:12,
          background: msg.type==='ok' ? '#dcfce7' : '#fee2e2',
          color:      msg.type==='ok' ? '#166534' : '#991b1b', fontSize:13 }}>
          {msg.text}
          <button onClick={() => setMsg(null)} style={{ marginLeft:10, background:'none', border:'none', cursor:'pointer', fontSize:13 }}>✕</button>
        </div>
      )}

      {/* Formulaire nouveau approvisionnement */}
      {showForm && (
        <div style={{ background:'#f8f9fa', border:'1px solid #ddd', borderRadius:8, padding:16, marginBottom:20 }}>
          <h3 style={{ margin:'0 0 12px', fontSize:14, fontWeight:600 }}>Nouvel approvisionnement</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:12 }}>
            <div>
              <label style={labelStyle}>Date</label>
              <input type="date" value={form.dateAppro}
                onChange={e => setForm(f=>({...f, dateAppro:e.target.value}))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Référence</label>
              <input value={form.reference} onChange={e => setForm(f=>({...f, reference:e.target.value}))}
                placeholder="N° bon de commande" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Fournisseur</label>
              <select value={form.producteur || ''} onChange={e => setForm(f=>({...f, producteur:e.target.value}))} style={inputStyle}>
                <option value="">-- Choisir --</option>
                {producteurs.map(p => <option key={p.id} value={p.id}>{p.producerName}</option>)}
              </select>
            </div>
          </div>

          {/* Lignes articles */}
          <table style={{ width:'100%', borderCollapse:'collapse', marginBottom:10, fontSize:13 }}>
            <thead>
              <tr style={{ background:'#e9ecef' }}>
                <th style={th}>Article</th>
                <th style={th}>Quantité</th>
                <th style={th}>Prix achat</th>
                <th style={th}></th>
              </tr>
            </thead>
            <tbody>
              {form.items.map((it, i) => (
                <tr key={i}>
                  <td style={td}>
                    <select value={it.article || ''} onChange={e => updateLigne(i,'article',e.target.value)} style={{ ...inputStyle, margin:0 }}>
                      <option value="">-- Article --</option>
                      {articles.map(a => <option key={a.id} value={a.id}>{a.articleCode} — {a.articleName}</option>)}
                    </select>
                  </td>
                  <td style={td}>
                    <input type="number" min="1" value={it.quantite}
                      onChange={e => updateLigne(i,'quantite',e.target.value)} style={{ ...inputStyle, margin:0, width:80 }} />
                  </td>
                  <td style={td}>
                    <input type="number" min="0" step="0.01" value={it.prixAchat}
                      onChange={e => updateLigne(i,'prixAchat',e.target.value)} style={{ ...inputStyle, margin:0, width:100 }} />
                  </td>
                  <td style={td}>
                    {form.items.length > 1 &&
                      <button onClick={() => removeLigne(i)} style={{ ...btnStyle('#dc2626'), padding:'2px 8px', fontSize:12 }}>✕</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={addLigne} style={{ ...btnStyle('#475569'), fontSize:12 }}>+ Ligne</button>
            <button onClick={handleSave} disabled={saving} style={btnStyle('#166534')}>
              {saving ? 'Sauvegarde...' : '💾 Sauvegarder'}
            </button>
          </div>
        </div>
      )}

      {/* Liste des approvisionnements */}
      <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
        <thead>
          <tr style={{ background:'#f1f3f5' }}>
            <th style={th}>Date</th>
            <th style={th}>Référence</th>
            <th style={th}>Fournisseur</th>
            <th style={th}>Nb articles</th>
            <th style={th}>Statut</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appros.length === 0 && (
            <tr><td colSpan={6} style={{ textAlign:'center', color:'#888', padding:20 }}>Aucun approvisionnement</td></tr>
          )}
          {appros.map(a => (
            <tr key={a.id} style={{ borderBottom:'1px solid #eee' }}>
              <td style={td}>{a.dateAppro}</td>
              <td style={td}>{a.reference || '—'}</td>
              <td style={td}>{a.producteur?.producerName || '—'}</td>
              <td style={{ ...td, textAlign:'center' }}>{a.items?.length || 0}</td>
              <td style={td}>
                <span style={{ padding:'2px 8px', borderRadius:12, fontSize:11,
                  background: STATUT_BG[a.statut] || '#f3f4f6',
                  color:      STATUT_COLOR[a.statut] || '#374151' }}>
                  {STATUT_LABEL[a.statut] || a.statut}
                </span>
              </td>
              <td style={{ ...td, display:'flex', gap:4 }}>
                {a.statut === 'EN_ATTENTE' && (
                  <button onClick={() => handleValider(a.id)} style={{ ...btnStyle('#166534'), padding:'3px 10px', fontSize:11 }}>
                    ✅ Valider stock
                  </button>
                )}
                <button onClick={() => handleDelete(a.id)} style={{ ...btnStyle('#dc2626'), padding:'3px 10px', fontSize:11 }}>
                  🗑
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const btnStyle = (bg) => ({
  background: bg, color:'#fff', border:'none', borderRadius:5,
  padding:'6px 14px', cursor:'pointer', fontSize:13, fontWeight:500,
});
const labelStyle = { display:'block', fontSize:11, color:'#555', marginBottom:3 };
const inputStyle  = { width:'100%', padding:'5px 8px', border:'1px solid #ccc', borderRadius:4, fontSize:13, boxSizing:'border-box' };
const th = { padding:'7px 10px', textAlign:'left', fontWeight:600, fontSize:12 };
const td = { padding:'7px 10px' };
