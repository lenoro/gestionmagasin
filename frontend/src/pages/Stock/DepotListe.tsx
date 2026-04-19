import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { depotApi } from '../../api/stockApi'
import type { Depot } from '../../types/stock'

export default function DepotListe() {
  const navigate = useNavigate()
  const [depots, setDepots] = useState<Depot[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => depotApi.findAll().then(setDepots).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce dépôt ?')) return
    await depotApi.delete(id)
    load()
  }

  if (loading) return <p className="p-6">Chargement…</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Dépôts</h1>
        <button onClick={() => navigate('/depots/nouveau')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          + Nouveau dépôt
        </button>
      </div>
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Libellé</th>
              <th className="px-4 py-3 text-left">Adresse</th>
              <th className="px-4 py-3 text-left">Responsable</th>
              <th className="px-4 py-3 text-left">Statut</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {depots.map(d => (
              <tr key={d.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-sm">{d.code || '—'}</td>
                <td className="px-4 py-3 font-medium">{d.libelle}</td>
                <td className="px-4 py-3 text-gray-500">{d.adresse || '—'}</td>
                <td className="px-4 py-3">{d.responsable || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${d.actif !== false ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {d.actif !== false ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => navigate(`/depots/${d.id}/edit`)}
                    className="text-blue-600 hover:underline text-xs">Modifier</button>
                  <button onClick={() => handleDelete(d.id!)}
                    className="text-red-600 hover:underline text-xs">Supprimer</button>
                </td>
              </tr>
            ))}
            {depots.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Aucun dépôt</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
