import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { familleApi } from '../../api/stockApi'

function FieldError({ msg }: { msg?: string }) {
  return msg ? <p className="text-red-500 text-xs mt-1">{msg}</p> : null
}

function fieldCls(error?: string) {
  return `w-full border rounded px-3 py-2 ${error ? 'border-red-500' : 'border-gray-300'}`
}

export default function FamilleForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [code, setCode] = useState('')
  const [libelle, setLibelle] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isEdit) {
      familleApi.findAll().then(list => {
        const f = list.find(x => x.id === Number(id))
        if (f) { setCode(f.code); setLibelle(f.libelle); setDescription(f.description || '') }
      })
    }
  }, [id, isEdit])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!code.trim()) errs.code = 'Le code est obligatoire'
    else if (code.trim().length > 10) errs.code = 'Maximum 10 caractères'
    if (!libelle.trim()) errs.libelle = 'Le libellé est obligatoire'
    else if (libelle.trim().length < 2) errs.libelle = 'Minimum 2 caractères'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      const data = { code: code.trim().toUpperCase(), libelle: libelle.trim(), description }
      if (isEdit) await familleApi.update(Number(id), data)
      else await familleApi.create(data)
      navigate('/familles')
    } catch {
      setErrors({ _global: 'Erreur lors de la sauvegarde' })
      setSaving(false)
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? 'Modifier' : 'Nouvelle'} famille</h1>
      {errors._global && <p className="mb-4 text-red-600 bg-red-50 p-3 rounded">{errors._global}</p>}
      <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Code * <span className="text-gray-400 font-normal">(max 10 car.)</span></label>
          <input value={code} onChange={e => { setCode(e.target.value); setErrors(p => ({ ...p, code: '' })) }}
            className={fieldCls(errors.code)} placeholder="ex: INFO" />
          <FieldError msg={errors.code} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Libellé *</label>
          <input value={libelle} onChange={e => { setLibelle(e.target.value); setErrors(p => ({ ...p, libelle: '' })) }}
            className={fieldCls(errors.libelle)} />
          <FieldError msg={errors.libelle} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2" />
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
          <button type="button" onClick={() => navigate('/familles')}
            className="px-5 py-2 border border-gray-300 rounded hover:bg-gray-50">Annuler</button>
        </div>
      </form>
    </div>
  )
}
