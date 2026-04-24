import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { bonApproApi } from '../../api/carburantApi'
import type { BonApprovisionnement, TypeCarburant } from '../../types/carburant'

interface ProduitOption { id: number; producerName: string }

export default function BonApproForm() {
  const navigate = useNavigate()
  const [produits, setProduits] = useState<ProduitOption[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [fournisseurId, setFournisseurId] = useState<number | ''>('')
  const [dateBon, setDateBon] = useState(new Date().toISOString().slice(0, 10))
  const [typeCarburant, setTypeCarburant] = useState<TypeCarburant>('GASOIL')
  const [quantiteLitres, setQuantiteLitres] = useState('')
  const [prixUnitaire, setPrixUnitaire] = useState('')
  const [observations, setObservations] = useState('')

  useEffect(() => {
    axios.get<ProduitOption[]>('/api/produits').then(r => setProduits(r.data)).catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fournisseurId) { setError('Fournisseur obligatoire'); return }
    setSaving(true); setError('')
    try {
      const bon: BonApprovisionnement = {
        dateBon,
        fournisseur: produits.find(p => p.id === fournisseurId)!,
        typeCarburant,
        quantiteLitres: parseFloat(quantiteLitres),
        prixUnitaire: parseFloat(prixUnitaire),
        observations: observations || undefined,
      }
      const created = await bonApproApi.create(bon)
      navigate(`/bons-approvisionnement/${created.id}`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Nouveau bon d'approvisionnement</h1>
      {error && <p className="mb-4 text-red-600 bg-red-50 p-3 rounded">{error}</p>}
      <div className="bg-white rounded shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur *</label>
          <select value={fournisseurId} onChange={e => setFournisseurId(e.target.value ? Number(e.target.value) : '')}
            className="w-full border rounded px-3 py-2" required>
            <option value="">-- Sélectionner --</option>
            {produits.map(p => <option key={p.id} value={p.id}>{p.producerName}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
          <input type="date" value={dateBon} onChange={e => setDateBon(e.target.value)}
            className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type carburant *</label>
          <select value={typeCarburant} onChange={e => setTypeCarburant(e.target.value as TypeCarburant)}
            className="w-full border rounded px-3 py-2">
            <option value="GASOIL">GASOIL</option>
            <option value="ESSENCE">ESSENCE</option>
            <option value="GPL">GPL</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantité (litres) *</label>
          <input type="number" step="0.001" min="0.001" value={quantiteLitres}
            onChange={e => setQuantiteLitres(e.target.value)}
            className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prix unitaire (DA/L) *</label>
          <input type="number" step="0.01" min="0.01" value={prixUnitaire}
            onChange={e => setPrixUnitaire(e.target.value)}
            className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Observations</label>
          <textarea value={observations} onChange={e => setObservations(e.target.value)}
            rows={3} className="w-full border rounded px-3 py-2" />
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        <button type="submit" disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
        <button type="button" onClick={() => navigate('/bons-approvisionnement')}
          className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50">Annuler</button>
      </div>
    </form>
  )
}
