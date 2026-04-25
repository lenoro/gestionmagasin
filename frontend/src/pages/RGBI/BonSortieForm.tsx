import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { bonSortieApi } from '../../api/rgbiApi'
import type { BonSortie, LigneBonSortie, TypeBonSortie, TypeSortie } from '../../types/rgbi'
import LignesSortieEditor from '../../components/RGBI/LignesSortieEditor'

const BASE = '/api'

export default function BonSortieForm() {
  const navigate = useNavigate()
  const [affectations, setAffectations] = useState<any[]>([])
  const [consommateurs, setConsommateurs] = useState<any[]>([])
  const [articles, setArticles] = useState<any[]>([])
  const [form, setForm] = useState<BonSortie>({
    typeBon: 'DEMANDE',
    typeSortie: 'CONSOMMATION_TP',
    dateBon: new Date().toISOString().split('T')[0],
    serviceDestination: { id: 0, libelle: '' },
    lignes: []
  })
  const [error, setError] = useState('')

  useEffect(() => {
    axios.get(`${BASE}/affectations`).then(r => setAffectations(r.data))
    axios.get(`${BASE}/consommateurs`).then(r => setConsommateurs(r.data))
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
    const payload = {
      ...form,
      lignes: form.lignes.map(l => ({ ...l, article: { id: l.article.id } }))
    }
    try {
      await bonSortieApi.create(payload as any)
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
            <label className="block text-sm font-medium mb-1">Type de bon *</label>
            <select required value={form.typeBon}
              onChange={e => set('typeBon', e.target.value as TypeBonSortie)}
              className="w-full border rounded px-3 py-2">
              <option value="DEMANDE">Demande (avec approbation)</option>
              <option value="SORTIE_DIRECTE">Sortie directe</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type de sortie *</label>
            <select required value={form.typeSortie ?? 'CONSOMMATION_TP'}
              onChange={e => set('typeSortie', e.target.value as TypeSortie)}
              className="w-full border rounded px-3 py-2">
              <option value="CONSOMMATION_TP">Consommation TP / Atelier</option>
              <option value="PRET_OUTILLAGE">Prêt d'outillage</option>
              <option value="ADMINISTRATION">Administration</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date *</label>
          <input required type="date" value={form.dateBon}
            onChange={e => set('dateBon', e.target.value)}
            className="w-full border rounded px-3 py-2 max-w-xs" />
        </div>

        <div className="grid grid-cols-2 gap-4">
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
            <label className="block text-sm font-medium mb-1">Demandeur</label>
            <select value={form.consommateur?.id ?? ''}
              onChange={e => set('consommateur', consommateurs.find(c => c.id === Number(e.target.value)) || null)}
              className="w-full border rounded px-3 py-2">
              <option value="">-- Choisir --</option>
              {consommateurs.map(c => (
                <option key={c.id} value={c.id}>{c.nomPrenom} ({c.serviceAtelier})</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Lignes articles *</label>
          <LignesSortieEditor
            lignes={form.lignes as LigneBonSortie[]}
            articles={articles}
            onChange={lignes => set('lignes', lignes)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Visa demandeur</label>
            <input value={form.visaDemandeur ?? ''} onChange={e => set('visaDemandeur', e.target.value)}
              className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Visa magasinier</label>
            <input value={form.visaMagasinier ?? ''} onChange={e => set('visaMagasinier', e.target.value)}
              className="w-full border rounded px-3 py-2" />
          </div>
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
