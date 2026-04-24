import { useEffect, useState } from 'react'
import axios from 'axios'

interface Producteur {
  id?: number
  producerCode: string
  producerName: string
  contactEmail?: string
  phone?: string
}

const empty: Producteur = { producerCode: '', producerName: '', contactEmail: '', phone: '' }

export default function ProducteurListe() {
  const [producteurs, setProducteurs] = useState<Producteur[]>([])
  const [form, setForm] = useState<Producteur>(empty)
  const [editing, setEditing] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')

  const load = () => axios.get('/api/producteurs').then(r => setProducteurs(r.data))
  useEffect(() => { load() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      if (editing !== null) {
        await axios.put(`/api/producteurs/${editing}`, form)
      } else {
        await axios.post('/api/producteurs', form)
      }
      setForm(empty); setEditing(null); setShowForm(false); load()
    } catch {
      setError('Erreur lors de la sauvegarde')
    }
  }

  const handleEdit = (p: Producteur) => {
    setForm(p); setEditing(p.id!); setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce producteur ?')) return
    await axios.delete(`/api/producteurs/${id}`)
    load()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Producteurs / Fournisseurs</h1>
        <button onClick={() => { setForm(empty); setEditing(null); setShowForm(true) }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          + Nouveau producteur
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded shadow p-5 mb-5 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
            <input required value={form.producerCode} onChange={e => setForm(f => ({ ...f, producerCode: e.target.value }))}
              className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input required value={form.producerName} onChange={e => setForm(f => ({ ...f, producerName: e.target.value }))}
              className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={form.contactEmail || ''} onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))}
              className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input value={form.phone || ''} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          {error && <p className="col-span-2 text-red-600 text-sm">{error}</p>}
          <div className="col-span-2 flex gap-2">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
              {editing !== null ? 'Modifier' : 'Créer'}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="px-4 py-2 border rounded hover:bg-gray-50 text-sm">Annuler</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Nom</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Téléphone</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {producteurs.map(p => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-mono">{p.producerCode}</td>
                <td className="px-4 py-3 font-medium">{p.producerName}</td>
                <td className="px-4 py-3 text-gray-600">{p.contactEmail || '—'}</td>
                <td className="px-4 py-3">{p.phone || '—'}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => handleEdit(p)} className="text-blue-600 hover:underline text-xs">Modifier</button>
                  <button onClick={() => handleDelete(p.id!)} className="text-red-600 hover:underline text-xs">Supprimer</button>
                </td>
              </tr>
            ))}
            {producteurs.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Aucun producteur</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
