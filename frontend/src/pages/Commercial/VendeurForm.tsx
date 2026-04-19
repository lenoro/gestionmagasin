import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { vendeurApi } from '../../api/commercialApi'

function FieldError({ msg }: { msg?: string }) {
  return msg ? <p className="text-red-500 text-xs mt-1">{msg}</p> : null
}

function fieldCls(error?: string) {
  return `w-full border rounded px-3 py-2 ${error ? 'border-red-500' : 'border-gray-300'}`
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function VendeurForm() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [vendorName, setVendorName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    if (isEdit) {
      vendeurApi.findById(Number(id)).then(v => {
        setVendorName(v.vendorName)
        setContactEmail(v.contactEmail ?? '')
        setPhone(v.phone ?? '')
      })
    }
  }, [id, isEdit])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!vendorName.trim()) errs.vendorName = 'Le nom est obligatoire'
    else if (vendorName.trim().length < 2) errs.vendorName = 'Minimum 2 caractères'
    if (contactEmail && !emailRegex.test(contactEmail)) errs.contactEmail = 'Adresse email invalide'
    if (phone && !/^[\d\s+\-().]{5,20}$/.test(phone)) errs.phone = 'Numéro de téléphone invalide'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      const vendeur = { vendorName: vendorName.trim(), contactEmail: contactEmail || undefined, phone: phone || undefined }
      if (isEdit) await vendeurApi.update(Number(id), vendeur)
      else await vendeurApi.create(vendeur)
      navigate('/vendeurs')
    } catch {
      setErrors({ _global: 'Erreur lors de la sauvegarde' })
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? 'Modifier vendeur' : 'Nouveau vendeur'}</h1>
      {errors._global && <p className="mb-4 text-red-600 bg-red-50 p-3 rounded">{errors._global}</p>}
      <div className="bg-white rounded shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
          <input value={vendorName} onChange={e => { setVendorName(e.target.value); setErrors(p => ({ ...p, vendorName: '' })) }}
            className={fieldCls(errors.vendorName)} />
          <FieldError msg={errors.vendorName} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="text" value={contactEmail} onChange={e => { setContactEmail(e.target.value); setErrors(p => ({ ...p, contactEmail: '' })) }}
            className={fieldCls(errors.contactEmail)} placeholder="exemple@domaine.com" />
          <FieldError msg={errors.contactEmail} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
          <input value={phone} onChange={e => { setPhone(e.target.value); setErrors(p => ({ ...p, phone: '' })) }}
            className={fieldCls(errors.phone)} placeholder="0555 123 456" />
          <FieldError msg={errors.phone} />
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        <button type="submit" disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
          {saving ? 'Enregistrement…' : (isEdit ? 'Enregistrer' : 'Créer')}
        </button>
        <button type="button" onClick={() => navigate('/vendeurs')}
          className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50">Annuler</button>
      </div>
    </form>
  )
}
