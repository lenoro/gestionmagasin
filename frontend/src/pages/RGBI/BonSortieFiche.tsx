import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { bonSortieApi } from '../../api/rgbiApi'
import type { BonSortie } from '../../types/rgbi'
import ApprouverDialog from '../../components/RGBI/ApprouverDialog'
import RejeterDialog from '../../components/RGBI/RejeterDialog'

const STATUT_COLORS: Record<string, string> = {
  EN_ATTENTE: 'text-yellow-700', APPROUVE: 'text-blue-700',
  TRAITE: 'text-green-700', REJETE: 'text-red-700'
}

export default function BonSortieFiche() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [bon, setBon] = useState<BonSortie | null>(null)
  const [showApprouver, setShowApprouver] = useState(false)
  const [showRejeter, setShowRejeter] = useState(false)

  function load() { bonSortieApi.findById(Number(id)).then(setBon) }
  useEffect(() => { load() }, [id])

  if (!bon) return <p>Chargement...</p>

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Bon de sortie</h1>
          <p className="text-gray-500 font-mono">{bon.numeroBon}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => bonSortieApi.imprimer(Number(id))}
            className="border px-4 py-2 rounded hover:bg-gray-50">Imprimer</button>
          {bon.statut === 'EN_ATTENTE' && (<>
            <button onClick={() => setShowApprouver(true)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Approuver</button>
            <button onClick={() => setShowRejeter(true)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Rejeter</button>
          </>)}
        </div>
      </div>

      <div className="bg-white shadow rounded p-6 grid grid-cols-2 gap-4 text-sm">
        <div><span className="font-medium">Type :</span> {bon.typeBon.replace('_', ' ')}</div>
        <div><span className="font-medium">Date :</span> {bon.dateBon}</div>
        <div><span className="font-medium">Service :</span> {bon.serviceDestination?.libelle ?? '—'}</div>
        <div><span className={`font-medium ${STATUT_COLORS[bon.statut!]}`}>Statut : {bon.statut}</span></div>
        <div><span className="font-medium">Visa magasinier :</span> {bon.visaMagasinier ?? '—'}</div>
        <div><span className="font-medium">Visa approbateur :</span> {bon.visaApprobateur ?? '—'}</div>
        {bon.observations && <div className="col-span-2"><span className="font-medium">Observations :</span> {bon.observations}</div>}
      </div>

      <div className="bg-white shadow rounded p-6">
        <h2 className="font-semibold mb-3">Lignes</h2>
        <table className="min-w-full text-sm border rounded">
          <thead className="bg-gray-100">
            <tr>
              {['Article', 'Quantité'].map(h => <th key={h} className="px-3 py-2 text-left">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {bon.lignes.map((l, i) => (
              <tr key={i} className="border-t">
                <td className="px-3 py-1">{l.article.articleCode} — {l.article.articleName}</td>
                <td className="px-3 py-1">{l.quantite}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showApprouver && (
        <ApprouverDialog onCancel={() => setShowApprouver(false)}
          onConfirm={async req => { await bonSortieApi.approuver(Number(id), req); setShowApprouver(false); load() }} />
      )}
      {showRejeter && (
        <RejeterDialog onCancel={() => setShowRejeter(false)}
          onConfirm={async req => { await bonSortieApi.rejeter(Number(id), req); setShowRejeter(false); load() }} />
      )}
      <button onClick={() => navigate('/bons-sortie')} className="text-blue-600 hover:underline text-sm">← Retour</button>
    </div>
  )
}
