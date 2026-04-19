import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { bonDistribApi, vehiculeApi } from '../../api/carburantApi'
import type { BonDistribution, TypeCarburant, Vehicule } from '../../types/carburant'

export default function BonDistribForm() {
  const navigate = useNavigate()
  const [vehicules, setVehicules] = useState<Vehicule[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [vehiculeId, setVehiculeId] = useState<number | ''>('')
  const [dateBon, setDateBon] = useState(new Date().toISOString().slice(0, 10))
  const [typeCarburant, setTypeCarburant] = useState<TypeCarburant>('GASOIL')
  const [quantiteLitres, setQuantiteLitres] = useState('')
  const [kilometrage, setKilometrage] = useState('')
  const [chauffeur, setChauffeur] = useState('')
  const [visa, setVisa] = useState('')
  const [observations, setObservations] = useState('')

  useEffect(() => {
    vehiculeApi.findAll().then(v => setVehicules(v.filter(x => x.statut === 'ACTIF'))).catch(() => {})
  }, [])

  const handleVehiculeChange = (id: number | '') => {
    setVehiculeId(id)
    if (id) {
      const v = vehicules.find(x => x.id === id)
      if (v) setTypeCarburant(v.typeCarburant)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vehiculeId) { setError('Véhicule obligatoire'); return }
    setSaving(true); setError('')
    try {
      const bon: BonDistribution = {
        dateBon,
        vehicule: vehicules.find(v => v.id === vehiculeId) as { id: number; immatriculation: string; marque: string; typeCarburant: TypeCarburant },
        typeCarburant,
        quantiteLitres: parseFloat(quantiteLitres),
        kilometrage: kilometrage ? parseInt(kilometrage) : null,
        chauffeur: chauffeur || undefined,
        visa: visa || undefined,
        observations: observations || undefined,
      }
      const created = await bonDistribApi.create(bon)
      navigate(`/bons-distribution/${created.id}`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Nouveau bon de distribution</h1>
      {error && <p className="mb-4 text-red-600 bg-red-50 p-3 rounded">{error}</p>}
      <div className="bg-white rounded shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Véhicule *</label>
          <select value={vehiculeId} onChange={e => handleVehiculeChange(e.target.value ? Number(e.target.value) : '')}
            className="w-full border rounded px-3 py-2" required>
            <option value="">-- Sélectionner --</option>
            {vehicules.map(v => (
              <option key={v.id} value={v.id}>{v.immatriculation} — {v.marque} ({v.typeCarburant})</option>
            ))}
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Kilométrage compteur</label>
          <input type="number" min="0" value={kilometrage}
            onChange={e => setKilometrage(e.target.value)}
            className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Chauffeur</label>
          <input type="text" value={chauffeur} onChange={e => setChauffeur(e.target.value)}
            className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Visa responsable</label>
          <input type="text" value={visa} onChange={e => setVisa(e.target.value)}
            className="w-full border rounded px-3 py-2" />
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
        <button type="button" onClick={() => navigate('/bons-distribution')}
          className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50">Annuler</button>
      </div>
    </form>
  )
}
