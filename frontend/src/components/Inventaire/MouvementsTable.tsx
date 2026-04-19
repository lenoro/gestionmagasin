import type { MouvementInventaire } from '../../types/inventaire'

const TYPE_LABELS = { TRANSFERT: 'Transfert', REFORME: 'Réforme' }

export default function MouvementsTable({ mouvements }: { mouvements: MouvementInventaire[] }) {
  if (mouvements.length === 0) return <p className="text-gray-400 text-sm">Aucun mouvement enregistré.</p>
  return (
    <table className="min-w-full text-sm border rounded">
      <thead className="bg-gray-100">
        <tr>
          {['Date','Type','De','Vers','Motif','Visa'].map(h => (
            <th key={h} className="px-3 py-2 text-left">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {mouvements.map(m => (
          <tr key={m.id} className="border-t">
            <td className="px-3 py-1">{m.dateOperation}</td>
            <td className="px-3 py-1">{TYPE_LABELS[m.typeMouvement]}</td>
            <td className="px-3 py-1">{m.affectationSource ?? '—'}</td>
            <td className="px-3 py-1">{m.affectationDestination ?? '—'}</td>
            <td className="px-3 py-1">{m.motif}</td>
            <td className="px-3 py-1">{m.visa ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
