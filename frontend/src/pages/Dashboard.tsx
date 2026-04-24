import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { factureApi } from '../api/commercialApi'
import { produitApi } from '../api/stockApi'
import type { Facture } from '../types/commercial'
import type { Produit } from '../types/stock'

interface KpiCardProps {
  label: string
  value: number | string
  color: string
  onClick?: () => void
}

function KpiCard({ label, value, color, onClick }: KpiCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow p-5 border-l-4 ${color} ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
    >
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [factures, setFactures] = useState<Facture[]>([])
  const [produits, setProduits] = useState<Produit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      factureApi.findAll(),
      produitApi.findAll(),
    ]).then(([f, p]) => {
      if (f.status === 'fulfilled') {
        const unique = Array.from(new Map(f.value.map(x => [x.id, x])).values())
        setFactures(unique)
      }
      if (p.status === 'fulfilled') setProduits(p.value)
      setLoading(false)
    })
  }, [])

  if (loading) return <p className="p-6">Chargement…</p>

  const totalFactures = factures.length
  const payees = factures.filter(f => ['PAID', 'PAYÉ'].includes((f.status ?? '').toUpperCase())).length
  const impayees = factures.filter(f => ['UNPAID', 'IMPAYÉ'].includes((f.status ?? '').toUpperCase())).length
  const alertesStock = produits.filter(p => (p.stockActuel ?? 0) <= (p.stockMinimum ?? 0)).length
  const ruptures = produits.filter(p => (p.stockActuel ?? 0) === 0).length

  const dernieresFactures = [...factures]
    .sort((a, b) => (b.invoiceDate ?? '').localeCompare(a.invoiceDate ?? ''))
    .slice(0, 5)

  const produitsAlertes = produits
    .filter(p => (p.stockActuel ?? 0) <= (p.stockMinimum ?? 0))
    .slice(0, 5)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tableau de bord</h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Factures totales" value={totalFactures} color="border-blue-500"
          onClick={() => navigate('/factures')} />
        <KpiCard label="Factures payées" value={payees} color="border-green-500"
          onClick={() => navigate('/factures')} />
        <KpiCard label="Factures impayées" value={impayees} color="border-orange-500"
          onClick={() => navigate('/factures')} />
        <KpiCard label="Alertes stock" value={alertesStock} color="border-red-500"
          onClick={() => navigate('/produits')} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dernières factures */}
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-700">Dernières factures</h2>
            <button onClick={() => navigate('/factures')}
              className="text-xs text-blue-600 hover:underline">Voir tout</button>
          </div>
          {dernieresFactures.length === 0 ? (
            <p className="text-sm text-gray-400">Aucune facture</p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {dernieresFactures.map(f => (
                  <tr key={f.id} onClick={() => navigate(`/factures/${f.id}`)}
                    className="border-t cursor-pointer hover:bg-gray-50">
                    <td className="py-2 font-mono text-gray-600">{f.invoiceNumber}</td>
                    <td className="py-2 text-gray-700">{f.client?.clientName ?? '—'}</td>
                    <td className="py-2 text-right font-medium">{Number(f.totalAmount ?? 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Alertes stock */}
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-700">
              Alertes stock
              {ruptures > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">{ruptures} rupture{ruptures > 1 ? 's' : ''}</span>
              )}
            </h2>
            <button onClick={() => navigate('/produits')}
              className="text-xs text-blue-600 hover:underline">Voir tout</button>
          </div>
          {produitsAlertes.length === 0 ? (
            <p className="text-sm text-green-600">Aucune alerte — stock OK</p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {produitsAlertes.map(p => (
                  <tr key={p.id} className="border-t">
                    <td className="py-2 font-medium text-gray-700">{p.designation}</td>
                    <td className="py-2 text-right">
                      <span className={`font-bold ${(p.stockActuel ?? 0) === 0 ? 'text-red-600' : 'text-orange-500'}`}>
                        {p.stockActuel ?? 0}
                      </span>
                      <span className="text-gray-400 text-xs ml-1">/ min {p.stockMinimum ?? 0}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Raccourcis */}
      <div className="mt-6">
        <h2 className="font-semibold text-gray-700 mb-3">Accès rapide</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Nouvelle facture', path: '/factures/nouveau', color: 'bg-blue-600' },
            { label: 'Nouveau bon de réception', path: '/stock-entrees/nouveau', color: 'bg-green-600' },
            { label: 'Nouveau bon de sortie', path: '/stock-sorties/nouveau', color: 'bg-orange-600' },
            { label: 'Nouveau bien inventaire', path: '/inventaire/nouveau', color: 'bg-slate-600' },
          ].map(({ label, path, color }) => (
            <button key={path} onClick={() => navigate(path)}
              className={`${color} text-white text-sm font-medium px-4 py-3 rounded-lg hover:opacity-90 transition-opacity text-left`}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
