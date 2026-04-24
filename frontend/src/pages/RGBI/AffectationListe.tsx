import { useEffect, useState } from 'react'
import axios from 'axios'

interface Affectation {
  id?: number
  code: string
  libelle: string
}

export default function AffectationListe() {
  const [affectations, setAffectations] = useState<Affectation[]>([])
  const [form, setForm] = useState({ code: '', libelle: '' })
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')

  const load = () => axios.get('/api/affectations').then(r => setAffectations(r.data))
  useEffect(() => { load() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await axios.post('/api/affectations', form)
      setForm({ code: '', libelle: '' }); setShowForm(false); load()
    } catch {
      setError('Code déjà existant ou erreur de sauvegarde')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Affectations / Services</h1>
        <button onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          + Nouvelle affectation
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded shadow p-5 mb-5 flex gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
            <input required value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
              placeholder="Ex: DIR, RH, INFO" className="border rounded px-3 py-2 text-sm w-32" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Libellé *</label>
            <input required value={form.libelle} onChange={e => setForm(f => ({ ...f, libelle: e.target.value }))}
              placeholder="Ex: Direction Générale" className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">Créer</button>
          <button type="button" onClick={() => setShowForm(false)}
            className="px-4 py-2 border rounded hover:bg-gray-50 text-sm">Annuler</button>
        </form>
      )}

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Libellé</th>
            </tr>
          </thead>
          <tbody>
            {affectations.map(a => (
              <tr key={a.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-mono font-medium">{a.code}</td>
                <td className="px-4 py-3">{a.libelle}</td>
              </tr>
            ))}
            {affectations.length === 0 && (
              <tr><td colSpan={2} className="px-4 py-8 text-center text-gray-400">Aucune affectation</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
