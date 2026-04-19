import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { factureApi } from '../../api/commercialApi'
import type { Facture } from '../../types/commercial'

export default function FactureListe() {
  const navigate = useNavigate()
  const [factures, setFactures] = useState<Facture[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    factureApi.findAll().then(setFactures).catch(() => setError('Erreur chargement')).finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="p-6">Chargement…</p>
  if (error) return <p className="p-6 text-red-600">{error}</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Factures</h1>
        <button onClick={() => navigate('/factures/nouveau')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Nouvelle facture</button>
      </div>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">N° Facture</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Client</th>
              <th className="px-4 py-2 text-left">Vendeur</th>
              <th className="px-4 py-2 text-right">Total</th>
              <th className="px-4 py-2 text-left">Statut</th>
            </tr>
          </thead>
          <tbody>
            {factures.map(f => (
              <tr key={f.id} className="border-t hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/factures/${f.id}`)}>
                <td className="px-4 py-2 font-mono font-medium">{f.invoiceNumber}</td>
                <td className="px-4 py-2">{f.invoiceDate}</td>
                <td className="px-4 py-2">{f.client?.clientName}</td>
                <td className="px-4 py-2">{f.vendeur?.vendorName || '—'}</td>
                <td className="px-4 py-2 text-right font-medium">{Number(f.totalAmount ?? 0).toFixed(2)}</td>
                <td className="px-4 py-2">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {f.status || 'ÉMISE'}
                  </span>
                </td>
              </tr>
            ))}
            {factures.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">Aucune facture</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
