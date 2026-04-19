import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { rsrApi } from '../../api/rsrApi'
import type { FicheReparation, LigneFicheReparation } from '../../types/rsr'

interface BienOption { id: number; designation: string; numeroInventaire: string }
interface ArticleOption { id: number; articleCode: string; designation: string; stock: number; categorie: string }
interface ProduitOption { id: number; producerName: string }

export default function FicheReparationForm() {
  const navigate = useNavigate()
  const [biens, setBiens] = useState<BienOption[]>([])
  const [articles, setArticles] = useState<ArticleOption[]>([])
  const [produits, setProduits] = useState<ProduitOption[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [bienId, setBienId] = useState<number | ''>('')
  const [motif, setMotif] = useState('')
  const [reparateur, setReparateur] = useState('')
  const [fournisseurId, setFournisseurId] = useState<number | ''>('')
  const [coutReparation, setCoutReparation] = useState('')
  const [observations, setObservations] = useState('')
  const [lignes, setLignes] = useState<{ articleId: number | ''; quantite: number }[]>([])

  useEffect(() => {
    axios.get<BienOption[]>('http://localhost:8080/api/biens-inventaire').then(r => setBiens(r.data)).catch(() => {})
    axios.get<ArticleOption[]>('http://localhost:8080/api/articles')
      .then(r => setArticles(r.data.filter(a => a.categorie === 'CONSOMMABLE'))).catch(() => {})
    axios.get<ProduitOption[]>('http://localhost:8080/api/produits').then(r => setProduits(r.data)).catch(() => {})
  }, [])

  const ajouterLigne = () => setLignes(prev => [...prev, { articleId: '', quantite: 1 }])
  const supprimerLigne = (i: number) => setLignes(prev => prev.filter((_, idx) => idx !== i))
  const majLigne = (i: number, field: 'articleId' | 'quantite', val: number | '') =>
    setLignes(prev => prev.map((l, idx) => idx === i ? { ...l, [field]: val } : l))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bienId || !motif) { setError('Bien et motif sont obligatoires'); return }
    setSaving(true); setError('')
    try {
      const lignesValides: LigneFicheReparation[] = lignes
        .filter(l => l.articleId !== '')
        .map(l => ({
          article: articles.find(a => a.id === l.articleId)!,
          quantite: l.quantite,
        }))
      const fiche: FicheReparation = {
        bien: biens.find(b => b.id === bienId)!,
        motif,
        reparateur: reparateur || undefined,
        fournisseur: fournisseurId ? produits.find(p => p.id === fournisseurId) || null : null,
        coutReparation: coutReparation ? parseFloat(coutReparation) : null,
        observations: observations || undefined,
        lignes: lignesValides,
      }
      const created = await rsrApi.create(fiche)
      navigate(`/fiches-reparation/${created.id}`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur lors de la création')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Nouvelle fiche de réparation</h1>
      {error && <p className="mb-4 text-red-600 bg-red-50 p-3 rounded">{error}</p>}

      <div className="bg-white rounded shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bien inventaire <span className="text-red-500">*</span>
          </label>
          <select value={bienId} onChange={e => setBienId(e.target.value ? Number(e.target.value) : '')}
            className="w-full border rounded px-3 py-2" required>
            <option value="">-- Sélectionner un bien --</option>
            {biens.map(b => (
              <option key={b.id} value={b.id}>{b.numeroInventaire} — {b.designation}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Motif de la panne <span className="text-red-500">*</span>
          </label>
          <input type="text" value={motif} onChange={e => setMotif(e.target.value)}
            className="w-full border rounded px-3 py-2" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Réparateur (technicien interne)</label>
          <input type="text" value={reparateur} onChange={e => setReparateur(e.target.value)}
            className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur / Prestataire externe</label>
          <select value={fournisseurId} onChange={e => setFournisseurId(e.target.value ? Number(e.target.value) : '')}
            className="w-full border rounded px-3 py-2">
            <option value="">-- Aucun --</option>
            {produits.map(p => <option key={p.id} value={p.id}>{p.producerName}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Coût de réparation estimé (DA)</label>
          <input type="number" step="0.01" value={coutReparation} onChange={e => setCoutReparation(e.target.value)}
            className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Observations</label>
          <textarea value={observations} onChange={e => setObservations(e.target.value)}
            rows={3} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Pièces de rechange (CONSOMMABLE)</label>
            <button type="button" onClick={ajouterLigne}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
              + Ajouter ligne
            </button>
          </div>
          {lignes.length > 0 && (
            <table className="w-full text-sm border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left border">Article</th>
                  <th className="px-3 py-2 text-left border w-32">Quantité</th>
                  <th className="px-3 py-2 w-10 border"></th>
                </tr>
              </thead>
              <tbody>
                {lignes.map((l, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-3 py-1 border">
                      <select value={l.articleId}
                        onChange={e => majLigne(i, 'articleId', e.target.value ? Number(e.target.value) : '')}
                        className="w-full border-0 focus:outline-none">
                        <option value="">-- Article --</option>
                        {articles.map(a => (
                          <option key={a.id} value={a.id}>
                            {a.articleCode} — {a.designation} (stock: {a.stock})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-1 border">
                      <input type="number" min={1} value={l.quantite}
                        onChange={e => majLigne(i, 'quantite', Number(e.target.value))}
                        className="w-full border-0 focus:outline-none" />
                    </td>
                    <td className="px-2 py-1 border text-center">
                      <button type="button" onClick={() => supprimerLigne(i)}
                        className="text-red-500 hover:text-red-700">✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button type="submit" disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
        <button type="button" onClick={() => navigate('/fiches-reparation')}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
          Annuler
        </button>
      </div>
    </form>
  )
}
