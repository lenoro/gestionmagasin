import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { factureApi } from '../api/commercialApi'
import { produitApi } from '../api/stockApi'
import type { Facture } from '../types/commercial'
import type { Produit } from '../types/stock'

interface KpiCardProps {
  label: string
  value: number | string
  color: string
  sub?: string
  onClick?: () => void
}

function KpiCard({ label, value, color, sub, onClick }: KpiCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow p-5 border-l-4 ${color} ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
    >
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [factures, setFactures] = useState<Facture[]>([])
  const [produits, setProduits] = useState<Produit[]>([])
  const [articlesAlertes, setArticlesAlertes] = useState<any[]>([])
  const [bonsSortie, setBonsSortie] = useState<any[]>([])
  const [bonsEntree, setBonsEntree] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    Promise.allSettled([
      factureApi.findAll(),
      produitApi.findAll(),
      axios.get('/api/articles/alertes'),
      axios.get('/api/bons-sortie'),
      axios.get('/api/bons-entree'),
    ]).then(([f, p, aa, bs, be]) => {
      if (f.status === 'fulfilled') {
        const unique = Array.from(new Map(f.value.map((x: Facture) => [x.id, x])).values())
        setFactures(unique)
      }
      if (p.status === 'fulfilled') setProduits(p.value)
      if (aa.status === 'fulfilled') setArticlesAlertes(aa.value.data)
      if (bs.status === 'fulfilled') setBonsSortie(bs.value.data)
      if (be.status === 'fulfilled') setBonsEntree(be.value.data)
      setLoading(false)
    })
  }, [])

  if (loading) return <p className="p-6">Chargement…</p>

  // KPIs commercial
  const payees = factures.filter(f => ['PAID', 'PAYÉ'].includes((f.status ?? '').toUpperCase())).length
  const impayees = factures.filter(f => ['UNPAID', 'IMPAYÉ'].includes((f.status ?? '').toUpperCase())).length
  const alertesStockGS = produits.filter(p => (p.stockActuel ?? 0) <= (p.stockMinimum ?? 0)).length

  // KPIs CFPA / Inventaire
  const demandesEnAttente = bonsSortie.filter((b: any) => b.statut === 'EN_ATTENTE').length
  const bonsEntreeAujourdhui = bonsEntree.filter((b: any) => b.createdAt === today).length
  const bonsSortieAujourdhui = bonsSortie.filter((b: any) => b.createdAt === today).length
  const bonsDuJour = bonsEntreeAujourdhui + bonsSortieAujourdhui

  const dernieresBonsEntree = [...bonsEntree]
    .sort((a: any, b: any) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
    .slice(0, 5)

  const dernieresBonsSortie = [...bonsSortie]
    .sort((a: any, b: any) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
    .slice(0, 5)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tableau de bord</h1>

      {/* KPIs CFPA */}
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Module Inventaire CFPA</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Articles consomptibles" value={articlesAlertes.length > 0 ? `${articlesAlertes.length} alerte(s)` : '—'}
          color={articlesAlertes.length > 0 ? 'border-red-500' : 'border-green-500'}
          sub="Sous le seuil minimum"
          onClick={() => navigate('/etat-besoins')} />
        <KpiCard label="Demandes en attente" value={demandesEnAttente}
          color={demandesEnAttente > 0 ? 'border-orange-500' : 'border-gray-300'}
          sub="Bons de sortie à approuver"
          onClick={() => navigate('/bons-sortie')} />
        <KpiCard label="Bons du jour" value={bonsDuJour}
          color="border-blue-500"
          sub={`${bonsEntreeAujourdhui} entrée(s) · ${bonsSortieAujourdhui} sortie(s)`} />
        <KpiCard label="Grand Livre" value="Accéder"
          color="border-slate-500"
          sub="Biens non-consomptibles"
          onClick={() => navigate('/grand-livre')} />
      </div>

      {/* KPIs commercial */}
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Module Commercial</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Total factures" value={factures.length} color="border-blue-500"
          onClick={() => navigate('/factures')} />
        <KpiCard label="Payées" value={payees} color="border-green-500"
          onClick={() => navigate('/factures')} />
        <KpiCard label="Impayées" value={impayees} color="border-orange-500"
          onClick={() => navigate('/factures')} />
        <KpiCard label="Alertes stock GS" value={alertesStockGS} color="border-red-400"
          onClick={() => navigate('/produits')} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Derniers bons d'entrée */}
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-700">Derniers bons d'entrée</h2>
            <button onClick={() => navigate('/bons-entree')}
              className="text-xs text-blue-600 hover:underline">Voir tout</button>
          </div>
          {dernieresBonsEntree.length === 0 ? (
            <p className="text-sm text-gray-400">Aucun bon</p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {dernieresBonsEntree.map((b: any) => (
                  <tr key={b.id} onClick={() => navigate(`/bons-entree/${b.id}`)}
                    className="border-t cursor-pointer hover:bg-gray-50">
                    <td className="py-2 font-mono text-blue-700 text-xs">{b.numeroBon}</td>
                    <td className="py-2 text-gray-600 text-xs">{b.dateBon}</td>
                    <td className="py-2 text-right">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        b.statut === 'VALIDE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>{b.statut}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Derniers bons de sortie */}
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-700">
              Derniers bons de sortie
              {demandesEnAttente > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                  {demandesEnAttente} en attente
                </span>
              )}
            </h2>
            <button onClick={() => navigate('/bons-sortie')}
              className="text-xs text-blue-600 hover:underline">Voir tout</button>
          </div>
          {dernieresBonsSortie.length === 0 ? (
            <p className="text-sm text-gray-400">Aucun bon</p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {dernieresBonsSortie.map((b: any) => (
                  <tr key={b.id} onClick={() => navigate(`/bons-sortie/${b.id}`)}
                    className="border-t cursor-pointer hover:bg-gray-50">
                    <td className="py-2 font-mono text-blue-700 text-xs">{b.numeroBon}</td>
                    <td className="py-2 text-gray-600 text-xs">{b.serviceDestination?.libelle || '—'}</td>
                    <td className="py-2 text-right">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        b.statut === 'TRAITE' ? 'bg-green-100 text-green-700' :
                        b.statut === 'EN_ATTENTE' ? 'bg-orange-100 text-orange-700' :
                        b.statut === 'REJETE' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>{b.statut}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Alertes consomptibles */}
      {articlesAlertes.length > 0 && (
        <div className="bg-white rounded-lg shadow p-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-700 text-red-600">
              Alertes consomptibles — réapprovisionnement requis
            </h2>
            <button onClick={() => navigate('/etat-besoins')}
              className="text-xs text-blue-600 hover:underline">État des besoins complet</button>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {articlesAlertes.slice(0, 5).map((a: any) => (
                <tr key={a.id} className="border-t">
                  <td className="py-2 font-medium text-gray-700">{a.articleName}</td>
                  <td className="py-2 text-right">
                    <span className={`font-bold ${a.stock === 0 ? 'text-red-600' : 'text-orange-500'}`}>
                      {a.stock}
                    </span>
                    <span className="text-gray-400 text-xs ml-1">/ min {a.stockMinimum}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Accès rapide */}
      <div className="mt-2">
        <h2 className="font-semibold text-gray-700 mb-3">Accès rapide</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Bon d\'entrée', path: '/bons-entree/nouveau', color: 'bg-blue-600' },
            { label: 'Bon de sortie', path: '/bons-sortie/nouveau', color: 'bg-green-600' },
            { label: 'Nouveau bien', path: '/inventaire/nouveau', color: 'bg-slate-600' },
            { label: 'État des besoins', path: '/etat-besoins', color: 'bg-red-600' },
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
