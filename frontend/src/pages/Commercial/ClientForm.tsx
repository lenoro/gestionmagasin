import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { clientApi } from '../../api/commercialApi'

function FieldError({ msg }: { msg?: string }) {
  return msg ? <p className="text-red-500 text-xs mt-1">{msg}</p> : null
}

function fieldCls(error?: string) {
  return `w-full border rounded px-3 py-2 ${error ? 'border-red-500' : 'border-gray-300'}`
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ClientForm() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [clientName, setClientName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  useEffect(() => {
    if (isEdit) {
      clientApi.findById(Number(id)).then(c => {
        setClientName(c.clientName)
        setEmail(c.email ?? '')
        setPhone(c.phone ?? '')
        setAddress(c.address ?? '')
      })
    }
  }, [id, isEdit])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!clientName.trim()) errs.clientName = 'Le nom est obligatoire'
    else if (clientName.trim().length < 2) errs.clientName = 'Minimum 2 caractères'
    if (email && !emailRegex.test(email)) errs.email = 'Adresse email invalide'
    if (phone && !/^[\d\s+\-().]{5,20}$/.test(phone)) errs.phone = 'Numéro de téléphone invalide'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      const client = { clientName: clientName.trim(), email: email || undefined, phone: phone || undefined, address: address || undefined }
      if (isEdit) await clientApi.update(Number(id), client)
      else await clientApi.create(client)
      navigate('/clients')
    } catch {
      setErrors({ _global: 'Erreur lors de la sauvegarde' })
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? 'Modifier client' : 'Nouveau client'}</h1>
      {errors._global && <p className="mb-4 text-red-600 bg-red-50 p-3 rounded">{errors._global}</p>}
      <div className="bg-white rounded shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
          <input value={clientName} onChange={e => { setClientName(e.target.value); setErrors(p => ({ ...p, clientName: '' })) }}
            className={fieldCls(errors.clientName)} />
          <FieldError msg={errors.clientName} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="text" value={email} onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }}
            className={fieldCls(errors.email)} placeholder="exemple@domaine.com" />
          <FieldError msg={errors.email} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
          <input value={phone} onChange={e => { setPhone(e.target.value); setErrors(p => ({ ...p, phone: '' })) }}
            className={fieldCls(errors.phone)} placeholder="0555 123 456" />
          <FieldError msg={errors.phone} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
          <textarea value={address} onChange={e => setAddress(e.target.value)}
            rows={2} className="w-full border border-gray-300 rounded px-3 py-2" />
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        <button type="submit" disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
          {saving ? 'Enregistrement…' : (isEdit ? 'Enregistrer' : 'Créer')}
        </button>
        <button type="button" onClick={() => navigate('/clients')}
          className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50">Annuler</button>
      </div>
    </form>
  )
}
