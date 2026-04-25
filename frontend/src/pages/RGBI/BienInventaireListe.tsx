import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

interface BienInventaire {
  id: number
  numeroInventaire: string
  designation: string
  marqueModele?: string
  dateAcquisition: string
  prixAchat: number
  affectation?: { libelle: string }
  affectationLibre?: string
  etatMateriel: string
  statut: string
  observations?: string
}

const etatColors: Record<string, string> = {
  BON: 'bg-green-100 text-green-700',
  MOYEN: 'bg-yellow-100 text-yellow-700',
  EN_REPARATION: 'bg-blue-100 text-blue-700',
  HORS_SERVICE: 'bg-red-100 text-red-700',
}

const statutColors: Record<string, string> = {
  ACTIF: 'bg-green-100 text-green-700',
  REFORME: 'bg-red-100 text-red-700',
  TRANSFERE: 'bg-gray-100 text-gray-700',
}

export default function BienInventaireListe() {
  const navigate = useNavigate()
  const [biens, setBiens] = useState<BienInventaire[]>([])
  const [search, setSearch] = useState('')
  const [filterStatut, setFilterStatut] = useState<string>('ACTIF')

  const load = () => axios.get('/api/inventaire').then(r => setBiens(r.data))
  useEffect(() => { load() }, [])

  const filtered = biens.filter(b => {
    const q = search.toLowerCase()
    const matchSearch = !search ||
      b.numeroInventaire.toLowerCase().includes(q) ||
      b.designation.toLowerCase().includes(q) ||
      (b.affectation?.libelle || b.affectationLibre || '').toLowerCase().includes(q)
    const matchStatut = !filterStatut || b.statut === filterStatut
    return matchSearch && matchStatut
  })

  const totalValeur = filtered.reduce((sum, b) => sum + (b.prixAchat || 0), 0)

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Grand Livre d'Inventaire</h1>
          <p className="text-sm text-gray-500 mt-1">Matériel non-consomptible (biens durables)</p>
        </div>
        <button onClick={() => navigate('/inventaire/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          + Nouveau bien
        </button>
      </div>

      <div className="flex gap-3 mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher par numéro, désignation, affectation..."
          className="border rounded px-3 py-2 text-sm flex-1 max-w-md" />
        <select value={filterStatut} onChange={e => setFilterStatut(e.target.value)}
          className="border rounded px-3 py-2 text-sm">
          <option value="">Tous statuts</option>
          <option value="ACTIF">Actif</option>
          <option value="REFORME">Réformé</option>
          <option value="TRANSFERE">Transféré</option>
        </select>
        <button onClick={() => window.print()}
          className="px-4 py-2 border rounded text-sm hover:bg-gray-50">
          Imprimer
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-white rounded shadow p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{filtered.length}</p>
          <p className="text-xs text-gray-500 mt-1">Articles</p>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            {biens.filter(b => b.statut === 'ACTIF').length}
          </p>
          <p className="text-xs text-gray-500 mt-1">En service</p>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <p className="text-2xl font-bold text-gray-700">
            {totalValeur.toLocaleString('fr-DZ')} DA
          </p>
          <p className="text-xs text-gray-500 mt-1">Valeur totale</p>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">N° Inventaire</th>
              <th className="px-4 py-3 text-left">Désignation</th>
              <th className="px-4 py-3 text-left">Marque/Modèle</th>
              <th className="px-4 py-3 text-left">Date acquisition</th>
              <th className="px-4 py-3 text-right">Prix (DA)</th>
              <th className="px-4 py-3 text-left">Affectation</th>
              <th className="px-4 py-3 text-left">État</th>
              <th className="px-4 py-3 text-left">Statut</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-mono font-medium text-blue-700">{b.numeroInventaire}</td>
                <td className="px-4 py-3 font-medium">{b.designation}</td>
                <td className="px-4 py-3 text-gray-600">{b.marqueModele || '—'}</td>
                <td className="px-4 py-3">{b.dateAcquisition}</td>
                <td className="px-4 py-3 text-right">{(b.prixAchat || 0).toLocaleString('fr-DZ')}</td>
                <td className="px-4 py-3">{b.affectation?.libelle || b.affectationLibre || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${etatColors[b.etatMateriel] || 'bg-gray-100 text-gray-600'}`}>
                    {b.etatMateriel?.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${statutColors[b.statut] || 'bg-gray-100 text-gray-600'}`}>
                    {b.statut}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => navigate(`/inventaire/${b.id}`)}
                    className="text-blue-600 hover:underline text-xs">Détail</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400">Aucun bien inventorié</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
