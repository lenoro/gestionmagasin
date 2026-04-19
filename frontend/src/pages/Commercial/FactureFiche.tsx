import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { factureApi } from '../../api/commercialApi'
import type { Facture } from '../../types/commercial'

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <span className="font-medium text-gray-600 w-36 shrink-0">{label} :</span>
      <span className="text-gray-800">{children}</span>
    </div>
  )
}

export default function FactureFiche() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [facture, setFacture] = useState<Facture | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    factureApi.findById(Number(id)).then(setFacture).catch(() => setError('Facture introuvable')).finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="p-6">Chargement…</p>
  if (error || !facture) return <p className="p-6 text-red-600">{error || 'Introuvable'}</p>

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Facture {facture.invoiceNumber}</h1>
        <button onClick={() => navigate('/factures')}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">Retour</button>
      </div>

      <div className="bg-white rounded shadow p-6 space-y-3 text-sm mb-4">
        <Row label="Date">{facture.invoiceDate}</Row>
        <Row label="Client">{facture.client?.clientName}</Row>
        <Row label="Vendeur">{facture.vendeur?.vendorName || '—'}</Row>
        <Row label="Statut">
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {facture.status || 'ÉMISE'}
          </span>
        </Row>
      </div>

      {/* Lignes */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="font-semibold text-gray-700 mb-3">Articles facturés</h2>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-3 py-2 text-left">Article</th>
              <th className="px-3 py-2 text-right">Qté</th>
              <th className="px-3 py-2 text-right">Prix unit.</th>
              <th className="px-3 py-2 text-right">Total ligne</th>
            </tr>
          </thead>
          <tbody>
            {(facture.items ?? []).map((item, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-3 py-2">{item.article?.articleName || '—'}</td>
                <td className="px-3 py-2 text-right">{item.quantity}</td>
                <td className="px-3 py-2 text-right">{Number(item.unitPrice).toFixed(2)}</td>
                <td className="px-3 py-2 text-right font-medium">{Number(item.lineTotal).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2">
              <td colSpan={3} className="px-3 py-2 text-right font-semibold text-gray-700">Total</td>
              <td className="px-3 py-2 text-right font-bold text-blue-700 text-base">
                {Number(facture.totalAmount ?? 0).toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
