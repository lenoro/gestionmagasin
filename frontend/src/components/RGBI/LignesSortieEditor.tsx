import type { LigneBonSortie } from '../../types/rgbi'

interface ArticleRef { id: number; articleCode: string; articleName: string; stock: number }

interface Props {
  lignes: LigneBonSortie[]
  articles: ArticleRef[]
  onChange: (lignes: LigneBonSortie[]) => void
}

export default function LignesSortieEditor({ lignes, articles, onChange }: Props) {
  function ajouterLigne() {
    if (articles.length === 0) return
    onChange([...lignes, { article: articles[0], quantite: 1 }])
  }
  function supprimerLigne(i: number) {
    onChange(lignes.filter((_, idx) => idx !== i))
  }
  function modifierLigne(i: number, field: keyof LigneBonSortie, value: unknown) {
    onChange(lignes.map((l, idx) => idx === i ? { ...l, [field]: value } : l))
  }

  return (
    <div>
      <table className="min-w-full text-sm border rounded mb-2">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-2 text-left">Article</th>
            <th className="px-3 py-2 text-left">Stock dispo</th>
            <th className="px-3 py-2 text-left">Qté</th>
            <th className="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {lignes.map((l, i) => (
            <tr key={i} className="border-t">
              <td className="px-3 py-1">
                <select value={l.article.id} className="border rounded px-2 py-1 w-full"
                  onChange={e => {
                    const a = articles.find(a => a.id === Number(e.target.value))
                    if (a) modifierLigne(i, 'article', a)
                  }}>
                  {articles.map(a => <option key={a.id} value={a.id}>{a.articleCode} — {a.articleName}</option>)}
                </select>
              </td>
              <td className="px-3 py-1 text-gray-500">{l.article.stock}</td>
              <td className="px-3 py-1">
                <input type="number" min={1} max={l.article.stock} value={l.quantite}
                  className="border rounded px-2 py-1 w-20"
                  onChange={e => modifierLigne(i, 'quantite', Number(e.target.value))} />
              </td>
              <td className="px-3 py-1">
                <button onClick={() => supprimerLigne(i)}
                  className="text-red-600 hover:text-red-800 text-xs">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={ajouterLigne} type="button"
        className="text-blue-600 hover:text-blue-800 text-sm">+ Ajouter une ligne</button>
    </div>
  )
}
