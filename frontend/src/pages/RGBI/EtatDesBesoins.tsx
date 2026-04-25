import { useEffect, useState } from 'react'
import axios from 'axios'

interface ArticleAlerte {
  id: number
  articleCode: string
  articleName: string
  categorie: string
  stock: number
  stockMinimum: number
  unitesMesure?: string
  producteur?: { producerName: string }
}

export default function EtatDesBesoins() {
  const [alertes, setAlertes] = useState<ArticleAlerte[]>([])
  const [loading, setLoading] = useState(true)
  const [date] = useState(new Date().toLocaleDateString('fr-DZ'))

  useEffect(() => {
    setLoading(true)
    axios.get('/api/articles/alertes')
      .then(r => setAlertes(r.data))
      .finally(() => setLoading(false))
  }, [])

  const manquant = (a: ArticleAlerte) => Math.max(0, (a.stockMinimum || 0) * 2 - a.stock)

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">État des Besoins</h1>
          <p className="text-sm text-gray-500 mt-1">Articles consomptibles sous le seuil minimum — {date}</p>
        </div>
        <button onClick={() => window.print()}
          className="px-4 py-2 border rounded text-sm hover:bg-gray-50">
          Imprimer
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Chargement...</p>
      ) : alertes.length === 0 ? (
        <div className="bg-green-50 border border-green-200 rounded p-6 text-center text-green-700">
          <p className="font-medium">Aucune alerte de stock</p>
          <p className="text-sm mt-1">Tous les articles sont au-dessus de leur seuil minimum</p>
        </div>
      ) : (
        <>
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
            <p className="text-red-700 font-medium">{alertes.length} article(s) nécessitent un réapprovisionnement</p>
          </div>

          <div className="bg-white rounded shadow overflow-hidden">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Code</th>
                  <th className="px-4 py-3 text-left">Désignation</th>
                  <th className="px-4 py-3 text-center">Stock actuel</th>
                  <th className="px-4 py-3 text-center">Seuil minimum</th>
                  <th className="px-4 py-3 text-center">Qté à commander</th>
                  <th className="px-4 py-3 text-left">Unité</th>
                  <th className="px-4 py-3 text-left">Fournisseur habituel</th>
                </tr>
              </thead>
              <tbody>
                {alertes.map(a => (
                  <tr key={a.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{a.articleCode}</td>
                    <td className="px-4 py-3 font-medium">{a.articleName}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-bold ${a.stock === 0 ? 'text-red-600' : 'text-orange-500'}`}>
                        {a.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">{a.stockMinimum}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">
                        {manquant(a)}
                      </span>
                    </td>
                    <td className="px-4 py-3">{a.unitesMesure || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{a.producteur?.producerName || '—'}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td colSpan={7} className="px-4 py-3 text-xs text-gray-500 text-right">
                    État généré le {date} — à transmettre à l'Intendant pour bon de commande
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
