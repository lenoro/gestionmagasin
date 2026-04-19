import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { inventaireApi } from '../../api/inventaireApi'
import type { BienInventaire, StatutBien, EtatMateriel } from '../../types/inventaire'

const ETAT_LABELS: Record<EtatMateriel, string> = {
  BON: 'Bon état', MOYEN: 'État moyen',
  HORS_SERVICE: 'Hors service', EN_REPARATION: 'En réparation'
}
const STATUT_LABELS: Record<StatutBien, string> = {
  ACTIF: 'Actif', REFORME: 'Réformé', TRANSFERE: 'Transféré'
}
const STATUT_COLORS: Record<StatutBien, string> = {
  ACTIF: 'bg-green-100 text-green-800',
  REFORME: 'bg-red-100 text-red-800',
  TRANSFERE: 'bg-yellow-100 text-yellow-800'
}

export default function InventaireListe() {
  const [biens, setBiens] = useState<BienInventaire[]>([])
  const [filtreStatut, setFiltreStatut] = useState('')
  const [filtreEtat, setFiltreEtat] = useState('')
  const [filtreAffectation, setFiltreAffectation] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    inventaireApi.findAll().then(setBiens)
  }, [])

  const filtered = biens.filter(b => {
    const matchStatut = !filtreStatut || b.statut === filtreStatut
    const matchEtat = !filtreEtat || b.etatMateriel === filtreEtat
    const label = b.affectation?.libelle ?? b.affectationLibre ?? ''
    const matchAff = !filtreAffectation || label.toLowerCase().includes(filtreAffectation.toLowerCase())
    return matchStatut && matchEtat && matchAff
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Registre d'inventaire</h1>
        <div className="flex gap-2">
          <button onClick={() => inventaireApi.exportPdf()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Exporter PDF
          </button>
          <button onClick={() => inventaireApi.exportExcel()}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Exporter Excel
          </button>
          <button onClick={() => navigate('/inventaire/nouveau')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + Nouveau bien
          </button>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <input placeholder="Filtrer par affectation" value={filtreAffectation}
          onChange={e => setFiltreAffectation(e.target.value)}
          className="border rounded px-3 py-1 text-sm" />
        <select value={filtreEtat} onChange={e => setFiltreEtat(e.target.value)}
          className="border rounded px-3 py-1 text-sm">
          <option value="">Tous les états</option>
          {Object.entries(ETAT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={filtreStatut} onChange={e => setFiltreStatut(e.target.value)}
          className="border rounded px-3 py-1 text-sm">
          <option value="">Tous les statuts</option>
          {Object.entries(STATUT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow text-sm">
          <thead className="bg-blue-700 text-white">
            <tr>
              {['N° Inventaire','Désignation','Marque/Modèle','Date Acq.','Prix Achat','Affectation','État','Statut'].map(h => (
                <th key={h} className="px-4 py-2 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.id} onClick={() => navigate(`/inventaire/${b.id}`)}
                className="border-t hover:bg-blue-50 cursor-pointer">
                <td className="px-4 py-2 font-mono">{b.numeroInventaire}</td>
                <td className="px-4 py-2 font-medium">{b.designation}</td>
                <td className="px-4 py-2">{b.marqueModele ?? '—'}</td>
                <td className="px-4 py-2">{b.dateAcquisition}</td>
                <td className="px-4 py-2">{b.prixAchat?.toLocaleString()} DA</td>
                <td className="px-4 py-2">{b.affectation?.libelle ?? b.affectationLibre ?? '—'}</td>
                <td className="px-4 py-2">{ETAT_LABELS[b.etatMateriel]}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUT_COLORS[b.statut!]}`}>
                    {STATUT_LABELS[b.statut!]}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-6 text-center text-gray-400">Aucun bien trouvé</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
