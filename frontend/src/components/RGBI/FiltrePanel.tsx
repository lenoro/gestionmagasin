import { useEffect, useState } from 'react'
import axios from 'axios'
import type { FiltresRapport } from '../../types/rgbi'

interface FiltrePanelProps {
  filtres: ('dateRange' | 'fournisseur' | 'affectation' | 'consommateur')[]
  values: FiltresRapport
  onChange: (f: FiltresRapport) => void
}

export default function FiltrePanel({ filtres, values, onChange }: FiltrePanelProps) {
  const [fournisseurs, setFournisseurs] = useState<{ id: number; raisonSociale: string }[]>([])
  const [affectations, setAffectations] = useState<{ id: number; libelle: string }[]>([])
  const [consommateurs, setConsommateurs] = useState<{ id: number; nomPrenom: string }[]>([])

  useEffect(() => {
    if (filtres.includes('fournisseur'))
      axios.get('/api/fournisseurs').then(r => setFournisseurs(r.data))
    if (filtres.includes('affectation'))
      axios.get('/api/affectations').then(r => setAffectations(r.data))
    if (filtres.includes('consommateur'))
      axios.get('/api/consommateurs').then(r => setConsommateurs(r.data))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function set(key: keyof FiltresRapport, val: string | number | undefined) {
    onChange({ ...values, [key]: val || undefined })
  }

  return (
    <div className="bg-gray-50 border rounded p-4 flex flex-wrap gap-4 mb-4">
      {filtres.includes('dateRange') && (<>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Date début</label>
          <input type="date" value={values.dateDebut ?? ''}
            onChange={e => set('dateDebut', e.target.value)}
            className="border rounded px-3 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Date fin</label>
          <input type="date" value={values.dateFin ?? ''}
            onChange={e => set('dateFin', e.target.value)}
            className="border rounded px-3 py-1.5 text-sm" />
        </div>
      </>)}
      {filtres.includes('fournisseur') && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Fournisseur</label>
          <select value={values.fournisseurId ?? ''}
            onChange={e => set('fournisseurId', e.target.value ? Number(e.target.value) : undefined)}
            className="border rounded px-3 py-1.5 text-sm">
            <option value="">Tous</option>
            {fournisseurs.map(f => <option key={f.id} value={f.id}>{f.raisonSociale}</option>)}
          </select>
        </div>
      )}
      {filtres.includes('affectation') && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Service / Dépôt</label>
          <select value={values.affectationId ?? ''}
            onChange={e => set('affectationId', e.target.value ? Number(e.target.value) : undefined)}
            className="border rounded px-3 py-1.5 text-sm">
            <option value="">Tous</option>
            {affectations.map(a => <option key={a.id} value={a.id}>{a.libelle}</option>)}
          </select>
        </div>
      )}
      {filtres.includes('consommateur') && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Demandeur</label>
          <select value={values.consommateurId ?? ''}
            onChange={e => set('consommateurId', e.target.value ? Number(e.target.value) : undefined)}
            className="border rounded px-3 py-1.5 text-sm">
            <option value="">Tous</option>
            {consommateurs.map(c => <option key={c.id} value={c.id}>{c.nomPrenom}</option>)}
          </select>
        </div>
      )}
    </div>
  )
}
