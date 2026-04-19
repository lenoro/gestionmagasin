import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { employeApiV2, gradeApi, fonctionApi, serviceRefApi } from '../../api/stockApi'
import type { Grade, FonctionRef, ServiceRef } from '../../types/stock'

function FieldError({ msg }: { msg?: string }) {
  return msg ? <p className="text-red-500 text-xs mt-1">{msg}</p> : null
}

function fieldCls(error?: string) {
  return `w-full border rounded px-3 py-2 ${error ? 'border-red-500' : 'border-gray-300'}`
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function EmployeForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [matricule, setMatricule] = useState('')
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [grade, setGrade] = useState('')
  const [fonction, setFonction] = useState('')
  const [service, setService] = useState('')
  const [telephone, setTelephone] = useState('')
  const [email, setEmail] = useState('')
  const [actif, setActif] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [grades, setGrades] = useState<Grade[]>([])
  const [fonctions, setFonctions] = useState<FonctionRef[]>([])
  const [services, setServices] = useState<ServiceRef[]>([])

  useEffect(() => {
    gradeApi.findAll().then(setGrades).catch(() => {})
    fonctionApi.findAll().then(setFonctions).catch(() => {})
    serviceRefApi.findAll().then(setServices).catch(() => {})
  }, [])

  useEffect(() => {
    if (isEdit) {
      employeApiV2.findAll().then(list => {
        const e = list.find(x => x.id === Number(id))
        if (e) {
          setMatricule(e.matricule || ''); setNom(e.nom); setPrenom(e.prenom || '')
          setGrade(e.grade || ''); setFonction(e.fonction || ''); setService(e.service || '')
          setTelephone(e.telephone || ''); setEmail(e.email || ''); setActif(e.actif !== false)
        }
      })
    }
  }, [id, isEdit])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!nom.trim()) errs.nom = 'Le nom est obligatoire'
    else if (nom.trim().length < 2) errs.nom = 'Minimum 2 caractères'
    if (telephone && !/^[\d\s+\-().]{5,20}$/.test(telephone)) errs.telephone = 'Numéro invalide'
    if (email && !emailRegex.test(email)) errs.email = 'Email invalide'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      const data = {
        matricule: matricule || undefined,
        nom: nom.trim(),
        prenom: prenom || undefined,
        grade: grade || undefined,
        fonction: fonction || undefined,
        service: service || undefined,
        telephone: telephone || undefined,
        email: email || undefined,
        actif
      }
      if (isEdit) await employeApiV2.update(Number(id), data)
      else await employeApiV2.create(data)
      navigate('/employes')
    } catch {
      setErrors({ _global: 'Erreur lors de la sauvegarde' })
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? 'Modifier' : 'Nouvel'} employé</h1>
      {errors._global && <p className="mb-4 text-red-600 bg-red-50 p-3 rounded">{errors._global}</p>}
      <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Matricule</label>
            <input value={matricule} onChange={e => setMatricule(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
          <div></div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input value={nom} onChange={e => { setNom(e.target.value); setErrors(p => ({ ...p, nom: '' })) }}
              className={fieldCls(errors.nom)} />
            <FieldError msg={errors.nom} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <input value={prenom} onChange={e => setPrenom(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
            <select value={grade} onChange={e => setGrade(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2">
              <option value="">— Sélectionner —</option>
              {grades.map(g => (
                <option key={g.id} value={g.libelle}>{g.libelle}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fonction</label>
            <select value={fonction} onChange={e => setFonction(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2">
              <option value="">— Sélectionner —</option>
              {fonctions.map(f => (
                <option key={f.id} value={f.libelle}>{f.libelle}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
            <select value={service} onChange={e => setService(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2">
              <option value="">— Sélectionner —</option>
              {services.map(s => (
                <option key={s.id} value={s.libelle}>{s.libelle}</option>
              ))}
            </select>
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
              className={fieldCls(errors.email)} placeholder="nom@exemple.com" />
            <FieldError msg={errors.email} />
          </div>
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
          <button type="button" onClick={() => navigate('/employes')}
            className="px-5 py-2 border border-gray-300 rounded hover:bg-gray-50">Annuler</button>
        </div>
      </form>
    </div>
  )
}
