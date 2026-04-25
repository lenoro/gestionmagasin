import { useEffect, useState } from 'react'
import axios from 'axios'

interface Stagiaire {
  id?: number
  numInscription: string
  nomPrenom: string
  groupeSection: string
  dateDebutFormation?: string
  dateFinFormation?: string
  kitRemis?: boolean
  dateRemiseTrousseau?: string
  cautionVersee?: boolean
  etatRetour?: string
  observations?: string
}

const empty: Stagiaire = {
  numInscription: '', nomPrenom: '', groupeSection: '',
  kitRemis: false, cautionVersee: false
}

const etatColors: Record<string, string> = {
  COMPLET: 'bg-green-100 text-green-700',
  MANQUANT: 'bg-red-100 text-red-700',
  DEGRADE: 'bg-orange-100 text-orange-700',
}

export default function StagiaireListe() {
  const [liste, setListe] = useState<Stagiaire[]>([])
  const [form, setForm] = useState<Stagiaire>(empty)
  const [editing, setEditing] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const load = () => axios.get('/api/stagiaires').then(r => setListe(r.data))
  useEffect(() => { load() }, [])

  const filtered = liste.filter(s =>
    s.nomPrenom.toLowerCase().includes(search.toLowerCase()) ||
    s.numInscription.toLowerCase().includes(search.toLowerCase()) ||
    (s.groupeSection || '').toLowerCase().includes(search.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      if (editing !== null) {
        await axios.put(`/api/stagiaires/${editing}`, form)
      } else {
        await axios.post('/api/stagiaires', form)
      }
      setForm(empty); setEditing(null); setShowForm(false); load()
    } catch {
      setError('Erreur lors de la sauvegarde')
    }
  }

  const handleEdit = (s: Stagiaire) => {
    setForm(s); setEditing(s.id!); setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce stagiaire ?')) return
    await axios.delete(`/api/stagiaires/${id}`)
    load()
  }

  function f(field: keyof Stagiaire, value: unknown) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Stagiaires</h1>
        <button onClick={() => { setForm(empty); setEditing(null); setShowForm(true) }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          + Nouveau stagiaire
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded shadow p-5 mb-5 grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">N° Inscription *</label>
            <input required value={form.numInscription} onChange={e => f('numInscription', e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Nom & Prénom *</label>
            <input required value={form.nomPrenom} onChange={e => f('nomPrenom', e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Groupe / Section</label>
            <input value={form.groupeSection} onChange={e => f('groupeSection', e.target.value)}
              placeholder="Ex: Électricité G1" className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Début formation</label>
            <input type="date" value={form.dateDebutFormation || ''} onChange={e => f('dateDebutFormation', e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fin formation</label>
            <input type="date" value={form.dateFinFormation || ''} onChange={e => f('dateFinFormation', e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div className="flex items-center gap-4 col-span-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.kitRemis || false} onChange={e => f('kitRemis', e.target.checked)} />
              Kit remis
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.cautionVersee || false} onChange={e => f('cautionVersee', e.target.checked)} />
              Caution versée
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">État retour</label>
            <select value={form.etatRetour || ''} onChange={e => f('etatRetour', e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm">
              <option value="">—</option>
              <option value="COMPLET">Complet</option>
              <option value="MANQUANT">Manquant</option>
              <option value="DEGRADE">Dégradé</option>
            </select>
          </div>
          {error && <p className="col-span-3 text-red-600 text-sm">{error}</p>}
          <div className="col-span-3 flex gap-2">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded text-sm">
              {editing !== null ? 'Modifier' : 'Créer'}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="px-4 py-2 border rounded text-sm">Annuler</button>
          </div>
        </form>
      )}

      <div className="mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher par nom, numéro ou groupe..."
          className="border rounded px-3 py-2 text-sm w-80" />
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">N° Inscription</th>
              <th className="px-4 py-3 text-left">Nom & Prénom</th>
              <th className="px-4 py-3 text-left">Groupe</th>
              <th className="px-4 py-3 text-left">Début</th>
              <th className="px-4 py-3 text-center">Kit</th>
              <th className="px-4 py-3 text-left">Retour</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs">{s.numInscription}</td>
                <td className="px-4 py-3 font-medium">{s.nomPrenom}</td>
                <td className="px-4 py-3">{s.groupeSection || '—'}</td>
                <td className="px-4 py-3">{s.dateDebutFormation || '—'}</td>
                <td className="px-4 py-3 text-center">
                  {s.kitRemis
                    ? <span className="text-green-600 font-bold">Oui</span>
                    : <span className="text-gray-400">Non</span>}
                </td>
                <td className="px-4 py-3">
                  {s.etatRetour ? (
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${etatColors[s.etatRetour] || 'bg-gray-100 text-gray-600'}`}>
                      {s.etatRetour}
                    </span>
                  ) : '—'}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => handleEdit(s)} className="text-blue-600 hover:underline text-xs">Modifier</button>
                  <button onClick={() => handleDelete(s.id!)} className="text-red-600 hover:underline text-xs">Supprimer</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Aucun stagiaire</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
