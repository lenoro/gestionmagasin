import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { bonSortieApi } from '../../api/rgbiApi'
import type { BonSortie, LigneBonSortie, TypeBonSortie } from '../../types/rgbi'
import LignesSortieEditor from '../../components/RGBI/LignesSortieEditor'

const BASE = 'http://localhost:8080/api'

export default function BonSortieForm() {
  const navigate = useNavigate()
  const [affectations, setAffectations] = useState<any[]>([])
  const [articles, setArticles] = useState<any[]>([])
  const [form, setForm] = useState<BonSortie>({
    typeBon: 'DEMANDE',
    dateBon: new Date().toISOString().split('T')[0],
    serviceDestination: { id: 0, libelle: '' },
    lignes: []
  })
  const [error, setError] = useState('')

  useEffect(() => {
    axios.get(`${BASE}/affectations`).then(r => setAffectations(r.data))
    axios.get(`${BASE}/articles`).then(r =>
      setArticles(r.data.filter((a: any) => a.categorie === 'CONSOMMABLE'))
    )
  }, [])

  function set(field: keyof BonSortie, value: unknown) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (form.lignes.length === 0) { setError('Ajoutez au moins une ligne'); return }
    if (!form.serviceDestination.id) { setError('Choisissez un service destination'); return }
    try {
      await bonSortieApi.create(form)
      navigate('/bons-sortie')
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Erreur lors de la création")
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nouveau bon de sortie</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Type *</label>
            <select required value={form.typeBon}
              onChange={e => set('typeBon', e.target.value as TypeBonSortie)}
              className="w-full border rounded px-3 py-2">
              <option value="DEMANDE">Demande (avec approbation)</option>
              <option value="SORTIE_DIRECTE">Sortie directe</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date *</label>
            <input required type="date" value={form.dateBon}
              onChange={e => set('dateBon', e.target.value)}
              className="w-full border rounded px-3 py-2" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Service destination *</label>
          <select required value={form.serviceDestination.id || ''}
            onChange={e => set('serviceDestination', affectations.find(a => a.id === Number(e.target.value)))}
            className="w-full border rounded px-3 py-2">
            <option value="">-- Choisir --</option>
            {affectations.map(a => <option key={a.id} value={a.id}>{a.libelle}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Lignes articles *</label>
          <LignesSortieEditor
            lignes={form.lignes as LigneBonSortie[]}
            articles={articles}
            onChange={lignes => set('lignes', lignes)} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Visa magasinier</label>
          <input value={form.visaMagasinier ?? ''} onChange={e => set('visaMagasinier', e.target.value)}
            className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Observations</label>
          <textarea value={form.observations ?? ''} onChange={e => set('observations', e.target.value)}
            rows={2} className="w-full border rounded px-3 py-2" />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={() => navigate('/bons-sortie')}
            className="px-4 py-2 border rounded hover:bg-gray-50">Annuler</button>
          <button type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Créer</button>
        </div>
      </form>
    </div>
  )
}
