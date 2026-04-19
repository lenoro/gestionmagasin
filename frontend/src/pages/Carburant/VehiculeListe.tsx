import { useEffect, useState } from 'react'
import { vehiculeApi } from '../../api/carburantApi'
import type { TypeCarburant, Vehicule } from '../../types/carburant'

const TYPE_BADGE: Record<TypeCarburant, string> = {
  GASOIL: 'bg-gray-100 text-gray-800',
  ESSENCE: 'bg-blue-100 text-blue-800',
  GPL: 'bg-green-100 text-green-800',
}

const emptyForm = (): Vehicule => ({
  immatriculation: '', marque: '', modele: '',
  typeCarburant: 'GASOIL', chauffeurHabituel: '', observations: '',
})

export default function VehiculeListe() {
  const [vehicules, setVehicules] = useState<Vehicule[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Vehicule | null>(null)
  const [form, setForm] = useState<Vehicule>(emptyForm())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    vehiculeApi.findAll().then(setVehicules).catch(() => setError('Erreur chargement')).finally(() => setLoading(false))
  }, [])

  const openCreate = () => { setForm(emptyForm()); setEditing(null); setShowForm(true) }
  const openEdit = (v: Vehicule) => { setForm({ ...v }); setEditing(v); setShowForm(true) }
  const cancel = () => { setShowForm(false); setEditing(null) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editing?.id) {
        const updated = await vehiculeApi.update(editing.id, form)
        setVehicules(prev => prev.map(v => v.id === editing.id ? updated : v))
      } else {
        const created = await vehiculeApi.create(form)
        setVehicules(prev => [...prev, created])
      }
      setShowForm(false); setEditing(null)
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Erreur')
    }
  }

  if (loading) return <p className="p-6">Chargement…</p>
  if (error) return <p className="p-6 text-red-600">{error}</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Véhicules / Engins</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Nouveau véhicule
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 mb-6 grid grid-cols-2 gap-4">
          <h2 className="col-span-2 text-lg font-semibold text-gray-700">
            {editing ? 'Modifier le véhicule' : 'Nouveau véhicule'}
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Immatriculation *</label>
            <input value={form.immatriculation} onChange={e => setForm(f => ({ ...f, immatriculation: e.target.value }))}
              className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marque *</label>
            <input value={form.marque} onChange={e => setForm(f => ({ ...f, marque: e.target.value }))}
              className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
            <input value={form.modele ?? ''} onChange={e => setForm(f => ({ ...f, modele: e.target.value }))}
              className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type carburant *</label>
            <select value={form.typeCarburant} onChange={e => setForm(f => ({ ...f, typeCarburant: e.target.value as TypeCarburant }))}
              className="w-full border rounded px-3 py-2" required>
              <option value="GASOIL">GASOIL</option>
              <option value="ESSENCE">ESSENCE</option>
              <option value="GPL">GPL</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chauffeur habituel</label>
            <input value={form.chauffeurHabituel ?? ''} onChange={e => setForm(f => ({ ...f, chauffeurHabituel: e.target.value }))}
              className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observations</label>
            <input value={form.observations ?? ''} onChange={e => setForm(f => ({ ...f, observations: e.target.value }))}
              className="w-full border rounded px-3 py-2" />
          </div>
          <div className="col-span-2 flex gap-3">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              {editing ? 'Enregistrer' : 'Créer'}
            </button>
            <button type="button" onClick={cancel} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Immatriculation</th>
              <th className="px-4 py-2 text-left">Marque</th>
              <th className="px-4 py-2 text-left">Modèle</th>
              <th className="px-4 py-2 text-left">Type carburant</th>
              <th className="px-4 py-2 text-left">Chauffeur habituel</th>
              <th className="px-4 py-2 text-left">Statut</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {vehicules.map(v => (
              <tr key={v.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 font-mono">{v.immatriculation}</td>
                <td className="px-4 py-2">{v.marque}</td>
                <td className="px-4 py-2">{v.modele || '—'}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_BADGE[v.typeCarburant]}`}>
                    {v.typeCarburant}
                  </span>
                </td>
                <td className="px-4 py-2">{v.chauffeurHabituel || '—'}</td>
                <td className="px-4 py-2">
                  <span className={v.statut === 'ACTIF' ? 'text-green-700 font-medium' : 'text-red-500'}>
                    {v.statut}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button onClick={() => openEdit(v)} className="text-blue-600 hover:underline text-xs">
                    Modifier
                  </button>
                </td>
              </tr>
            ))}
            {vehicules.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-gray-400">Aucun véhicule</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
