import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { employeApi } from '../../api/stockApi'
import type { Employe } from '../../types/stock'

export default function EmployeListe() {
  const navigate = useNavigate()
  const [employes, setEmployes] = useState<Employe[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => employeApi.findAll().then(setEmployes).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cet employé ?')) return
    await employeApi.delete(id)
    load()
  }

  if (loading) return <p className="p-6">Chargement…</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Employés</h1>
        <button onClick={() => navigate('/employes/nouveau')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          + Nouvel employé
        </button>
      </div>
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Matricule</th>
              <th className="px-4 py-3 text-left">Nom & Prénom</th>
              <th className="px-4 py-3 text-left">Fonction</th>
              <th className="px-4 py-3 text-left">Service</th>
              <th className="px-4 py-3 text-left">Téléphone</th>
              <th className="px-4 py-3 text-left">Statut</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {employes.map(e => (
              <tr key={e.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-sm">{e.matricule || '—'}</td>
                <td className="px-4 py-3 font-medium">{e.nom} {e.prenom}</td>
                <td className="px-4 py-3 text-gray-600">{e.fonction || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{e.service || '—'}</td>
                <td className="px-4 py-3">{e.telephone || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${e.actif !== false ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {e.actif !== false ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => navigate(`/employes/${e.id}/edit`)}
                    className="text-blue-600 hover:underline text-xs">Modifier</button>
                  <button onClick={() => handleDelete(e.id!)}
                    className="text-red-600 hover:underline text-xs">Supprimer</button>
                </td>
              </tr>
            ))}
            {employes.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Aucun employé</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
