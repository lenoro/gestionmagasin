import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { bonEntreeGSApi } from '../../api/stockApi'
import type { BonEntreeGS } from '../../types/stock'

const statutColor: Record<string, string> = {
  BROUILLON: 'bg-yellow-100 text-yellow-800',
  VALIDE: 'bg-green-100 text-green-800',
  ANNULE: 'bg-red-100 text-red-800',
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <span className="font-medium text-gray-600 w-40 shrink-0">{label} :</span>
      <span className="text-gray-800">{children}</span>
    </div>
  )
}

export default function BonEntreeFiche() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [bon, setBon] = useState<BonEntreeGS | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = () => bonEntreeGSApi.findById(Number(id)).then(setBon).catch(() => setError('Bon introuvable')).finally(() => setLoading(false))
  useEffect(() => { load() }, [id])

  const handleValider = async () => {
    if (!confirm('Valider ce bon ? Le stock sera mis à jour.')) return
    await bonEntreeGSApi.valider(Number(id))
    load()
  }

  const handleAnnuler = async () => {
    if (!confirm('Annuler ce bon ?')) return
    await bonEntreeGSApi.annuler(Number(id))
    load()
  }

  if (loading) return <p className="p-6">Chargement…</p>
  if (error || !bon) return <p className="p-6 text-red-600">{error || 'Introuvable'}</p>

  const statut = bon.statut || 'BROUILLON'

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Bon de réception {bon.numero}</h1>
        <div className="flex gap-2">
          {statut === 'BROUILLON' && (
            <>
              <button onClick={handleValider}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">Valider</button>
              <button onClick={handleAnnuler}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm">Annuler</button>
            </>
          )}
          <button onClick={() => navigate('/stock-entrees')}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm">Retour</button>
        </div>
      </div>

      <div className="bg-white rounded shadow p-6 space-y-3 text-sm mb-4">
        <Row label="Date">{bon.dateEntree}</Row>
        <Row label="Fournisseur">{bon.fournisseur?.raisonSociale || '—'}</Row>
        <Row label="Dépôt">{bon.depot?.libelle || '—'}</Row>
        <Row label="N° BL fournisseur">{bon.numeroBLFournisseur || '—'}</Row>
        <Row label="Agent réception">{bon.agentReception || '—'}</Row>
        <Row label="Notes">{bon.notes || '—'}</Row>
        <Row label="Statut">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statutColor[statut] || ''}`}>{statut}</span>
        </Row>
      </div>

      <div className="bg-white rounded shadow p-6">
        <h2 className="font-semibold text-gray-700 mb-3">Articles reçus</h2>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-3 py-2 text-left">Produit</th>
              <th className="px-3 py-2 text-right">Quantité</th>
              <th className="px-3 py-2 text-right">Prix unitaire</th>
              <th className="px-3 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {(bon.lignes ?? []).map((l, i) => (
              <tr key={i} className="border-t">
                <td className="px-3 py-2">{l.produit?.designation || '—'}</td>
                <td className="px-3 py-2 text-right">{l.quantite}</td>
                <td className="px-3 py-2 text-right">{l.prixUnitaire?.toFixed(2) ?? '—'}</td>
                <td className="px-3 py-2 text-right font-medium">
                  {((l.quantite ?? 0) * (l.prixUnitaire ?? 0)).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
