import { useState } from 'react'
import type { RejeterRequest } from '../../types/rgbi'

interface Props { onConfirm: (req: RejeterRequest) => void; onCancel: () => void }

export default function RejeterDialog({ onConfirm, onCancel }: Props) {
  const [motif, setMotif] = useState('')
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-xl p-6 w-80 space-y-4">
        <h2 className="text-lg font-bold text-red-700">Rejeter le bon</h2>
        <div>
          <label className="text-sm font-medium">Motif *</label>
          <textarea className="w-full border rounded px-3 py-2 mt-1" rows={3}
            value={motif} onChange={e => setMotif(e.target.value)} />
        </div>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 border rounded hover:bg-gray-50">Annuler</button>
          <button onClick={() => motif.trim() && onConfirm({ motif })}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Rejeter</button>
        </div>
      </div>
    </div>
  )
}
