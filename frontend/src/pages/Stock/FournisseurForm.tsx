import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fournisseurApi } from '../../api/stockApi'

function FieldError({ msg }: { msg?: string }) {
  return msg ? <p className="text-red-500 text-xs mt-1">{msg}</p> : null
}

function fieldCls(error?: string) {
  return `w-full border rounded px-3 py-2 ${error ? 'border-red-500' : 'border-gray-300'}`
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function FournisseurForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [code, setCode] = useState('')
  const [raisonSociale, setRaisonSociale] = useState('')
  const [adresse, setAdresse] = useState('')
  const [ville, setVille] = useState('')
  const [telephone, setTelephone] = useState('')
  const [email, setEmail] = useState('')
  const [nif, setNif] = useState('')
  const [rc, setRc] = useState('')
  const [contactNom, setContactNom] = useState('')
  const [delaiPaiementJours, setDelaiPaiementJours] = useState(30)
  const [actif, setActif] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isEdit) {
      fournisseurApi.findAll().then(list => {
        const f = list.find(x => x.id === Number(id))
        if (f) {
          setCode(f.code || '')
          setRaisonSociale(f.raisonSociale)
          setAdresse(f.adresse || '')
          setVille(f.ville || '')
          setTelephone(f.telephone || '')
          setEmail(f.email || '')
          setNif(f.nif || '')
          setRc(f.rc || '')
          setContactNom(f.contactNom || '')
          setDelaiPaiementJours(f.delaiPaiementJours ?? 30)
          setActif(f.actif !== false)
        }
      })
    }
  }, [id, isEdit])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!raisonSociale.trim()) errs.raisonSociale = 'La raison sociale est obligatoire'
    else if (raisonSociale.trim().length < 2) errs.raisonSociale = 'Minimum 2 caractères'
    if (telephone && !/^[\d\s+\-().]{5,20}$/.test(telephone)) errs.telephone = 'Numéro invalide'
    if (email && !emailRegex.test(email)) errs.email = 'Email invalide'
    if (delaiPaiementJours < 0) errs.delaiPaiementJours = 'La valeur doit être ≥ 0'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      const data = { code, raisonSociale: raisonSociale.trim(), adresse, ville, telephone, email, nif, rc, contactNom, delaiPaiementJours, actif }
      if (isEdit) await fournisseurApi.update(Number(id), data)
      else await fournisseurApi.create(data)
      navigate('/fournisseurs')
    } catch {
      setErrors({ _global: 'Erreur lors de la sauvegarde' })
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? 'Modifier' : 'Nouveau'} fournisseur</h1>
      {errors._global && <p className="mb-4 text-red-600 bg-red-50 p-3 rounded">{errors._global}</p>}
      <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
            <input value={code} onChange={e => setCode(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Raison sociale *</label>
            <input value={raisonSociale} onChange={e => { setRaisonSociale(e.target.value); setErrors(p => ({ ...p, raisonSociale: '' })) }}
              className={fieldCls(errors.raisonSociale)} />
            <FieldError msg={errors.raisonSociale} />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <input value={adresse} onChange={e => setAdresse(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
            <input value={ville} onChange={e => setVille(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input value={telephone} onChange={e => { setTelephone(e.target.value); setErrors(p => ({ ...p, telephone: '' })) }}
              className={fieldCls(errors.telephone)} placeholder="0555 123 456" />
            <FieldError msg={errors.telephone} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input value={email} onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }}
              className={fieldCls(errors.email)} placeholder="contact@exemple.com" />
            <FieldError msg={errors.email} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
            <input value={contactNom} onChange={e => setContactNom(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NIF</label>
            <input value={nif} onChange={e => setNif(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">RC</label>
            <input value={rc} onChange={e => setRc(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Délai paiement (jours)</label>
            <input type="number" min="0" value={delaiPaiementJours}
              onChange={e => { setDelaiPaiementJours(Number(e.target.value)); setErrors(p => ({ ...p, delaiPaiementJours: '' })) }}
              className={fieldCls(errors.delaiPaiementJours)} />
            <FieldError msg={errors.delaiPaiementJours} />
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
          <button type="button" onClick={() => navigate('/fournisseurs')}
            className="px-5 py-2 border border-gray-300 rounded hover:bg-gray-50">Annuler</button>
        </div>
      </form>
    </div>
  )
}
