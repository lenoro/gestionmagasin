import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { factureApi, clientApi, vendeurApi, articleApi } from '../../api/commercialApi'
import type { Client, Vendeur, Article, ItemFacture } from '../../types/commercial'

export default function FactureForm() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [clients, setClients] = useState<Client[]>([])
  const [vendeurs, setVendeurs] = useState<Vendeur[]>([])
  const [articles, setArticles] = useState<Article[]>([])

  const [clientId, setClientId] = useState<number | ''>('')
  const [vendeurId, setVendeurId] = useState<number | ''>('')
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().slice(0, 10))
  const [lignes, setLignes] = useState<{ articleId: number | ''; quantity: number; unitPrice: number }[]>([
    { articleId: '', quantity: 1, unitPrice: 0 }
  ])

  useEffect(() => {
    Promise.all([clientApi.findAll(), vendeurApi.findAll(), articleApi.findAll()])
      .then(([c, v, a]) => { setClients(c); setVendeurs(v); setArticles(a) })
      .catch(() => setErrors({ _global: 'Erreur chargement des données' }))
  }, [])

  const updateLigne = (idx: number, field: string, value: number | string) => {
    setLignes(prev => {
      const updated = [...prev]
      updated[idx] = { ...updated[idx], [field]: value }
      if (field === 'articleId') {
        const art = articles.find(a => a.id === Number(value))
        if (art) updated[idx].unitPrice = art.price
      }
      return updated
    })
    setErrors(p => ({ ...p, lignes: '' }))
  }

  const addLigne = () => setLignes(prev => [...prev, { articleId: '', quantity: 1, unitPrice: 0 }])
  const removeLigne = (idx: number) => setLignes(prev => prev.filter((_, i) => i !== idx))

  const total = lignes.reduce((sum, l) => sum + (l.quantity * l.unitPrice), 0)

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!clientId) errs.clientId = 'Le client est obligatoire'
    if (!invoiceDate) errs.invoiceDate = 'La date est obligatoire'
    const validLignes = lignes.filter(l => l.articleId !== '' && l.quantity > 0)
    if (validLignes.length === 0) errs.lignes = 'Au moins un article est requis'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      const validLignes = lignes.filter(l => l.articleId !== '' && l.quantity > 0)
      const items: ItemFacture[] = validLignes.map(l => ({
        article: articles.find(a => a.id === Number(l.articleId)),
        quantity: l.quantity,
        unitPrice: l.unitPrice,
        lineTotal: l.quantity * l.unitPrice,
      }))
      const facture = {
        invoiceDate,
        client: clients.find(c => c.id === Number(clientId))!,
        vendeur: vendeurId ? (vendeurs.find(v => v.id === Number(vendeurId)) ?? null) : null,
        totalAmount: total,
        status: 'ÉMISE',
        items,
      }
      const created = await factureApi.create(facture)
      navigate(`/factures/${created.id}`)
    } catch {
      setErrors({ _global: 'Erreur lors de la sauvegarde' })
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Nouvelle facture</h1>
      {errors._global && <p className="mb-4 text-red-600 bg-red-50 p-3 rounded">{errors._global}</p>}

      <div className="bg-white rounded shadow p-6 mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Client *</label>
          <select value={clientId}
            onChange={e => { setClientId(e.target.value ? Number(e.target.value) : ''); setErrors(p => ({ ...p, clientId: '' })) }}
            className={`w-full border rounded px-3 py-2 ${errors.clientId ? 'border-red-500' : 'border-gray-300'}`}>
            <option value="">-- Sélectionner --</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.clientName}</option>)}
          </select>
          {errors.clientId && <p className="text-red-500 text-xs mt-1">{errors.clientId}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vendeur</label>
          <select value={vendeurId} onChange={e => setVendeurId(e.target.value ? Number(e.target.value) : '')}
            className="w-full border border-gray-300 rounded px-3 py-2">
            <option value="">-- Aucun --</option>
            {vendeurs.map(v => <option key={v.id} value={v.id}>{v.vendorName}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
          <input type="date" value={invoiceDate}
            onChange={e => { setInvoiceDate(e.target.value); setErrors(p => ({ ...p, invoiceDate: '' })) }}
            className={`w-full border rounded px-3 py-2 ${errors.invoiceDate ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.invoiceDate && <p className="text-red-500 text-xs mt-1">{errors.invoiceDate}</p>}
        </div>
      </div>

      {/* Lignes d'articles */}
      <div className={`bg-white rounded shadow p-6 mb-4 ${errors.lignes ? 'ring-1 ring-red-400' : ''}`}>
        <h2 className="font-semibold text-gray-700 mb-1">Articles *</h2>
        {errors.lignes && <p className="text-red-500 text-xs mb-3">{errors.lignes}</p>}
        <table className="min-w-full text-sm mb-3">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-3 py-2 text-left">Article</th>
              <th className="px-3 py-2 text-right">Qté</th>
              <th className="px-3 py-2 text-right">Prix unit.</th>
              <th className="px-3 py-2 text-right">Total</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {lignes.map((l, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-3 py-2">
                  <select value={l.articleId} onChange={e => updateLigne(idx, 'articleId', e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm">
                    <option value="">-- Article --</option>
                    {articles.map(a => <option key={a.id} value={a.id}>{a.articleName}</option>)}
                  </select>
                </td>
                <td className="px-3 py-2">
                  <input type="number" min="1" value={l.quantity}
                    onChange={e => updateLigne(idx, 'quantity', parseInt(e.target.value) || 1)}
                    className="w-20 border border-gray-300 rounded px-2 py-1 text-sm text-right" />
                </td>
                <td className="px-3 py-2">
                  <input type="number" step="0.01" min="0" value={l.unitPrice}
                    onChange={e => updateLigne(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                    className="w-28 border border-gray-300 rounded px-2 py-1 text-sm text-right" />
                </td>
                <td className="px-3 py-2 text-right font-medium">
                  {(l.quantity * l.unitPrice).toFixed(2)}
                </td>
                <td className="px-3 py-2">
                  {lignes.length > 1 && (
                    <button type="button" onClick={() => removeLigne(idx)}
                      className="text-red-500 hover:text-red-700 text-xs">✕</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center">
          <button type="button" onClick={addLigne}
            className="px-3 py-1.5 text-sm border border-blue-300 text-blue-600 rounded hover:bg-blue-50">
            + Ajouter une ligne
          </button>
          <div className="text-lg font-bold text-gray-800">
            Total : <span className="text-blue-700">{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
          {saving ? 'Enregistrement…' : 'Créer la facture'}
        </button>
        <button type="button" onClick={() => navigate('/factures')}
          className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50">Annuler</button>
      </div>
    </form>
  )
}
