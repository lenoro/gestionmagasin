import { useEffect, useState } from 'react'
import { affectationApi } from '../../api/inventaireApi'
import type { Affectation, TransfertRequest } from '../../types/inventaire'

interface Props {
  onConfirm: (req: TransfertRequest) => void
  onCancel: () => void
}

export default function TransfertDialog({ onConfirm, onCancel }: Props) {
  const [affectations, setAffectations] = useState<Affectation[]>([])
  const [mode, setMode] = useState<'liste' | 'libre'>('liste')
  const [affectationId, setAffectationId] = useState<number | undefined>()
  const [affectationLibre, setAffectationLibre] = useState('')
  const [motif, setMotif] = useState('')
  const [visa, setVisa] = useState('')

  useEffect(() => { affectationApi.findAll().then(setAffectations) }, [])

  function handleConfirm() {
    if (!motif.trim()) return
    onConfirm({
      affectationId: mode === 'liste' ? affectationId : undefined,
      affectationLibre: mode === 'libre' ? affectationLibre : undefined,
      motif, visa,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-xl p-6 w-96 space-y-4">
        <h2 className="text-lg font-bold">Transfert du bien</h2>
        <div>
          <label className="text-sm font-medium">Nouvelle affectation *</label>
          <div className="flex gap-3 my-1">
            <label className="flex items-center gap-1 text-sm">
              <input type="radio" checked={mode === 'liste'} onChange={() => setMode('liste')} /> Liste
            </label>
            <label className="flex items-center gap-1 text-sm">
              <input type="radio" checked={mode === 'libre'} onChange={() => setMode('libre')} /> Libre
            </label>
          </div>
          {mode === 'liste' ? (
            <select className="w-full border rounded px-3 py-2"
              value={affectationId ?? ''} onChange={e => setAffectationId(Number(e.target.value))}>
              <option value="">-- Choisir --</option>
              {affectations.map(a => <option key={a.id} value={a.id}>{a.libelle}</option>)}
            </select>
          ) : (
            <input className="w-full border rounded px-3 py-2" value={affectationLibre}
              onChange={e => setAffectationLibre(e.target.value)} placeholder="Nom du service ou local" />
          )}
        </div>
        <div>
          <label className="text-sm font-medium">Motif *</label>
          <input className="w-full border rounded px-3 py-2 mt-1" value={motif}
            onChange={e => setMotif(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Visa / Responsable</label>
          <input className="w-full border rounded px-3 py-2 mt-1" value={visa}
            onChange={e => setVisa(e.target.value)} />
        </div>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 border rounded hover:bg-gray-50">Annuler</button>
          <button onClick={handleConfirm}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Confirmer</button>
        </div>
      </div>
    </div>
  )
}
