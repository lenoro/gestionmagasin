import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { articleApi } from '../../api/commercialApi'
import type { CategorieArticle } from '../../types/commercial'

function FieldError({ msg }: { msg?: string }) {
  return msg ? <p className="text-red-500 text-xs mt-1">{msg}</p> : null
}

function fieldCls(error?: string) {
  return `w-full border rounded px-3 py-2 ${error ? 'border-red-500' : 'border-gray-300'}`
}

export default function ArticleForm() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [articleName, setArticleName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('0')
  const [categorie, setCategorie] = useState<CategorieArticle>('CONSOMMABLE')

  useEffect(() => {
    if (isEdit) {
      articleApi.findById(Number(id)).then(a => {
        setArticleName(a.articleName)
        setDescription(a.description ?? '')
        setPrice(a.price.toString())
        setStock(a.stock?.toString() ?? '0')
        setCategorie(a.categorie ?? 'CONSOMMABLE')
      })
    }
  }, [id, isEdit])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!articleName.trim()) errs.articleName = 'La désignation est obligatoire'
    else if (articleName.trim().length < 2) errs.articleName = 'Minimum 2 caractères'
    const priceNum = parseFloat(price)
    if (!price.trim()) errs.price = 'Le prix est obligatoire'
    else if (isNaN(priceNum) || priceNum < 0) errs.price = 'Le prix doit être ≥ 0'
    const stockNum = parseInt(stock)
    if (isNaN(stockNum) || stockNum < 0) errs.stock = 'Le stock doit être ≥ 0'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      const article = { articleName: articleName.trim(), description: description || undefined, price: parseFloat(price), stock: parseInt(stock), categorie }
      if (isEdit) await articleApi.update(Number(id), article)
      else await articleApi.create(article)
      navigate('/articles')
    } catch {
      setErrors({ _global: 'Erreur lors de la sauvegarde' })
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? 'Modifier article' : 'Nouvel article'}</h1>
      {errors._global && <p className="mb-4 text-red-600 bg-red-50 p-3 rounded">{errors._global}</p>}
      <div className="bg-white rounded shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Désignation *</label>
          <input value={articleName} onChange={e => { setArticleName(e.target.value); setErrors(p => ({ ...p, articleName: '' })) }}
            className={fieldCls(errors.articleName)} />
          <FieldError msg={errors.articleName} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
          <select value={categorie} onChange={e => setCategorie(e.target.value as CategorieArticle)}
            className="w-full border border-gray-300 rounded px-3 py-2">
            <option value="CONSOMMABLE">Consommable</option>
            <option value="NON_CONSOMMABLE">Non consommable</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prix unitaire *</label>
          <input type="number" step="0.01" min="0" value={price} onChange={e => { setPrice(e.target.value); setErrors(p => ({ ...p, price: '' })) }}
            className={fieldCls(errors.price)} />
          <FieldError msg={errors.price} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
          <input type="number" min="0" value={stock} onChange={e => { setStock(e.target.value); setErrors(p => ({ ...p, stock: '' })) }}
            className={fieldCls(errors.stock)} />
          <FieldError msg={errors.stock} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)}
            rows={3} className="w-full border border-gray-300 rounded px-3 py-2" />
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        <button type="submit" disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
          {saving ? 'Enregistrement…' : (isEdit ? 'Enregistrer' : 'Créer')}
        </button>
        <button type="button" onClick={() => navigate('/articles')}
          className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50">Annuler</button>
      </div>
    </form>
  )
}
