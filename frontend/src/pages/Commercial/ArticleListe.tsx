import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { articleApi } from '../../api/commercialApi'
import type { Article } from '../../types/commercial'

export default function ArticleListe() {
  const navigate = useNavigate()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    articleApi.findAll().then(setArticles).catch(() => setError('Erreur chargement')).finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="p-6">Chargement…</p>
  if (error) return <p className="p-6 text-red-600">{error}</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Articles</h1>
        <button onClick={() => navigate('/articles/nouveau')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Nouvel article</button>
      </div>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Code</th>
              <th className="px-4 py-2 text-left">Désignation</th>
              <th className="px-4 py-2 text-left">Catégorie</th>
              <th className="px-4 py-2 text-right">Prix</th>
              <th className="px-4 py-2 text-right">Stock</th>
            </tr>
          </thead>
          <tbody>
            {articles.map(a => (
              <tr key={a.id} className="border-t hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/articles/${a.id}/edit`)}>
                <td className="px-4 py-2 font-mono">{a.articleCode}</td>
                <td className="px-4 py-2 font-medium">{a.articleName}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    a.categorie === 'CONSOMMABLE' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>{a.categorie}</span>
                </td>
                <td className="px-4 py-2 text-right">{Number(a.price).toFixed(2)}</td>
                <td className="px-4 py-2 text-right">{a.stock ?? 0}</td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">Aucun article</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
