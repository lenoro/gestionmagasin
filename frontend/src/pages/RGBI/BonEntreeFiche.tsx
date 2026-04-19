import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { bonEntreeApi } from '../../api/rgbiApi'
import type { BonEntree } from '../../types/rgbi'

export default function BonEntreeFiche() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [bon, setBon] = useState<BonEntree | null>(null)
  const [error, setError] = useState('')

  function load() { bonEntreeApi.findById(Number(id)).then(setBon) }
  useEffect(() => { load() }, [id])

  if (!bon) return <p>Chargement...</p>

  async function handleValider() {
    try {
      await bonEntreeApi.valider(Number(id))
      load()
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Erreur")
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Bon d'entrée</h1>
          <p className="text-gray-500 font-mono">{bon.numeroBon}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => bonEntreeApi.imprimer(Number(id))}
            className="border px-4 py-2 rounded hover:bg-gray-50">Imprimer</button>
          {bon.statut === 'BROUILLON' && (
            <button onClick={handleValider}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Valider</button>
          )}
        </div>
      </div>

      <div className="bg-white shadow rounded p-6 grid grid-cols-2 gap-4 text-sm">
        <div><span className="font-medium">Type :</span> {bon.typeBon.replace('_', ' ')}</div>
        <div><span className="font-medium">Date :</span> {bon.dateBon}</div>
        <div><span className="font-medium">Source :</span> {bon.fournisseur?.producerName ?? bon.serviceSource?.libelle ?? '—'}</div>
        <div><span className="font-medium">Statut :</span> {bon.statut}</div>
        <div><span className="font-medium">Visa :</span> {bon.visa ?? '—'}</div>
        {bon.observations && <div className="col-span-2"><span className="font-medium">Observations :</span> {bon.observations}</div>}
      </div>

      <div className="bg-white shadow rounded p-6">
        <h2 className="font-semibold mb-3">Lignes</h2>
        <table className="min-w-full text-sm border rounded">
          <thead className="bg-gray-100">
            <tr>
              {['Article', 'Quantité', 'Prix unitaire'].map(h => (
                <th key={h} className="px-3 py-2 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bon.lignes.map((l, i) => (
              <tr key={i} className="border-t">
                <td className="px-3 py-1">{l.article.articleCode} — {l.article.articleName}</td>
                <td className="px-3 py-1">{l.quantite}</td>
                <td className="px-3 py-1">{l.prixUnitaire} DA</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button onClick={() => navigate('/bons-entree')} className="text-blue-600 hover:underline text-sm">← Retour</button>
    </div>
  )
}
