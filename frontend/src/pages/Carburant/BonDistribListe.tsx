import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { bonDistribApi, stockCarburantApi } from '../../api/carburantApi'
import type { BonDistribution, StockCarburant } from '../../types/carburant'

export default function BonDistribListe() {
  const navigate = useNavigate()
  const [bons, setBons] = useState<BonDistribution[]>([])
  const [stock, setStock] = useState<StockCarburant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([bonDistribApi.findAll(), stockCarburantApi.findAll()])
      .then(([b, s]) => { setBons(b); setStock(s) })
      .catch(() => setError('Erreur chargement'))
      .finally(() => setLoading(false))
  }, [])

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
        <h1 className="text-2xl font-bold text-gray-800">Bons de distribution carburant</h1>
        <div className="flex gap-2">
          <button onClick={() => navigate('/bons-distribution/nouveau')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Nouveau bon</button>
          <button onClick={() => bonDistribApi.exportPdf().then(b => telecharger(b, 'bons-distribution.pdf'))}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">PDF</button>
          <button onClick={() => bonDistribApi.exportExcel().then(b => telecharger(b, 'bons-distribution.xlsx'))}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Excel</button>
        </div>
      </div>

      {/* Bandeau stock courant */}
      <div className="flex gap-4 mb-4">
        {stock.length === 0
          ? <p className="text-sm text-gray-500">Stock non initialisé</p>
          : stock.map(s => (
            <div key={s.id} className="bg-white rounded shadow px-4 py-3 text-center min-w-[120px]">
              <p className="text-xs text-gray-500 uppercase">{s.typeCarburant}</p>
              <p className="text-lg font-bold text-gray-800">{s.quantiteLitres} L</p>
            </div>
          ))
        }
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">N° Bon</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Véhicule</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Litres</th>
              <th className="px-4 py-2 text-left">Km</th>
              <th className="px-4 py-2 text-left">Chauffeur</th>
              <th className="px-4 py-2 text-left">Visa</th>
            </tr>
          </thead>
          <tbody>
            {bons.map(b => (
              <tr key={b.id} className="border-t hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/bons-distribution/${b.id}`)}>
                <td className="px-4 py-2 font-mono">{b.numeroBon}</td>
                <td className="px-4 py-2">{b.dateBon}</td>
                <td className="px-4 py-2">{b.vehicule.immatriculation}</td>
                <td className="px-4 py-2">{b.typeCarburant}</td>
                <td className="px-4 py-2">{b.quantiteLitres} L</td>
                <td className="px-4 py-2">{b.kilometrage ?? '—'}</td>
                <td className="px-4 py-2">{b.chauffeur || '—'}</td>
                <td className="px-4 py-2">{b.visa || '—'}</td>
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
