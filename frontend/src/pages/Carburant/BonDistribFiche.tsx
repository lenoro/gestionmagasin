import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { bonDistribApi } from '../../api/carburantApi'
import type { BonDistribution } from '../../types/carburant'

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <span className="font-medium text-gray-600 w-40 shrink-0">{label} :</span>
      <span className="text-gray-800">{children}</span>
    </div>
  )
}

export default function BonDistribFiche() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [bon, setBon] = useState<BonDistribution | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    bonDistribApi.findById(Number(id)).then(setBon).catch(() => setError('Bon introuvable')).finally(() => setLoading(false))
  }, [id])

  const imprimer = async () => {
    const blob = await bonDistribApi.imprimer(Number(id))
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `bon-distrib-${id}.pdf`; a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <p className="p-6">Chargement…</p>
  if (error || !bon) return <p className="p-6 text-red-600">{error || 'Introuvable'}</p>

  return (
    <div className="max-w-xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Bon {bon.numeroBon}</h1>
        <div className="flex gap-2">
          <button onClick={imprimer}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Imprimer PDF</button>
          <button onClick={() => navigate('/bons-distribution')}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">Retour</button>
        </div>
      </div>
      <div className="bg-white rounded shadow p-6 space-y-3 text-sm">
        <Row label="Date">{bon.dateBon}</Row>
        <Row label="Véhicule">{bon.vehicule.immatriculation} — {bon.vehicule.marque}</Row>
        <Row label="Type carburant">{bon.typeCarburant}</Row>
        <Row label="Quantité">{bon.quantiteLitres} L</Row>
        <Row label="Kilométrage">{bon.kilometrage ?? '—'}</Row>
        <Row label="Chauffeur">{bon.chauffeur || '—'}</Row>
        <Row label="Visa">{bon.visa || '—'}</Row>
        <Row label="Observations">{bon.observations || '—'}</Row>
        <Row label="Créé le">{bon.createdAt || '—'}</Row>
      </div>
    </div>
  )
}
