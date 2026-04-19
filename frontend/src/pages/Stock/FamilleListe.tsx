import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { familleApi } from '../../api/stockApi'
import type { Famille } from '../../types/stock'

export default function FamilleListe() {
  const navigate = useNavigate()
  const [familles, setFamilles] = useState<Famille[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => familleApi.findAll().then(setFamilles).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette famille ?')) return
    await familleApi.delete(id)
    load()
  }

  if (loading) return <p className="p-6">Chargement…</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Familles d'articles</h1>
        <button onClick={() => navigate('/familles/nouveau')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          + Nouvelle famille
        </button>
      </div>
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Libellé</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {familles.map(f => (
              <tr key={f.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-sm">{f.code}</td>
                <td className="px-4 py-3 font-medium">{f.libelle}</td>
                <td className="px-4 py-3 text-gray-500">{f.description || '—'}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => navigate(`/familles/${f.id}/edit`)}
                    className="text-blue-600 hover:underline text-xs">Modifier</button>
                  <button onClick={() => handleDelete(f.id!)}
                    className="text-red-600 hover:underline text-xs">Supprimer</button>
                </td>
              </tr>
            ))}
            {familles.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">Aucune famille</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
