import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { gradeApi } from '../../api/stockApi'

export default function GradeForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [libelle, setLibelle] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isEdit) {
      gradeApi.findAll().then(list => {
        const g = list.find(x => x.id === Number(id))
        if (g) setLibelle(g.libelle)
      })
    }
  }, [id, isEdit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!libelle.trim()) { setError('Le libellé est obligatoire'); return }
    setSaving(true)
    try {
      if (isEdit) await gradeApi.update(Number(id), { libelle: libelle.trim() })
      else await gradeApi.create({ libelle: libelle.trim() })
      navigate('/grades')
    } catch {
      setError('Erreur lors de la sauvegarde')
      setSaving(false)
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? 'Modifier' : 'Nouveau'} grade</h1>
      {error && <p className="mb-4 text-red-600 bg-red-50 p-3 rounded">{error}</p>}
      <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Libellé *</label>
          <input value={libelle} onChange={e => { setLibelle(e.target.value); setError('') }}
            className={`w-full border rounded px-3 py-2 ${error ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="ex: Sous-Directeur" />
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
          <button type="button" onClick={() => navigate('/grades')}
            className="px-5 py-2 border border-gray-300 rounded hover:bg-gray-50">Annuler</button>
        </div>
      </form>
    </div>
  )
}
