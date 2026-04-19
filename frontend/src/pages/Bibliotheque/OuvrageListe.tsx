import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ouvrageApi } from '../../api/bibliothequeApi'
import type { Domaine, Ouvrage } from '../../types/bibliotheque'
import { DOMAINE_BADGE, DOMAINES } from '../../types/bibliotheque'

export default function OuvrageListe() {
  const navigate = useNavigate()
  const [ouvrages, setOuvrages] = useState<Ouvrage[]>([])
  const [filtreDomaine, setFiltreDomaine] = useState<Domaine | ''>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    ouvrageApi.findAll().then(setOuvrages).catch(() => setError('Erreur chargement')).finally(() => setLoading(false))
  }, [])

  const telecharger = (blob: Blob, nom: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = nom; a.click()
    URL.revokeObjectURL(url)
  }

  const affiches = filtreDomaine ? ouvrages.filter(o => o.domaine === filtreDomaine) : ouvrages

  if (loading) return <p className="p-6">Chargement…</p>
  if (error) return <p className="p-6 text-red-600">{error}</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Registre des ouvrages</h1>
        <div className="flex gap-2">
          <button onClick={() => navigate('/ouvrages/nouveau')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Nouvel ouvrage</button>
          <button onClick={() => ouvrageApi.exportPdf().then(b => telecharger(b, 'ouvrages.pdf'))}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">PDF</button>
          <button onClick={() => ouvrageApi.exportExcel().then(b => telecharger(b, 'ouvrages.xlsx'))}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Excel</button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Filtrer par domaine :</label>
        <select value={filtreDomaine} onChange={e => setFiltreDomaine(e.target.value as Domaine | '')}
          className="border rounded px-3 py-1.5 text-sm">
          <option value="">Tous</option>
          {DOMAINES.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">N° Ouvrage</th>
              <th className="px-4 py-2 text-left">Titre</th>
              <th className="px-4 py-2 text-left">Auteur</th>
              <th className="px-4 py-2 text-left">Domaine</th>
              <th className="px-4 py-2 text-left">Éditeur</th>
              <th className="px-4 py-2 text-left">Année</th>
              <th className="px-4 py-2 text-left">Localisation</th>
              <th className="px-4 py-2 text-left">Exemplaires</th>
            </tr>
          </thead>
          <tbody>
            {affiches.map(o => (
              <tr key={o.id} className="border-t hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/ouvrages/${o.id}`)}>
                <td className="px-4 py-2 font-mono">{o.numeroOuvrage}</td>
                <td className="px-4 py-2 font-medium">{o.titre}</td>
                <td className="px-4 py-2">{o.auteur}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${DOMAINE_BADGE[o.domaine]}`}>
                    {o.domaine}
                  </span>
                </td>
                <td className="px-4 py-2">{o.editeur || '—'}</td>
                <td className="px-4 py-2">{o.anneePublication || '—'}</td>
                <td className="px-4 py-2">{o.localisation || '—'}</td>
                <td className="px-4 py-2 text-center">{o.nbreExemplaires}</td>
              </tr>
            ))}
            {affiches.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-6 text-center text-gray-400">Aucun ouvrage</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
