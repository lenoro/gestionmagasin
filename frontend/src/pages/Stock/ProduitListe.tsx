import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { produitApi } from '../../api/stockApi'
import type { Produit } from '../../types/stock'

export default function ProduitListe() {
  const navigate = useNavigate()
  const [produits, setProduits] = useState<Produit[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const load = () => produitApi.findAll().then(setProduits).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const filtered = produits.filter(p =>
    p.designation.toLowerCase().includes(search.toLowerCase()) ||
    (p.reference || '').toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce produit ?')) return
    await produitApi.delete(id)
    load()
  }

  if (loading) return <p className="p-6">Chargement…</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Produits</h1>
        <button onClick={() => navigate('/produits/nouveau')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          + Nouveau produit
        </button>
      </div>
      <div className="mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher par désignation ou référence…"
          className="w-full max-w-sm border rounded px-3 py-2 text-sm" />
      </div>
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Réf.</th>
              <th className="px-4 py-3 text-left">Désignation</th>
              <th className="px-4 py-3 text-left">Famille</th>
              <th className="px-4 py-3 text-left">Unité</th>
              <th className="px-4 py-3 text-right">Stock</th>
              <th className="px-4 py-3 text-right">Prix unitaire</th>
              <th className="px-4 py-3 text-left">Statut</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-sm">{p.reference || '—'}</td>
                <td className="px-4 py-3 font-medium">{p.designation}</td>
                <td className="px-4 py-3 text-gray-600">{p.famille?.libelle || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{p.unite?.libelle || '—'}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`font-medium ${(p.stockActuel ?? 0) <= (p.stockMinimum ?? 0) ? 'text-red-600' : 'text-gray-800'}`}>
                    {p.stockActuel ?? 0}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">{p.prixUnitaire?.toFixed(2) ?? '—'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.actif !== false ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {p.actif !== false ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => navigate(`/produits/${p.id}/edit`)}
                    className="text-blue-600 hover:underline text-xs">Modifier</button>
                  <button onClick={() => handleDelete(p.id!)}
                    className="text-red-600 hover:underline text-xs">Supprimer</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">Aucun produit</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
