import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { bonSortieApi } from '../../api/rgbiApi'
import type { BonSortie, StatutBonSortie, TypeBonSortie } from '../../types/rgbi'
import ApprouverDialog from '../../components/RGBI/ApprouverDialog'
import RejeterDialog from '../../components/RGBI/RejeterDialog'

const TYPE_LABELS: Record<TypeBonSortie, string> = {
  DEMANDE: 'Demande', SORTIE_DIRECTE: 'Sortie directe'
}
const STATUT_COLORS: Record<StatutBonSortie, string> = {
  EN_ATTENTE: 'bg-yellow-100 text-yellow-800',
  APPROUVE: 'bg-blue-100 text-blue-800',
  TRAITE: 'bg-green-100 text-green-800',
  REJETE: 'bg-red-100 text-red-800'
}

export default function BonSortieListe() {
  const [bons, setBons] = useState<BonSortie[]>([])
  const [filtreStatut, setFiltreStatut] = useState('')
  const [approuverId, setApprouverId] = useState<number | null>(null)
  const [rejeterId, setRejeterId] = useState<number | null>(null)
  const navigate = useNavigate()

  function load() { bonSortieApi.findAll().then(setBons) }
  useEffect(() => { load() }, [])

  const filtered = bons.filter(b => !filtreStatut || b.statut === filtreStatut)

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Bons de sortie</h1>
        <div className="flex gap-2">
          <button onClick={() => bonSortieApi.exportPdf()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">PDF</button>
          <button onClick={() => bonSortieApi.exportExcel()}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Excel</button>
          <button onClick={() => navigate('/bons-sortie/nouveau')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+ Nouveau</button>
        </div>
      </div>
      <div className="flex gap-3 mb-4">
        <select value={filtreStatut} onChange={e => setFiltreStatut(e.target.value)}
          className="border rounded px-3 py-1 text-sm">
          <option value="">Tous les statuts</option>
          {['EN_ATTENTE','APPROUVE','TRAITE','REJETE'].map(s => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow text-sm">
          <thead className="bg-blue-700 text-white">
            <tr>
              {['N° Bon','Type','Date','Service','Articles','Statut','Actions'].map(h => (
                <th key={h} className="px-4 py-2 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.id} className="border-t hover:bg-blue-50">
                <td className="px-4 py-2 font-mono cursor-pointer" onClick={() => navigate(`/bons-sortie/${b.id}`)}>
                  {b.numeroBon}
                </td>
                <td className="px-4 py-2">{TYPE_LABELS[b.typeBon]}</td>
                <td className="px-4 py-2">{b.dateBon}</td>
                <td className="px-4 py-2">{b.serviceDestination?.libelle ?? '—'}</td>
                <td className="px-4 py-2">{b.lignes.length} article(s)</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUT_COLORS[b.statut!]}`}>
                    {b.statut}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {b.statut === 'EN_ATTENTE' && (
                    <div className="flex gap-1">
                      <button onClick={() => setApprouverId(b.id!)}
                        className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700">Approuver</button>
                      <button onClick={() => setRejeterId(b.id!)}
                        className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700">Rejeter</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-gray-400">Aucun bon trouvé</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {approuverId && (
        <ApprouverDialog
          onCancel={() => setApprouverId(null)}
          onConfirm={async req => {
            await bonSortieApi.approuver(approuverId, req)
            setApprouverId(null)
            load()
          }}
        />
      )}
      {rejeterId && (
        <RejeterDialog
          onCancel={() => setRejeterId(null)}
          onConfirm={async req => {
            await bonSortieApi.rejeter(rejeterId, req)
            setRejeterId(null)
            load()
          }}
        />
      )}
    </div>
  )
}
