import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { bonEntreeGSApi } from '../../api/stockApi'
import type { BonEntreeGS } from '../../types/stock'

const statutColor: Record<string, string> = {
  BROUILLON: 'bg-yellow-100 text-yellow-800',
  VALIDE: 'bg-green-100 text-green-800',
  ANNULE: 'bg-red-100 text-red-800',
}

export default function BonEntreeListe() {
  const navigate = useNavigate()
  const [bons, setBons] = useState<BonEntreeGS[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => bonEntreeGSApi.findAll().then(setBons).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  if (loading) return <p className="p-6">Chargement…</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Bons de réception stock</h1>
        <button onClick={() => navigate('/stock-entrees/nouveau')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          + Nouveau bon
        </button>
      </div>
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Numéro</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Fournisseur</th>
              <th className="px-4 py-3 text-left">Dépôt</th>
              <th className="px-4 py-3 text-left">Agent réception</th>
              <th className="px-4 py-3 text-left">Statut</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {bons.map(b => (
              <tr key={b.id} className="border-t hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/stock-entrees/${b.id}`)}>
                <td className="px-4 py-3 font-mono font-medium">{b.numero}</td>
                <td className="px-4 py-3">{b.dateEntree}</td>
                <td className="px-4 py-3">{b.fournisseur?.raisonSociale || '—'}</td>
                <td className="px-4 py-3">{b.depot?.libelle || '—'}</td>
                <td className="px-4 py-3">{b.agentReception || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statutColor[b.statut || ''] || 'bg-gray-100 text-gray-600'}`}>
                    {b.statut || 'BROUILLON'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                  <button onClick={() => navigate(`/stock-entrees/${b.id}`)}
                    className="text-blue-600 hover:underline text-xs">Voir</button>
                </td>
              </tr>
            ))}
            {bons.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Aucun bon de réception</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
