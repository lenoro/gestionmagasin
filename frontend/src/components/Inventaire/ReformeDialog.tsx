import { useState } from 'react'
import type { ReformeRequest } from '../../types/inventaire'

interface Props {
  onConfirm: (req: ReformeRequest) => void
  onCancel: () => void
}

export default function ReformeDialog({ onConfirm, onCancel }: Props) {
  const [motif, setMotif] = useState('')
  const [visa, setVisa] = useState('')

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-xl p-6 w-96 space-y-4">
        <h2 className="text-lg font-bold text-red-700">Réforme du bien</h2>
        <p className="text-sm text-gray-600">Cette action est irréversible. Le bien sera marqué réformé.</p>
        <div>
          <label className="text-sm font-medium">Motif *</label>
          <textarea className="w-full border rounded px-3 py-2 mt-1" rows={3}
            value={motif} onChange={e => setMotif(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Visa / Responsable</label>
          <input className="w-full border rounded px-3 py-2 mt-1" value={visa}
            onChange={e => setVisa(e.target.value)} />
        </div>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 border rounded hover:bg-gray-50">Annuler</button>
          <button onClick={() => motif.trim() && onConfirm({ motif, visa })}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Réformer</button>
        </div>
      </div>
    </div>
  )
}
