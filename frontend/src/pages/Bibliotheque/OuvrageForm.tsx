import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ouvrageApi } from '../../api/bibliothequeApi'
import type { Domaine, Ouvrage } from '../../types/bibliotheque'
import { DOMAINES } from '../../types/bibliotheque'

export default function OuvrageForm() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [titre, setTitre] = useState('')
  const [auteur, setAuteur] = useState('')
  const [isbn, setIsbn] = useState('')
  const [editeur, setEditeur] = useState('')
  const [domaine, setDomaine] = useState<Domaine>('INFORMATIQUE')
  const [anneePublication, setAnneePublication] = useState('')
  const [localisation, setLocalisation] = useState('')
  const [nbreExemplaires, setNbreExemplaires] = useState('1')

  useEffect(() => {
    if (isEdit) {
      ouvrageApi.findById(Number(id)).then(o => {
        setTitre(o.titre)
        setAuteur(o.auteur)
        setIsbn(o.isbn ?? '')
        setEditeur(o.editeur ?? '')
        setDomaine(o.domaine)
        setAnneePublication(o.anneePublication?.toString() ?? '')
        setLocalisation(o.localisation ?? '')
        setNbreExemplaires(o.nbreExemplaires?.toString() ?? '1')
      }).catch(() => setError('Ouvrage introuvable'))
    }
  }, [id, isEdit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      const ouvrage: Ouvrage = {
        titre, auteur,
        isbn: isbn || undefined,
        editeur: editeur || undefined,
        domaine,
        anneePublication: anneePublication ? parseInt(anneePublication) : null,
        localisation: localisation || undefined,
        nbreExemplaires: parseInt(nbreExemplaires) || 1,
      }
      if (isEdit) {
        await ouvrageApi.update(Number(id), ouvrage)
        navigate(`/ouvrages/${id}`)
      } else {
        const created = await ouvrageApi.create(ouvrage)
        navigate(`/ouvrages/${created.id}`)
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEdit ? "Modifier l'ouvrage" : 'Nouvel ouvrage'}
      </h1>
      {error && <p className="mb-4 text-red-600 bg-red-50 p-3 rounded">{error}</p>}
      <div className="bg-white rounded shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
          <input value={titre} onChange={e => setTitre(e.target.value)}
            className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Auteur *</label>
          <input value={auteur} onChange={e => setAuteur(e.target.value)}
            className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Domaine *</label>
          <select value={domaine} onChange={e => setDomaine(e.target.value as Domaine)}
            className="w-full border rounded px-3 py-2" required>
            {DOMAINES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
          <input value={isbn} onChange={e => setIsbn(e.target.value)}
            className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Éditeur</label>
          <input value={editeur} onChange={e => setEditeur(e.target.value)}
            className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Année de publication</label>
          <input type="number" min="1800" max="2100" value={anneePublication}
            onChange={e => setAnneePublication(e.target.value)}
            className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Localisation (étagère)</label>
          <input value={localisation} onChange={e => setLocalisation(e.target.value)}
            className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre d'exemplaires *</label>
          <input type="number" min="1" value={nbreExemplaires}
            onChange={e => setNbreExemplaires(e.target.value)}
            className="w-full border rounded px-3 py-2" required />
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        <button type="submit" disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
          {saving ? 'Enregistrement…' : (isEdit ? 'Enregistrer' : 'Créer')}
        </button>
        <button type="button"
          onClick={() => navigate(isEdit ? `/ouvrages/${id}` : '/ouvrages')}
          className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50">Annuler</button>
      </div>
    </form>
  )
}
