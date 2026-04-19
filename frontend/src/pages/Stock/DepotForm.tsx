import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { depotApi } from '../../api/stockApi'

function FieldError({ msg }: { msg?: string }) {
  return msg ? <p className="text-red-500 text-xs mt-1">{msg}</p> : null
}

function fieldCls(error?: string) {
  return `w-full border rounded px-3 py-2 ${error ? 'border-red-500' : 'border-gray-300'}`
}

export default function DepotForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [code, setCode] = useState('')
  const [libelle, setLibelle] = useState('')
  const [adresse, setAdresse] = useState('')
  const [responsable, setResponsable] = useState('')
  const [actif, setActif] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isEdit) {
      depotApi.findAll().then(list => {
        const d = list.find(x => x.id === Number(id))
        if (d) {
          setCode(d.code || ''); setLibelle(d.libelle)
          setAdresse(d.adresse || ''); setResponsable(d.responsable || '')
          setActif(d.actif !== false)
        }
      })
    }
  }, [id, isEdit])

  const validate = () => {
    const errs: Record<string, string> = {}
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
      const data = { code: code.trim() || undefined, libelle: libelle.trim(), adresse: adresse || undefined, responsable: responsable || undefined, actif }
      if (isEdit) await depotApi.update(Number(id), data)
      else await depotApi.create(data)
      navigate('/depots')
    } catch {
      setErrors({ _global: 'Erreur lors de la sauvegarde' })
      setSaving(false)
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? 'Modifier' : 'Nouveau'} dépôt</h1>
      {errors._global && <p className="mb-4 text-red-600 bg-red-50 p-3 rounded">{errors._global}</p>}
      <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
            <input value={code} onChange={e => setCode(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2" placeholder="ex: DEP01" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Libellé *</label>
            <input value={libelle} onChange={e => { setLibelle(e.target.value); setErrors(p => ({ ...p, libelle: '' })) }}
              className={fieldCls(errors.libelle)} />
            <FieldError msg={errors.libelle} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
          <input value={adresse} onChange={e => setAdresse(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
          <input value={responsable} onChange={e => setResponsable(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="actif" checked={actif} onChange={e => setActif(e.target.checked)} className="w-4 h-4" />
          <label htmlFor="actif" className="text-sm text-gray-700">Actif</label>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
          <button type="button" onClick={() => navigate('/depots')}
            className="px-5 py-2 border border-gray-300 rounded hover:bg-gray-50">Annuler</button>
        </div>
      </form>
    </div>
  )
}
