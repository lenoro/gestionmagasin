import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { gradeApi } from '../../api/stockApi'
import type { Grade } from '../../types/stock'

export default function GradeListe() {
  const [grades, setGrades] = useState<Grade[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    gradeApi.findAll().then(data => { setGrades(data); setLoading(false) }).catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id?: number) => {
    if (!id || !confirm('Supprimer ce grade ?')) return
    await gradeApi.delete(id)
    load()
  }

  if (loading) return <p className="text-gray-500">Chargement…</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Grades</h1>
        <Link to="/grades/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          + Nouveau grade
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
            {grades.length === 0 && (
              <tr><td colSpan={2} className="px-4 py-6 text-center text-gray-400">Aucun grade</td></tr>
            )}
            {grades.map(g => (
              <tr key={g.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{g.libelle}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Link to={`/grades/${g.id}`} className="text-blue-600 hover:underline">Modifier</Link>
                  <button onClick={() => handleDelete(g.id)} className="text-red-500 hover:underline">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
