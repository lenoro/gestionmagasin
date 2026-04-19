import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { bonApproApi } from '../../api/carburantApi'
import type { BonApprovisionnement } from '../../types/carburant'

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <span className="font-medium text-gray-600 w-40 shrink-0">{label} :</span>
      <span className="text-gray-800">{children}</span>
    </div>
  )
}

export default function BonApproFiche() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [bon, setBon] = useState<BonApprovisionnement | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    bonApproApi.findById(Number(id)).then(setBon).catch(() => setError('Bon introuvable')).finally(() => setLoading(false))
  }, [id])

  const handleValider = async () => {
    try { setBon(await bonApproApi.valider(Number(id))) }
    catch (e: unknown) { alert(e instanceof Error ? e.message : 'Erreur') }
  }

  const imprimer = async () => {
    const blob = await bonApproApi.imprimer(Number(id))
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `bon-appro-${id}.pdf`; a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <p className="p-6">Chargement…</p>
  if (error || !bon) return <p className="p-6 text-red-600">{error || 'Introuvable'}</p>

  const montant = (bon.quantiteLitres * bon.prixUnitaire).toFixed(2)

  return (
    <div className="max-w-xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Bon {bon.numeroBon}</h1>
        <div className="flex gap-2">
          {bon.statut === 'BROUILLON' && (
            <button onClick={handleValider}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Valider</button>
          )}
          <button onClick={imprimer}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Imprimer PDF</button>
          <button onClick={() => navigate('/bons-approvisionnement')}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">Retour</button>
        </div>
      </div>
      <div className="bg-white rounded shadow p-6 space-y-3 text-sm">
        <Row label="Statut">
          <span className={bon.statut === 'VALIDE' ? 'text-green-700 font-bold' : 'text-yellow-700 font-bold'}>
            {bon.statut}
          </span>
        </Row>
        <Row label="Date">{bon.dateBon}</Row>
        <Row label="Fournisseur">{bon.fournisseur.producerName}</Row>
        <Row label="Type carburant">{bon.typeCarburant}</Row>
        <Row label="Quantité">{bon.quantiteLitres} L</Row>
        <Row label="Prix unitaire">{bon.prixUnitaire} DA/L</Row>
        <Row label="Montant total">{montant} DA</Row>
        <Row label="Observations">{bon.observations || '—'}</Row>
        <Row label="Créé le">{bon.createdAt || '—'}</Row>
      </div>
    </div>
  )
}
