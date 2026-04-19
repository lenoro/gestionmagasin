import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { bonEntreeGSApi, fournisseurApi, depotApi, produitApi } from '../../api/stockApi'
import type { Fournisseur, Depot, Produit, BonEntreeGS } from '../../types/stock'

export default function BonEntreeForm() {
  const navigate = useNavigate()
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([])
  const [depots, setDepots] = useState<Depot[]>([])
  const [produits, setProduits] = useState<Produit[]>([])

  const [fournisseurId, setFournisseurId] = useState<number | ''>('')
  const [depotId, setDepotId] = useState<number | ''>('')
  const [dateEntree, setDateEntree] = useState(new Date().toISOString().slice(0, 10))
  const [numeroBL, setNumeroBL] = useState('')
  const [agentReception, setAgentReception] = useState('')
  const [notes, setNotes] = useState('')
  const [lignes, setLignes] = useState<{ produitId: number | ''; quantite: number; prixUnitaire: number }[]>([
    { produitId: '', quantite: 1, prixUnitaire: 0 }
  ])
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    Promise.all([fournisseurApi.findAll(), depotApi.findAll(), produitApi.findActifs()])
      .then(([f, d, p]) => { setFournisseurs(f); setDepots(d); setProduits(p) })
  }, [])

  const updateLigne = (idx: number, field: string, value: number | string) => {
    setLignes(prev => {
      const updated = [...prev]
      updated[idx] = { ...updated[idx], [field]: value }
      if (field === 'produitId') {
        const p = produits.find(x => x.id === Number(value))
        if (p) updated[idx].prixUnitaire = p.prixAchatMoyen ?? p.prixUnitaire ?? 0
      }
      return updated
    })
    setErrors(p => ({ ...p, lignes: '' }))
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!dateEntree) errs.dateEntree = 'La date est obligatoire'
    const validLignes = lignes.filter(l => l.produitId !== '' && l.quantite > 0)
    if (validLignes.length === 0) errs.lignes = 'Au moins un produit avec une quantité > 0 est requis'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      const validLignes = lignes.filter(l => l.produitId !== '' && l.quantite > 0)
      const data = {
        dateEntree,
        fournisseur: fournisseurId ? { id: Number(fournisseurId) } : undefined,
        depot: depotId ? { id: Number(depotId) } : undefined,
        numeroBLFournisseur: numeroBL,
        agentReception,
        notes,
        lignes: validLignes.map(l => ({
          produit: { id: Number(l.produitId) },
          quantite: l.quantite,
          prixUnitaire: l.prixUnitaire,
        })),
      }
      const created = await bonEntreeGSApi.create(data as unknown as BonEntreeGS)
      navigate(`/stock-entrees/${created.id}`)
    } catch {
      setErrors({ _global: 'Erreur lors de la sauvegarde' })
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Nouveau bon de réception</h1>
      {errors._global && <p className="mb-4 text-red-600 bg-red-50 p-3 rounded">{errors._global}</p>}

      <div className="bg-white rounded shadow p-6 mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
          <input type="date" value={dateEntree}
            onChange={e => { setDateEntree(e.target.value); setErrors(p => ({ ...p, dateEntree: '' })) }}
            className={`w-full border rounded px-3 py-2 ${errors.dateEntree ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.dateEntree && <p className="text-red-500 text-xs mt-1">{errors.dateEntree}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
          <select value={fournisseurId} onChange={e => setFournisseurId(e.target.value ? Number(e.target.value) : '')}
            className="w-full border border-gray-300 rounded px-3 py-2">
            <option value="">— Aucun —</option>
            {fournisseurs.map(f => <option key={f.id} value={f.id}>{f.raisonSociale}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dépôt</label>
          <select value={depotId} onChange={e => setDepotId(e.target.value ? Number(e.target.value) : '')}
            className="w-full border border-gray-300 rounded px-3 py-2">
            <option value="">— Aucun —</option>
            {depots.map(d => <option key={d.id} value={d.id}>{d.libelle}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">N° BL fournisseur</label>
          <input value={numeroBL} onChange={e => setNumeroBL(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Agent réception</label>
          <input value={agentReception} onChange={e => setAgentReception(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <input value={notes} onChange={e => setNotes(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2" />
        </div>
      </div>

      <div className={`bg-white rounded shadow p-6 mb-4 ${errors.lignes ? 'ring-1 ring-red-400' : ''}`}>
        <h2 className="font-semibold text-gray-700 mb-1">Produits reçus *</h2>
        {errors.lignes && <p className="text-red-500 text-xs mb-3">{errors.lignes}</p>}
        <table className="min-w-full text-sm mb-3">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-3 py-2 text-left">Produit</th>
              <th className="px-3 py-2 text-right">Qté</th>
              <th className="px-3 py-2 text-right">Prix unit.</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {lignes.map((l, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-3 py-2">
                  <select value={l.produitId} onChange={e => updateLigne(idx, 'produitId', e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm">
                    <option value="">— Produit —</option>
                    {produits.map(p => <option key={p.id} value={p.id}>{p.designation}</option>)}
                  </select>
                </td>
                <td className="px-3 py-2">
                  <input type="number" min="1" value={l.quantite}
                    onChange={e => updateLigne(idx, 'quantite', parseInt(e.target.value) || 1)}
                    className="w-20 border border-gray-300 rounded px-2 py-1 text-sm text-right" />
                </td>
                <td className="px-3 py-2">
                  <input type="number" step="0.01" min="0" value={l.prixUnitaire}
                    onChange={e => updateLigne(idx, 'prixUnitaire', parseFloat(e.target.value) || 0)}
                    className="w-28 border border-gray-300 rounded px-2 py-1 text-sm text-right" />
                </td>
                <td className="px-3 py-2">
                  {lignes.length > 1 && (
                    <button type="button" onClick={() => setLignes(prev => prev.filter((_, i) => i !== idx))}
                      className="text-red-500 hover:text-red-700 text-xs">✕</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" onClick={() => setLignes(prev => [...prev, { produitId: '', quantite: 1, prixUnitaire: 0 }])}
          className="px-3 py-1.5 text-sm border border-blue-300 text-blue-600 rounded hover:bg-blue-50">
          + Ajouter une ligne
        </button>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
          {saving ? 'Enregistrement…' : 'Créer le bon'}
        </button>
        <button type="button" onClick={() => navigate('/stock-entrees')}
          className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50">Annuler</button>
      </div>
    </form>
  )
}
