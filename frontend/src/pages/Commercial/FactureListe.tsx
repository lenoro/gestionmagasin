import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { factureApi } from '../../api/commercialApi'
import type { Facture } from '../../types/commercial'

const STATUT_FR: Record<string, string> = {
  PAID: 'PAYÉ', UNPAID: 'IMPAYÉ', EMISE: 'ÉMISE', ÉMISE: 'ÉMISE', ANNULEE: 'ANNULÉE',
}
const STATUT_COLORS: Record<string, string> = {
  PAID: 'bg-green-100 text-green-800',
  PAYÉ: 'bg-green-100 text-green-800',
  UNPAID: 'bg-orange-100 text-orange-800',
  IMPAYÉ: 'bg-orange-100 text-orange-800',
  ÉMISE: 'bg-blue-100 text-blue-800',
  EMISE: 'bg-blue-100 text-blue-800',
  ANNULÉE: 'bg-red-100 text-red-800',
}

function statutFr(s: string | undefined): string {
  if (!s) return 'ÉMISE'
  return STATUT_FR[s.toUpperCase()] ?? s
}

export default function FactureListe() {
  const navigate = useNavigate()
  const [factures, setFactures] = useState<Facture[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    factureApi.findAll()
      .then(data => {
        const unique = Array.from(new Map(data.map(f => [f.id, f])).values())
        setFactures(unique)
      })
      .catch(() => setError('Erreur chargement'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = factures.filter(f => {
    const q = search.toLowerCase()
    return !q || (f.invoiceNumber || '').toLowerCase().includes(q) ||
      (f.client?.clientName || '').toLowerCase().includes(q) ||
      (f.vendeur?.vendorName || '').toLowerCase().includes(q)
  })

  if (loading) return <p className="p-6">Chargement…</p>
  if (error) return <p className="p-6 text-red-600">{error}</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Factures</h1>
        <button onClick={() => navigate('/factures/nouveau')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Nouvelle facture</button>
      </div>
      <div className="mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher par numéro, client, vendeur…"
          className="w-full max-w-sm border rounded px-3 py-2 text-sm" />
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
            {filtered.map(f => (
              <tr key={f.id} className="border-t hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/factures/${f.id}`)}>
                <td className="px-4 py-2 font-mono font-medium">{f.invoiceNumber}</td>
                <td className="px-4 py-2">{f.invoiceDate}</td>
                <td className="px-4 py-2">{f.client?.clientName}</td>
                <td className="px-4 py-2">{f.vendeur?.vendorName || '—'}</td>
                <td className="px-4 py-2 text-right font-medium">{Number(f.totalAmount ?? 0).toFixed(2)}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUT_COLORS[f.status?.toUpperCase() ?? ''] ?? 'bg-blue-100 text-blue-800'}`}>
                    {statutFr(f.status)}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">Aucune facture</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
