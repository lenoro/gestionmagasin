import { useEffect, useState } from 'react'
import axios from 'axios'
import type { Consommateur, TypeConsommateur } from '../../types/rgbi'

const empty: Consommateur = { nomPrenom: '', serviceAtelier: '', typeConsommateur: 'ENSEIGNANT', telephone: '' }

const typeLabel: Record<TypeConsommateur, string> = {
  ENSEIGNANT: 'Enseignant',
  STAGIAIRE: 'Stagiaire',
  ADMINISTRATION: 'Administration',
}

export default function ConsommateurListe() {
  const [liste, setListe] = useState<Consommateur[]>([])
  const [form, setForm] = useState<Consommateur>(empty)
  const [editing, setEditing] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')

  const load = () => axios.get('/api/consommateurs').then(r => setListe(r.data))
  useEffect(() => { load() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      if (editing !== null) {
        await axios.put(`/api/consommateurs/${editing}`, form)
      } else {
        await axios.post('/api/consommateurs', form)
      }
      setForm(empty); setEditing(null); setShowForm(false); load()
    } catch {
      setError('Erreur lors de la sauvegarde')
    }
  }

  const handleEdit = (c: Consommateur) => {
    setForm(c); setEditing(c.id!); setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Désactiver ce demandeur ?')) return
    await axios.delete(`/api/consommateurs/${id}`)
    load()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Demandeurs / Consommateurs</h1>
        <button onClick={() => { setForm(empty); setEditing(null); setShowForm(true) }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          + Nouveau
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded shadow p-5 mb-5 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom & Prénom *</label>
            <input required value={form.nomPrenom} onChange={e => setForm(f => ({ ...f, nomPrenom: e.target.value }))}
              className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service / Atelier</label>
            <input value={form.serviceAtelier || ''} onChange={e => setForm(f => ({ ...f, serviceAtelier: e.target.value }))}
              placeholder="Ex: Atelier Soudure" className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
            <select required value={form.typeConsommateur}
              onChange={e => setForm(f => ({ ...f, typeConsommateur: e.target.value as TypeConsommateur }))}
              className="w-full border rounded px-3 py-2 text-sm">
              <option value="ENSEIGNANT">Enseignant</option>
              <option value="STAGIAIRE">Stagiaire</option>
              <option value="ADMINISTRATION">Administration</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input value={form.telephone || ''} onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))}
              className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          {error && <p className="col-span-2 text-red-600 text-sm">{error}</p>}
          <div className="col-span-2 flex gap-2">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded text-sm">
              {editing !== null ? 'Modifier' : 'Créer'}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="px-4 py-2 border rounded text-sm">Annuler</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Nom & Prénom</th>
              <th className="px-4 py-3 text-left">Service / Atelier</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Téléphone</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {liste.map(c => (
              <tr key={c.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{c.nomPrenom}</td>
                <td className="px-4 py-3">{c.serviceAtelier || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    c.typeConsommateur === 'ENSEIGNANT' ? 'bg-blue-100 text-blue-700' :
                    c.typeConsommateur === 'STAGIAIRE' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'}`}>
                    {typeLabel[c.typeConsommateur]}
                  </span>
                </td>
                <td className="px-4 py-3">{c.telephone || '—'}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => handleEdit(c)} className="text-blue-600 hover:underline text-xs">Modifier</button>
                  <button onClick={() => handleDelete(c.id!)} className="text-red-600 hover:underline text-xs">Supprimer</button>
                </td>
              </tr>
            ))}
            {liste.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Aucun demandeur</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
