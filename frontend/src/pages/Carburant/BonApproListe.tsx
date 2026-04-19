import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { bonApproApi } from '../../api/carburantApi'
import type { BonApprovisionnement, StatutAppro } from '../../types/carburant'

const STATUT_BADGE: Record<StatutAppro, string> = {
  BROUILLON: 'bg-yellow-100 text-yellow-800',
  VALIDE: 'bg-green-100 text-green-800',
}

export default function BonApproListe() {
  const navigate = useNavigate()
  const [bons, setBons] = useState<BonApprovisionnement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    bonApproApi.findAll().then(setBons).catch(() => setError('Erreur chargement')).finally(() => setLoading(false))
  }, [])

  const handleValider = async (id: number) => {
    try {
      const updated = await bonApproApi.valider(id)
      setBons(prev => prev.map(b => b.id === id ? updated : b))
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Erreur')
    }
  }

  const telecharger = (blob: Blob, nom: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = nom; a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <p className="p-6">Chargement…</p>
  if (error) return <p className="p-6 text-red-600">{error}</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Bons d'approvisionnement carburant</h1>
        <div className="flex gap-2">
          <button onClick={() => navigate('/bons-approvisionnement/nouveau')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Nouveau bon</button>
          <button onClick={() => bonApproApi.exportPdf().then(b => telecharger(b, 'bons-approvisionnement.pdf'))}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">PDF</button>
          <button onClick={() => bonApproApi.exportExcel().then(b => telecharger(b, 'bons-approvisionnement.xlsx'))}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Excel</button>
        </div>
      </div>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">N° Bon</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Fournisseur</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Litres</th>
              <th className="px-4 py-2 text-left">Prix/L</th>
              <th className="px-4 py-2 text-left">Statut</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {bons.map(b => (
              <tr key={b.id} className="border-t hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/bons-approvisionnement/${b.id}`)}>
                <td className="px-4 py-2 font-mono">{b.numeroBon}</td>
                <td className="px-4 py-2">{b.dateBon}</td>
                <td className="px-4 py-2">{b.fournisseur.producerName}</td>
                <td className="px-4 py-2">{b.typeCarburant}</td>
                <td className="px-4 py-2">{b.quantiteLitres} L</td>
                <td className="px-4 py-2">{b.prixUnitaire} DA</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUT_BADGE[b.statut!]}`}>
                    {b.statut}
                  </span>
                </td>
                <td className="px-4 py-2" onClick={e => e.stopPropagation()}>
                  {b.statut === 'BROUILLON' && (
                    <button onClick={() => handleValider(b.id!)}
                      className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600">
                      Valider
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {bons.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-6 text-center text-gray-400">Aucun bon</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
