// src/pages/Retours.jsx
import { useState, useEffect } from 'react';
import { RetourAPI, FactureAPI, ArticleAPI } from '../data/api';

const STATUT_LABEL = { EN_ATTENTE:'⏳ En attente', ACCEPTE:'✅ Accepté', REFUSE:'❌ Refusé' };
const STATUT_COLOR = { EN_ATTENTE:'#b45309', ACCEPTE:'#166534', REFUSE:'#991b1b' };
const STATUT_BG    = { EN_ATTENTE:'#fef3c7', ACCEPTE:'#dcfce7',  REFUSE:'#fee2e2' };

export default function Retours({ navigate }) {
  const [retours,   setRetours]   = useState([]);
  const [factures,  setFactures]  = useState([]);
  const [articles,  setArticles]  = useState([]);
  const [showForm,  setShowForm]  = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [msg,       setMsg]       = useState(null);

  const [form, setForm] = useState({
    facture: '',
    dateRetour: new Date().toISOString().slice(0, 10),
    motif: '',
    items: [{ article: null, quantite: 1, prixUnitaire: 0 }],
  });

  useEffect(() => {
    RetourAPI.getAll().then(setRetours).catch(console.error);
    FactureAPI.getAll().then(setFactures).catch(console.error);
    ArticleAPI.getAll().then(setArticles).catch(console.error);
  }, []);

  const reload = () => RetourAPI.getAll().then(setRetours);

  const addLigne = () =>
    setForm(f => ({ ...f, items: [...f.items, { article: null, quantite: 1, prixUnitaire: 0 }] }));

  const removeLigne = (i) =>
    setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));

  const updateLigne = (i, field, value) =>
    setForm(f => {
      const items = [...f.items];
      items[i] = { ...items[i], [field]: value };
      return { ...f, items };
    });

  const handleSave = async () => {
    if (form.items.some(it => !it.article)) { setMsg({ type:'error', text:'Sélectionnez un article pour chaque ligne.' }); return; }
    setSaving(true);
    try {
      const payload = {
        dateRetour: form.dateRetour,
        motif:      form.motif,
        statut:     'EN_ATTENTE',
        facture:    form.facture ? { id: parseInt(form.facture) } : null,
        items:      form.items.map(it => ({
          article:      { id: parseInt(it.article) },
          quantite:     parseInt(it.quantite),
          prixUnitaire: parseFloat(it.prixUnitaire) || 0,
        })),
      };
      await RetourAPI.create(payload);
      setMsg({ type:'ok', text:'Retour enregistré.' });
      setShowForm(false);
      setForm({ facture:'', dateRetour:new Date().toISOString().slice(0,10), motif:'', items:[{article:null,quantite:1,prixUnitaire:0}] });
      reload();
    } catch (e) {
      setMsg({ type:'error', text:'Erreur lors de la sauvegarde.' });
    }
    setSaving(false);
  };

  const handleAccepter = async (id) => {
    if (!window.confirm('Accepter ce retour ? Le stock sera recrédité.')) return;
    try {
      await RetourAPI.accepter(id);
      setMsg({ type:'ok', text:'Retour accepté, stock mis à jour !' });
      reload();
    } catch (e) {
      setMsg({ type:'error', text:'Erreur lors de l\'acceptation.' });
    }
  };

  const handleRefuser = async (id) => {
    if (!window.confirm('Refuser ce retour ?')) return;
    try {
      await RetourAPI.refuser(id);
      setMsg({ type:'ok', text:'Retour refusé.' });
      reload();
    } catch (e) {
      setMsg({ type:'error', text:'Erreur.' });
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px', fontFamily: 'inherit' }}>
      {/* En-tête */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <div>
          <h2 style={{ margin:0, fontSize:18, fontWeight:700 }}>↩️ Retours clients</h2>
          <p style={{ margin:'4px 0 0', fontSize:12, color:'#888' }}>Gestion des retours d'articles</p>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={() => setShowForm(s => !s)} style={btnStyle('#0a246a')}>
            {showForm ? '✕ Annuler' : '+ Nouveau retour'}
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

      {/* Formulaire */}
      {showForm && (
        <div style={{ background:'#f8f9fa', border:'1px solid #ddd', borderRadius:8, padding:16, marginBottom:20 }}>
          <h3 style={{ margin:'0 0 12px', fontSize:14, fontWeight:600 }}>Nouveau retour</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:12 }}>
            <div>
              <label style={labelStyle}>Facture d'origine</label>
              <select value={form.facture} onChange={e => setForm(f=>({...f, facture:e.target.value}))} style={inputStyle}>
                <option value="">-- Choisir (optionnel) --</option>
                {factures.map(f => <option key={f.id} value={f.id}>{f.invoiceNumber}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Date du retour</label>
              <input type="date" value={form.dateRetour}
                onChange={e => setForm(f=>({...f, dateRetour:e.target.value}))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Motif</label>
              <input value={form.motif} onChange={e => setForm(f=>({...f, motif:e.target.value}))}
                placeholder="Raison du retour" style={inputStyle} />
            </div>
          </div>

          {/* Lignes */}
          <table style={{ width:'100%', borderCollapse:'collapse', marginBottom:10, fontSize:13 }}>
            <thead>
              <tr style={{ background:'#e9ecef' }}>
                <th style={th}>Article</th>
                <th style={th}>Quantité</th>
                <th style={th}>Prix unitaire</th>
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
                    <input type="number" min="0" step="0.01" value={it.prixUnitaire}
                      onChange={e => updateLigne(i,'prixUnitaire',e.target.value)} style={{ ...inputStyle, margin:0, width:100 }} />
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

      {/* Liste */}
      <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
        <thead>
          <tr style={{ background:'#f1f3f5' }}>
            <th style={th}>Date</th>
            <th style={th}>Facture</th>
            <th style={th}>Motif</th>
            <th style={th}>Articles</th>
            <th style={th}>Statut</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {retours.length === 0 && (
            <tr><td colSpan={6} style={{ textAlign:'center', color:'#888', padding:20 }}>Aucun retour enregistré</td></tr>
          )}
          {retours.map(r => (
            <tr key={r.id} style={{ borderBottom:'1px solid #eee' }}>
              <td style={td}>{r.dateRetour}</td>
              <td style={td}>{r.facture?.invoiceNumber || '—'}</td>
              <td style={td}>{r.motif || '—'}</td>
              <td style={{ ...td, textAlign:'center' }}>{r.items?.length || 0}</td>
              <td style={td}>
                <span style={{ padding:'2px 8px', borderRadius:12, fontSize:11,
                  background: STATUT_BG[r.statut] || '#f3f4f6',
                  color:      STATUT_COLOR[r.statut] || '#374151' }}>
                  {STATUT_LABEL[r.statut] || r.statut}
                </span>
              </td>
              <td style={{ ...td, display:'flex', gap:4 }}>
                {r.statut === 'EN_ATTENTE' && (<>
                  <button onClick={() => handleAccepter(r.id)} style={{ ...btnStyle('#166534'), padding:'3px 10px', fontSize:11 }}>✅ Accepter</button>
                  <button onClick={() => handleRefuser(r.id)}  style={{ ...btnStyle('#dc2626'), padding:'3px 10px', fontSize:11 }}>❌ Refuser</button>
                </>)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const btnStyle = (bg) => ({
  background:bg, color:'#fff', border:'none', borderRadius:5,
  padding:'6px 14px', cursor:'pointer', fontSize:13, fontWeight:500,
});
const labelStyle = { display:'block', fontSize:11, color:'#555', marginBottom:3 };
const inputStyle  = { width:'100%', padding:'5px 8px', border:'1px solid #ccc', borderRadius:4, fontSize:13, boxSizing:'border-box' };
const th = { padding:'7px 10px', textAlign:'left', fontWeight:600, fontSize:12 };
const td = { padding:'7px 10px' };
