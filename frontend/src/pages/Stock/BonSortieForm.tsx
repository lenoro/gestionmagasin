import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { bonSortieGSApi, employeApi, depotApi, produitApi } from '../../api/stockApi'
import type { Employe, Depot, Produit, BonSortieGS } from '../../types/stock'

export default function BonSortieForm() {
  const navigate = useNavigate()
  const [employes, setEmployes] = useState<Employe[]>([])
  const [depots, setDepots] = useState<Depot[]>([])
  const [produits, setProduits] = useState<Produit[]>([])

  const [employeId, setEmployeId] = useState<number | ''>('')
  const [depotId, setDepotId] = useState<number | ''>('')
  const [dateSortie, setDateSortie] = useState(new Date().toISOString().slice(0, 10))
  const [agentMagasin, setAgentMagasin] = useState('')
  const [motif, setMotif] = useState('')
  const [notes, setNotes] = useState('')
  const [lignes, setLignes] = useState<{ produitId: number | ''; quantiteDemandee: number }[]>([
    { produitId: '', quantiteDemandee: 1 }
  ])
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    Promise.all([employeApi.findActifs(), depotApi.findAll(), produitApi.findActifs()])
      .then(([e, d, p]) => { setEmployes(e); setDepots(d); setProduits(p) })
  }, [])

  const updateLigne = (idx: number, field: string, value: number | string) => {
    const updated = [...lignes]
    updated[idx] = { ...updated[idx], [field]: value }
    setLignes(updated)
    setErrors(p => ({ ...p, lignes: '' }))
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!dateSortie) errs.dateSortie = 'La date est obligatoire'
    const validLignes = lignes.filter(l => l.produitId !== '' && l.quantiteDemandee > 0)
    if (validLignes.length === 0) errs.lignes = 'Au moins un produit avec une quantité > 0 est requis'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      const validLignes = lignes.filter(l => l.produitId !== '' && l.quantiteDemandee > 0)
      const data = {
        dateSortie,
        employe: employeId ? { id: Number(employeId) } : undefined,
        depot: depotId ? { id: Number(depotId) } : undefined,
        agentMagasin,
        motif,
        notes,
        lignes: validLignes.map(l => ({
          produit: { id: Number(l.produitId) },
          quantiteDemandee: l.quantiteDemandee,
        })),
      }
      const created = await bonSortieGSApi.create(data as unknown as BonSortieGS)
      navigate(`/stock-sorties/${created.id}`)
    } catch {
      setErrors({ _global: 'Erreur lors de la sauvegarde' })
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Nouveau bon de sortie</h1>
      {errors._global && <p className="mb-4 text-red-600 bg-red-50 p-3 rounded">{errors._global}</p>}

      <div className="bg-white rounded shadow p-6 mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
          <input type="date" value={dateSortie}
            onChange={e => { setDateSortie(e.target.value); setErrors(p => ({ ...p, dateSortie: '' })) }}
            className={`w-full border rounded px-3 py-2 ${errors.dateSortie ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.dateSortie && <p className="text-red-500 text-xs mt-1">{errors.dateSortie}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Employé</label>
          <select value={employeId} onChange={e => setEmployeId(e.target.value ? Number(e.target.value) : '')}
            className="w-full border border-gray-300 rounded px-3 py-2">
            <option value="">— Aucun —</option>
            {employes.map(e => <option key={e.id} value={e.id}>{e.nom} {e.prenom}</option>)}
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Agent magasin</label>
          <input value={agentMagasin} onChange={e => setAgentMagasin(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Motif</label>
          <input value={motif} onChange={e => setMotif(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <input value={notes} onChange={e => setNotes(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2" />
        </div>
      </div>

      <div className={`bg-white rounded shadow p-6 mb-4 ${errors.lignes ? 'ring-1 ring-red-400' : ''}`}>
        <h2 className="font-semibold text-gray-700 mb-1">Produits demandés *</h2>
        {errors.lignes && <p className="text-red-500 text-xs mb-3">{errors.lignes}</p>}
        <table className="min-w-full text-sm mb-3">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-3 py-2 text-left">Produit</th>
              <th className="px-3 py-2 text-right">Qté demandée</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {lignes.map((l, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-3 py-2">
                  <select value={l.produitId}
                    onChange={e => updateLigne(idx, 'produitId', e.target.value ? Number(e.target.value) : '')}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm">
                    <option value="">— Produit —</option>
                    {produits.map(p => <option key={p.id} value={p.id}>{p.designation} (stock: {p.stockActuel ?? 0})</option>)}
                  </select>
                </td>
                <td className="px-3 py-2">
                  <input type="number" min="1" value={l.quantiteDemandee}
                    onChange={e => updateLigne(idx, 'quantiteDemandee', parseInt(e.target.value) || 1)}
                    className="w-20 border border-gray-300 rounded px-2 py-1 text-sm text-right" />
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
        <button type="button" onClick={() => setLignes(prev => [...prev, { produitId: '', quantiteDemandee: 1 }])}
          className="px-3 py-1.5 text-sm border border-blue-300 text-blue-600 rounded hover:bg-blue-50">
          + Ajouter une ligne
        </button>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
          {saving ? 'Enregistrement…' : 'Créer le bon'}
        </button>
        <button type="button" onClick={() => navigate('/stock-sorties')}
          className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50">Annuler</button>
      </div>
    </form>
  )
}
