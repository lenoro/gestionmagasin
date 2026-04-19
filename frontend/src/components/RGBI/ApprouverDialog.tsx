import { useState } from 'react'
import type { ApprouverRequest } from '../../types/rgbi'

interface Props { onConfirm: (req: ApprouverRequest) => void; onCancel: () => void }

export default function ApprouverDialog({ onConfirm, onCancel }: Props) {
  const [visa, setVisa] = useState('')
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-xl p-6 w-80 space-y-4">
        <h2 className="text-lg font-bold text-green-700">Approuver le bon</h2>
        <div>
          <label className="text-sm font-medium">Visa approbateur *</label>
          <input className="w-full border rounded px-3 py-2 mt-1" value={visa}
            onChange={e => setVisa(e.target.value)} />
        </div>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 border rounded hover:bg-gray-50">Annuler</button>
          <button onClick={() => visa.trim() && onConfirm({ visaApprobateur: visa })}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Approuver</button>
        </div>
      </div>
    </div>
  )
}
