import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { bonEntreeApi } from '../../api/rgbiApi'
import type { BonEntree, StatutBonEntree, TypeBonEntree } from '../../types/rgbi'

const TYPE_LABELS: Record<TypeBonEntree, string> = {
  COMMANDE_FOURNISSEUR: 'Commande fournisseur',
  RETOUR_SERVICE: 'Retour service'
}
const STATUT_COLORS: Record<StatutBonEntree, string> = {
  BROUILLON: 'bg-yellow-100 text-yellow-800',
  VALIDE: 'bg-green-100 text-green-800'
}

export default function BonEntreeListe() {
  const [bons, setBons] = useState<BonEntree[]>([])
  const [filtreStatut, setFiltreStatut] = useState('')
  const navigate = useNavigate()

  useEffect(() => { bonEntreeApi.findAll().then(setBons) }, [])

  const filtered = bons.filter(b => !filtreStatut || b.statut === filtreStatut)

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Bons d'entrée</h1>
        <div className="flex gap-2">
          <button onClick={() => bonEntreeApi.exportPdf()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">PDF</button>
          <button onClick={() => bonEntreeApi.exportExcel()}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Excel</button>
          <button onClick={() => navigate('/bons-entree/nouveau')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+ Nouveau</button>
        </div>
      </div>
      <div className="flex gap-3 mb-4">
        <select value={filtreStatut} onChange={e => setFiltreStatut(e.target.value)}
          className="border rounded px-3 py-1 text-sm">
          <option value="">Tous les statuts</option>
          <option value="BROUILLON">Brouillon</option>
          <option value="VALIDE">Validé</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow text-sm">
          <thead className="bg-blue-700 text-white">
            <tr>
              {['N° Bon','Type','Date','Source','Articles','Statut'].map(h => (
                <th key={h} className="px-4 py-2 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.id} onClick={() => navigate(`/bons-entree/${b.id}`)}
                className="border-t hover:bg-blue-50 cursor-pointer">
                <td className="px-4 py-2 font-mono">{b.numeroBon}</td>
                <td className="px-4 py-2">{TYPE_LABELS[b.typeBon]}</td>
                <td className="px-4 py-2">{b.dateBon}</td>
                <td className="px-4 py-2">
                  {b.fournisseur?.raisonSociale ?? b.serviceSource?.libelle ?? '—'}
                </td>
                <td className="px-4 py-2">{b.lignes.length} article(s)</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUT_COLORS[b.statut!]}`}>
                    {b.statut}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">Aucun bon trouvé</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
