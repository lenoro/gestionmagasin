import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { inventaireApi, affectationApi } from '../../api/inventaireApi'
import type { BienInventaire, Affectation, EtatMateriel } from '../../types/inventaire'

const ETATS: EtatMateriel[] = ['BON', 'MOYEN', 'HORS_SERVICE', 'EN_REPARATION']
const ETAT_LABELS: Record<EtatMateriel, string> = {
  BON: 'Bon état', MOYEN: 'État moyen',
  HORS_SERVICE: 'Hors service', EN_REPARATION: 'En réparation'
}

export default function InventaireForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [affectations, setAffectations] = useState<Affectation[]>([])
  const [affectationMode, setAffectationMode] = useState<'liste' | 'libre'>('liste')
  const [form, setForm] = useState<BienInventaire>({
    designation: '',
    dateAcquisition: new Date().toISOString().split('T')[0],
    prixAchat: 0,
    etatMateriel: 'BON',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    affectationApi.findAll().then(setAffectations)
    if (isEdit) {
      inventaireApi.findById(Number(id)).then(b => {
        setForm(b)
        if (b.affectationLibre) setAffectationMode('libre')
      })
    }
  }, [id])

  function set(field: keyof BienInventaire, value: unknown) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const data: BienInventaire = { ...form }
    if (affectationMode === 'libre') {
      data.affectation = undefined
    } else {
      data.affectationLibre = undefined
    }
    if (!data.affectation && !data.affectationLibre) {
      setError("L'affectation est obligatoire")
      return
    }
    try {
      if (isEdit) {
        await inventaireApi.update(Number(id), data)
      } else {
        await inventaireApi.create(data)
      }
      navigate('/inventaire')
    } catch {
      setError("Erreur lors de l'enregistrement")
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{isEdit ? 'Modifier le bien' : 'Nouveau bien'}</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded p-6 space-y-4">

        <div>
          <label className="block text-sm font-medium mb-1">Désignation *</label>
          <input required value={form.designation} onChange={e => set('designation', e.target.value)}
            className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Marque / Modèle</label>
          <input value={form.marqueModele ?? ''} onChange={e => set('marqueModele', e.target.value)}
            className="w-full border rounded px-3 py-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date d'acquisition *</label>
            <input required type="date" value={form.dateAcquisition}
              onChange={e => set('dateAcquisition', e.target.value)}
              className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Prix d'achat *</label>
            <input required type="number" min={0} value={form.prixAchat}
              onChange={e => set('prixAchat', Number(e.target.value))}
              className="w-full border rounded px-3 py-2" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Affectation *</label>
          <div className="flex gap-3 mb-2">
            <label className="flex items-center gap-1 text-sm">
              <input type="radio" checked={affectationMode === 'liste'} onChange={() => setAffectationMode('liste')} />
              Depuis la liste
            </label>
            <label className="flex items-center gap-1 text-sm">
              <input type="radio" checked={affectationMode === 'libre'} onChange={() => setAffectationMode('libre')} />
              Saisie libre
            </label>
          </div>
          {affectationMode === 'liste' ? (
            <select value={form.affectation?.id ?? ''}
              onChange={e => set('affectation', affectations.find(a => a.id === Number(e.target.value)))}
              className="w-full border rounded px-3 py-2">
              <option value="">-- Choisir --</option>
              {affectations.map(a => <option key={a.id} value={a.id}>{a.libelle}</option>)}
            </select>
          ) : (
            <input value={form.affectationLibre ?? ''} onChange={e => set('affectationLibre', e.target.value)}
              placeholder="Ex: Atelier B, Bureau RH..." className="w-full border rounded px-3 py-2" />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">État du matériel *</label>
          <select required value={form.etatMateriel} onChange={e => set('etatMateriel', e.target.value as EtatMateriel)}
            className="w-full border rounded px-3 py-2">
            {ETATS.map(e => <option key={e} value={e}>{ETAT_LABELS[e]}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Observations</label>
          <textarea value={form.observations ?? ''} onChange={e => set('observations', e.target.value)}
            rows={3} className="w-full border rounded px-3 py-2" />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={() => navigate('/inventaire')}
            className="px-4 py-2 border rounded hover:bg-gray-50">Annuler</button>
          <button type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            {isEdit ? 'Enregistrer' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  )
}
