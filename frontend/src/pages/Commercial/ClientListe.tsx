import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clientApi } from '../../api/commercialApi'
import type { Client } from '../../types/commercial'

export default function ClientListe() {
  const navigate = useNavigate()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    clientApi.findAll().then(setClients).catch(() => setError('Erreur chargement')).finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="p-6">Chargement…</p>
  if (error) return <p className="p-6 text-red-600">{error}</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Clients</h1>
        <button onClick={() => navigate('/clients/nouveau')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Nouveau client</button>
      </div>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Code</th>
              <th className="px-4 py-2 text-left">Nom</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Téléphone</th>
              <th className="px-4 py-2 text-left">Adresse</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(c => (
              <tr key={c.id} className="border-t hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/clients/${c.id}/edit`)}>
                <td className="px-4 py-2 font-mono">{c.clientCode}</td>
                <td className="px-4 py-2 font-medium">{c.clientName}</td>
                <td className="px-4 py-2">{c.email || '—'}</td>
                <td className="px-4 py-2">{c.phone || '—'}</td>
                <td className="px-4 py-2">{c.address || '—'}</td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">Aucun client</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
