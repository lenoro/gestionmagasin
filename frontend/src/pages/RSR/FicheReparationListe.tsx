import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { rsrApi } from '../../api/rsrApi'
import type { FicheReparation, StatutReparation } from '../../types/rsr'

const STATUT_BADGE: Record<StatutReparation, string> = {
  EN_ATTENTE: 'bg-yellow-100 text-yellow-800',
  ENVOYE_ATELIER: 'bg-blue-100 text-blue-800',
  RETOURNE: 'bg-purple-100 text-purple-800',
  CLOS: 'bg-green-100 text-green-800',
}

export default function FicheReparationListe() {
  const navigate = useNavigate()
  const [fiches, setFiches] = useState<FicheReparation[]>([])
  const [filtre, setFiltre] = useState<StatutReparation | ''>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    rsrApi.findAll()
      .then(setFiches)
      .catch(() => setError('Erreur de chargement'))
      .finally(() => setLoading(false))
  }, [])

  const filtrees = filtre ? fiches.filter(f => f.statut === filtre) : fiches

  const handleWorkflow = async (id: number, action: 'envoyer' | 'retourner' | 'clore') => {
    try {
      const updated = await rsrApi[action](id)
      setFiches(prev => prev.map(f => f.id === id ? updated : f))
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Erreur')
    }
  }

  const telecharger = (blob: Blob, nom: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = nom; a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <p className="p-6">Chargement…</p>
  if (error) return <p className="p-6 text-red-600">{error}</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">RSR — Fiches de réparation</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/fiches-reparation/nouveau')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Nouvelle fiche
          </button>
          <button
            onClick={() => rsrApi.exportPdf().then(b => telecharger(b, 'fiches-reparation.pdf'))}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            PDF
          </button>
          <button
            onClick={() => rsrApi.exportExcel().then(b => telecharger(b, 'fiches-reparation.xlsx'))}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Excel
          </button>
        </div>
      </div>

      <div className="mb-3">
        <select
          value={filtre}
          onChange={e => setFiltre(e.target.value as StatutReparation | '')}
          className="border rounded px-3 py-1 text-sm"
        >
          <option value="">Tous les statuts</option>
          <option value="EN_ATTENTE">EN_ATTENTE</option>
          <option value="ENVOYE_ATELIER">ENVOYE_ATELIER</option>
          <option value="RETOURNE">RETOURNE</option>
          <option value="CLOS">CLOS</option>
        </select>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">N° Fiche</th>
              <th className="px-4 py-2 text-left">Bien</th>
              <th className="px-4 py-2 text-left">Motif</th>
              <th className="px-4 py-2 text-left">Réparateur</th>
              <th className="px-4 py-2 text-left">Statut</th>
              <th className="px-4 py-2 text-left">Date envoi</th>
              <th className="px-4 py-2 text-left">Date retour</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtrees.map(f => (
              <tr
                key={f.id}
                className="border-t hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/fiches-reparation/${f.id}`)}
              >
                <td className="px-4 py-2 font-mono">{f.numeroFiche}</td>
                <td className="px-4 py-2">{f.bien.designation}</td>
                <td className="px-4 py-2">{f.motif}</td>
                <td className="px-4 py-2">{f.reparateur || '—'}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUT_BADGE[f.statut!]}`}>
                    {f.statut}
                  </span>
                </td>
                <td className="px-4 py-2">{f.dateEnvoi || '—'}</td>
                <td className="px-4 py-2">{f.dateRetour || '—'}</td>
                <td className="px-4 py-2" onClick={e => e.stopPropagation()}>
                  {f.statut === 'EN_ATTENTE' && (
                    <button
                      onClick={() => handleWorkflow(f.id!, 'envoyer')}
                      className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                    >Envoyer</button>
                  )}
                  {f.statut === 'ENVOYE_ATELIER' && (
                    <button
                      onClick={() => handleWorkflow(f.id!, 'retourner')}
                      className="px-2 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600"
                    >Retourner</button>
                  )}
                  {f.statut === 'RETOURNE' && (
                    <button
                      onClick={() => handleWorkflow(f.id!, 'clore')}
                      className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                    >Clore</button>
                  )}
                </td>
              </tr>
            ))}
            {filtrees.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-gray-400">Aucune fiche</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
