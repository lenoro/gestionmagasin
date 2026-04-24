import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { bonEntreeApi } from '../../api/rgbiApi'
import type { BonEntree, LigneBonEntree, TypeBonEntree } from '../../types/rgbi'
import LignesEntreeEditor from '../../components/RGBI/LignesEntreeEditor'

const BASE = '/api'

export default function BonEntreeForm() {
  const navigate = useNavigate()
  const [fournisseurs, setFournisseurs] = useState<any[]>([])
  const [affectations, setAffectations] = useState<any[]>([])
  const [articles, setArticles] = useState<any[]>([])
  const [form, setForm] = useState<BonEntree>({
    typeBon: 'COMMANDE_FOURNISSEUR',
    dateBon: new Date().toISOString().split('T')[0],
    lignes: []
  })
  const [error, setError] = useState('')

  useEffect(() => {
    axios.get(`${BASE}/producteurs`).then(r => setFournisseurs(r.data))
    axios.get(`${BASE}/affectations`).then(r => setAffectations(r.data))
    axios.get(`${BASE}/articles`).then(r =>
      setArticles(r.data.filter((a: any) => a.categorie === 'CONSOMMABLE'))
    )
  }, [])

  function set(field: keyof BonEntree, value: unknown) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (form.lignes.length === 0) { setError('Ajoutez au moins une ligne'); return }
    try {
      await bonEntreeApi.create(form)
      navigate('/bons-entree')
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Erreur lors de la création")
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nouveau bon d'entrée</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Type *</label>
            <select required value={form.typeBon}
              onChange={e => set('typeBon', e.target.value as TypeBonEntree)}
              className="w-full border rounded px-3 py-2">
              <option value="COMMANDE_FOURNISSEUR">Commande fournisseur</option>
              <option value="RETOUR_SERVICE">Retour service</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date *</label>
            <input required type="date" value={form.dateBon}
              onChange={e => set('dateBon', e.target.value)}
              className="w-full border rounded px-3 py-2" />
          </div>
        </div>

        {form.typeBon === 'COMMANDE_FOURNISSEUR' ? (
          <div>
            <label className="block text-sm font-medium mb-1">Fournisseur</label>
            <select value={form.fournisseur?.id ?? ''}
              onChange={e => set('fournisseur', fournisseurs.find(f => f.id === Number(e.target.value)))}
              className="w-full border rounded px-3 py-2">
              <option value="">-- Choisir --</option>
              {fournisseurs.map(f => <option key={f.id} value={f.id}>{f.producerName}</option>)}
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium mb-1">Service source</label>
            <select value={form.serviceSource?.id ?? ''}
              onChange={e => set('serviceSource', affectations.find(a => a.id === Number(e.target.value)))}
              className="w-full border rounded px-3 py-2">
              <option value="">-- Choisir --</option>
              {affectations.map(a => <option key={a.id} value={a.id}>{a.libelle}</option>)}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Lignes articles *</label>
          <LignesEntreeEditor
            lignes={form.lignes as LigneBonEntree[]}
            articles={articles}
            onChange={lignes => set('lignes', lignes)} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Visa</label>
          <input value={form.visa ?? ''} onChange={e => set('visa', e.target.value)}
            className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Observations</label>
          <textarea value={form.observations ?? ''} onChange={e => set('observations', e.target.value)}
            rows={2} className="w-full border rounded px-3 py-2" />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={() => navigate('/bons-entree')}
            className="px-4 py-2 border rounded hover:bg-gray-50">Annuler</button>
          <button type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Créer</button>
        </div>
      </form>
    </div>
  )
}
