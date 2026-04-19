import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ouvrageApi } from '../../api/bibliothequeApi'
import type { Ouvrage } from '../../types/bibliotheque'
import { DOMAINE_BADGE } from '../../types/bibliotheque'

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <span className="font-medium text-gray-600 w-44 shrink-0">{label} :</span>
      <span className="text-gray-800">{children}</span>
    </div>
  )
}

export default function OuvrageFiche() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [ouvrage, setOuvrage] = useState<Ouvrage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    ouvrageApi.findById(Number(id)).then(setOuvrage).catch(() => setError('Ouvrage introuvable')).finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="p-6">Chargement…</p>
  if (error || !ouvrage) return <p className="p-6 text-red-600">{error || 'Introuvable'}</p>

  return (
    <div className="max-w-xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{ouvrage.titre}</h1>
        <div className="flex gap-2">
          <button onClick={() => navigate(`/ouvrages/${id}/edit`)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Modifier</button>
          <button onClick={() => navigate('/ouvrages')}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">Retour</button>
        </div>
      </div>
      <div className="bg-white rounded shadow p-6 space-y-3 text-sm">
        <Row label="N° Ouvrage"><span className="font-mono">{ouvrage.numeroOuvrage}</span></Row>
        <Row label="Domaine">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${DOMAINE_BADGE[ouvrage.domaine]}`}>
            {ouvrage.domaine}
          </span>
        </Row>
        <Row label="Auteur">{ouvrage.auteur}</Row>
        <Row label="ISBN">{ouvrage.isbn || '—'}</Row>
        <Row label="Éditeur">{ouvrage.editeur || '—'}</Row>
        <Row label="Année">{ouvrage.anneePublication || '—'}</Row>
        <Row label="Localisation">{ouvrage.localisation || '—'}</Row>
        <Row label="Nb exemplaires">{ouvrage.nbreExemplaires}</Row>
        <Row label="Enregistré le">{ouvrage.createdAt || '—'}</Row>
      </div>
    </div>
  )
}
