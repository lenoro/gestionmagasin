import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { vendeurApi } from '../../api/commercialApi'
import type { Vendeur } from '../../types/commercial'

export default function VendeurListe() {
  const navigate = useNavigate()
  const [vendeurs, setVendeurs] = useState<Vendeur[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    vendeurApi.findAll().then(setVendeurs).catch(() => setError('Erreur chargement')).finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="p-6">Chargement…</p>
  if (error) return <p className="p-6 text-red-600">{error}</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Vendeurs</h1>
        <button onClick={() => navigate('/vendeurs/nouveau')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Nouveau vendeur</button>
      </div>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Code</th>
              <th className="px-4 py-2 text-left">Nom</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Téléphone</th>
            </tr>
          </thead>
          <tbody>
            {vendeurs.map(v => (
              <tr key={v.id} className="border-t hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/vendeurs/${v.id}/edit`)}>
                <td className="px-4 py-2 font-mono">{v.vendorCode}</td>
                <td className="px-4 py-2 font-medium">{v.vendorName}</td>
                <td className="px-4 py-2">{v.contactEmail || '—'}</td>
                <td className="px-4 py-2">{v.phone || '—'}</td>
              </tr>
            ))}
            {vendeurs.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-gray-400">Aucun vendeur</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
