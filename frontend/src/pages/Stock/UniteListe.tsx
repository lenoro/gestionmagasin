import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { uniteApi } from '../../api/stockApi'
import type { Unite } from '../../types/stock'

export default function UniteListe() {
  const navigate = useNavigate()
  const [unites, setUnites] = useState<Unite[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => uniteApi.findAll().then(setUnites).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette unité ?')) return
    await uniteApi.delete(id)
    load()
  }

  if (loading) return <p className="p-6">Chargement…</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Unités de mesure</h1>
        <button onClick={() => navigate('/unites/nouveau')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          + Nouvelle unité
        </button>
      </div>
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Libellé</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {unites.map(u => (
              <tr key={u.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-sm">{u.code}</td>
                <td className="px-4 py-3 font-medium">{u.libelle}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => navigate(`/unites/${u.id}/edit`)}
                    className="text-blue-600 hover:underline text-xs">Modifier</button>
                  <button onClick={() => handleDelete(u.id!)}
                    className="text-red-600 hover:underline text-xs">Supprimer</button>
                </td>
              </tr>
            ))}
            {unites.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-400">Aucune unité</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
