import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { rsrApi } from '../../api/rsrApi'
import type { FicheReparation, StatutReparation } from '../../types/rsr'

const STATUT_COLOR: Record<StatutReparation, string> = {
  EN_ATTENTE: 'text-yellow-700',
  ENVOYE_ATELIER: 'text-blue-700',
  RETOURNE: 'text-purple-700',
  CLOS: 'text-green-700',
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <span className="font-medium text-gray-600 w-40 shrink-0">{label} :</span>
      <span className="text-gray-800">{children}</span>
    </div>
  )
}

export default function FicheReparationFiche() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [fiche, setFiche] = useState<FicheReparation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    rsrApi.findById(Number(id))
      .then(setFiche)
      .catch(() => setError('Fiche introuvable'))
      .finally(() => setLoading(false))
  }, [id])

  const handleWorkflow = async (action: 'envoyer' | 'retourner' | 'clore') => {
    try {
      const updated = await rsrApi[action](Number(id))
      setFiche(updated)
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Erreur')
    }
  }

  const imprimer = async () => {
    const blob = await rsrApi.imprimer(Number(id))
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `fiche-reparation-${id}.pdf`; a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <p className="p-6">Chargement…</p>
  if (error || !fiche) return <p className="p-6 text-red-600">{error || 'Fiche introuvable'}</p>

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Fiche {fiche.numeroFiche}</h1>
        <div className="flex gap-2">
          {fiche.statut === 'EN_ATTENTE' && (
            <button onClick={() => handleWorkflow('envoyer')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Envoyer à l'atelier
            </button>
          )}
          {fiche.statut === 'ENVOYE_ATELIER' && (
            <button onClick={() => handleWorkflow('retourner')}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
              Retour atelier
            </button>
          )}
          {fiche.statut === 'RETOURNE' && (
            <button onClick={() => handleWorkflow('clore')}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              Clore la fiche
            </button>
          )}
          <button onClick={imprimer}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Imprimer PDF
          </button>
          <button onClick={() => navigate('/fiches-reparation')}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
            Retour liste
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow p-6 space-y-3 text-sm">
        <Row label="Statut">
          <span className={`font-bold ${STATUT_COLOR[fiche.statut!]}`}>{fiche.statut}</span>
        </Row>
        <Row label="Bien inventaire">{fiche.bien.designation} ({fiche.bien.numeroInventaire})</Row>
        <Row label="Motif">{fiche.motif}</Row>
        <Row label="Réparateur">{fiche.reparateur || '—'}</Row>
        <Row label="Fournisseur">{fiche.fournisseur?.producerName || '—'}</Row>
        <Row label="Coût réparation">{fiche.coutReparation != null ? `${fiche.coutReparation} DA` : '—'}</Row>
        <Row label="Date envoi">{fiche.dateEnvoi || '—'}</Row>
        <Row label="Date retour">{fiche.dateRetour || '—'}</Row>
        <Row label="Date clôture">{fiche.dateCloture || '—'}</Row>
        <Row label="Observations">{fiche.observations || '—'}</Row>
        <Row label="Créé le">{fiche.createdAt || '—'}</Row>
      </div>

      {fiche.lignes.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Pièces de rechange</h2>
          <div className="bg-white rounded shadow overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Article</th>
                  <th className="px-4 py-2 text-left">Quantité</th>
                </tr>
              </thead>
              <tbody>
                {fiche.lignes.map((l, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-2">{l.article.designation} ({l.article.articleCode})</td>
                    <td className="px-4 py-2">{l.quantite}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
