import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fonctionApi } from '../../api/stockApi'
import type { FonctionRef } from '../../types/stock'

export default function FonctionListe() {
  const [fonctions, setFonctions] = useState<FonctionRef[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    fonctionApi.findAll().then(data => { setFonctions(data); setLoading(false) }).catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id?: number) => {
    if (!id || !confirm('Supprimer cette fonction ?')) return
    await fonctionApi.delete(id)
    load()
  }

  if (loading) return <p className="text-gray-500">Chargement…</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Fonctions</h1>
        <Link to="/fonctions/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          + Nouvelle fonction
        </Link>
      </div>
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Libellé</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {fonctions.length === 0 && (
              <tr><td colSpan={2} className="px-4 py-6 text-center text-gray-400">Aucune fonction</td></tr>
            )}
            {fonctions.map(f => (
              <tr key={f.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{f.libelle}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Link to={`/fonctions/${f.id}`} className="text-blue-600 hover:underline">Modifier</Link>
                  <button onClick={() => handleDelete(f.id)} className="text-red-500 hover:underline">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
