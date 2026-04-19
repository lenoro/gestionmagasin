import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { produitApi, familleApi, uniteApi, fournisseurApi } from '../../api/stockApi'
import type { Famille, Unite, Fournisseur, Produit } from '../../types/stock'

function FieldError({ msg }: { msg?: string }) {
  return msg ? <p className="text-red-500 text-xs mt-1">{msg}</p> : null
}

function fieldCls(error?: string) {
  return `w-full border rounded px-3 py-2 ${error ? 'border-red-500' : 'border-gray-300'}`
}

export default function ProduitForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [familles, setFamilles] = useState<Famille[]>([])
  const [unites, setUnites] = useState<Unite[]>([])
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([])

  const [reference, setReference] = useState('')
  const [designation, setDesignation] = useState('')
  const [description, setDescription] = useState('')
  const [familleId, setFamilleId] = useState<number | ''>('')
  const [uniteId, setUniteId] = useState<number | ''>('')
  const [fournisseurId, setFournisseurId] = useState<number | ''>('')
  const [prixUnitaire, setPrixUnitaire] = useState(0)
  const [prixAchatMoyen, setPrixAchatMoyen] = useState(0)
  const [stockMinimum, setStockMinimum] = useState(0)
  const [stockMaximum, setStockMaximum] = useState(0)
  const [emplacement, setEmplacement] = useState('')
  const [categorie, setCategorie] = useState('')
  const [actif, setActif] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    Promise.all([familleApi.findAll(), uniteApi.findAll(), fournisseurApi.findAll()])
      .then(([f, u, fo]) => { setFamilles(f); setUnites(u); setFournisseurs(fo) })

    if (isEdit) {
      produitApi.findAll().then(list => {
        const p = list.find(x => x.id === Number(id))
        if (p) {
          setReference(p.reference || '')
          setDesignation(p.designation)
          setDescription(p.description || '')
          setFamilleId(p.famille?.id ?? '')
          setUniteId(p.unite?.id ?? '')
          setFournisseurId(p.fournisseurPrefere?.id ?? '')
          setPrixUnitaire(p.prixUnitaire ?? 0)
          setPrixAchatMoyen(p.prixAchatMoyen ?? 0)
          setStockMinimum(p.stockMinimum ?? 0)
          setStockMaximum(p.stockMaximum ?? 0)
          setEmplacement(p.emplacement || '')
          setCategorie(p.categorie || '')
          setActif(p.actif !== false)
        }
      })
    }
  }, [id, isEdit])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!designation.trim()) errs.designation = 'La désignation est obligatoire'
    else if (designation.trim().length < 2) errs.designation = 'Minimum 2 caractères'
    if (prixUnitaire < 0) errs.prixUnitaire = 'Le prix doit être ≥ 0'
    if (prixAchatMoyen < 0) errs.prixAchatMoyen = 'Le prix doit être ≥ 0'
    if (stockMinimum < 0) errs.stockMinimum = 'Le stock doit être ≥ 0'
    if (stockMaximum < 0) errs.stockMaximum = 'Le stock doit être ≥ 0'
    else if (stockMaximum > 0 && stockMaximum < stockMinimum) errs.stockMaximum = 'Doit être ≥ stock minimum'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      const data = {
        reference, designation: designation.trim(), description,
        famille: familleId ? { id: Number(familleId) } : undefined,
        unite: uniteId ? { id: Number(uniteId) } : undefined,
        fournisseurPrefere: fournisseurId ? { id: Number(fournisseurId) } : undefined,
        prixUnitaire, prixAchatMoyen, stockMinimum, stockMaximum,
        emplacement, categorie, actif,
      }
      if (isEdit) await produitApi.update(Number(id), data as unknown as Produit)
      else await produitApi.create(data as unknown as Produit)
      navigate('/produits')
    } catch {
      setErrors({ _global: 'Erreur lors de la sauvegarde' })
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? 'Modifier' : 'Nouveau'} produit</h1>
      {errors._global && <p className="mb-4 text-red-600 bg-red-50 p-3 rounded">{errors._global}</p>}
      <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Référence</label>
            <input value={reference} onChange={e => setReference(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Désignation *</label>
            <input value={designation} onChange={e => { setDesignation(e.target.value); setErrors(p => ({ ...p, designation: '' })) }}
              className={fieldCls(errors.designation)} />
            <FieldError msg={errors.designation} />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2}
              className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Famille</label>
            <select value={familleId} onChange={e => setFamilleId(e.target.value ? Number(e.target.value) : '')}
              className="w-full border border-gray-300 rounded px-3 py-2">
              <option value="">— Aucune —</option>
              {familles.map(f => <option key={f.id} value={f.id}>{f.libelle}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unité</label>
            <select value={uniteId} onChange={e => setUniteId(e.target.value ? Number(e.target.value) : '')}
              className="w-full border border-gray-300 rounded px-3 py-2">
              <option value="">— Aucune —</option>
              {unites.map(u => <option key={u.id} value={u.id}>{u.libelle}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur préféré</label>
            <select value={fournisseurId} onChange={e => setFournisseurId(e.target.value ? Number(e.target.value) : '')}
              className="w-full border border-gray-300 rounded px-3 py-2">
              <option value="">— Aucun —</option>
              {fournisseurs.map(f => <option key={f.id} value={f.id}>{f.raisonSociale}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prix unitaire</label>
            <input type="number" step="0.01" min="0" value={prixUnitaire}
              onChange={e => { setPrixUnitaire(Number(e.target.value)); setErrors(p => ({ ...p, prixUnitaire: '' })) }}
              className={fieldCls(errors.prixUnitaire)} />
            <FieldError msg={errors.prixUnitaire} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prix achat moyen</label>
            <input type="number" step="0.01" min="0" value={prixAchatMoyen}
              onChange={e => { setPrixAchatMoyen(Number(e.target.value)); setErrors(p => ({ ...p, prixAchatMoyen: '' })) }}
              className={fieldCls(errors.prixAchatMoyen)} />
            <FieldError msg={errors.prixAchatMoyen} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock minimum</label>
            <input type="number" min="0" value={stockMinimum}
              onChange={e => { setStockMinimum(Number(e.target.value)); setErrors(p => ({ ...p, stockMinimum: '' })) }}
              className={fieldCls(errors.stockMinimum)} />
            <FieldError msg={errors.stockMinimum} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock maximum</label>
            <input type="number" min="0" value={stockMaximum}
              onChange={e => { setStockMaximum(Number(e.target.value)); setErrors(p => ({ ...p, stockMaximum: '' })) }}
              className={fieldCls(errors.stockMaximum)} />
            <FieldError msg={errors.stockMaximum} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Emplacement</label>
            <input value={emplacement} onChange={e => setEmplacement(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <input value={categorie} onChange={e => setCategorie(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="actif" checked={actif} onChange={e => setActif(e.target.checked)}
            className="w-4 h-4" />
          <label htmlFor="actif" className="text-sm text-gray-700">Actif</label>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
          <button type="button" onClick={() => navigate('/produits')}
            className="px-5 py-2 border border-gray-300 rounded hover:bg-gray-50">Annuler</button>
        </div>
      </form>
    </div>
  )
}
