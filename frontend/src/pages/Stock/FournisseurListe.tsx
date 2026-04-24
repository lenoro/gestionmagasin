import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fournisseurApi } from '../../api/stockApi'
import type { Fournisseur } from '../../types/stock'

export default function FournisseurListe() {
  const navigate = useNavigate()
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const load = () => fournisseurApi.findAll().then(setFournisseurs).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const filtered = fournisseurs.filter(f => {
    const q = search.toLowerCase()
    return !q || f.raisonSociale.toLowerCase().includes(q) ||
      (f.code || '').toLowerCase().includes(q) ||
      (f.ville || '').toLowerCase().includes(q) ||
      (f.contactNom || '').toLowerCase().includes(q)
  })

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce fournisseur ?')) return
    await fournisseurApi.delete(id)
    load()
  }

  if (loading) return <p className="p-6">Chargement…</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Fournisseurs</h1>
        <button onClick={() => navigate('/fournisseurs/nouveau')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          + Nouveau fournisseur
        </button>
      </div>
      <div className="mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher par raison sociale, code, ville…"
          className="w-full max-w-sm border rounded px-3 py-2 text-sm" />
      </div>
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Raison sociale</th>
              <th className="px-4 py-3 text-left">Ville</th>
              <th className="px-4 py-3 text-left">Téléphone</th>
              <th className="px-4 py-3 text-left">Contact</th>
              <th className="px-4 py-3 text-left">Statut</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(f => (
              <tr key={f.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-sm">{f.code || '—'}</td>
                <td className="px-4 py-3 font-medium">{f.raisonSociale}</td>
                <td className="px-4 py-3 text-gray-600">{f.ville || '—'}</td>
                <td className="px-4 py-3">{f.telephone || '—'}</td>
                <td className="px-4 py-3">{f.contactNom || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${f.actif !== false ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {f.actif !== false ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => navigate(`/fournisseurs/${f.id}/edit`)}
                    className="text-blue-600 hover:underline text-xs">Modifier</button>
                  <button onClick={() => handleDelete(f.id!)}
                    className="text-red-600 hover:underline text-xs">Supprimer</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Aucun fournisseur</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
