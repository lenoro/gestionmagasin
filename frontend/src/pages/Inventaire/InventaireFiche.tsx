import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { inventaireApi } from '../../api/inventaireApi'
import type { BienInventaire, MouvementInventaire } from '../../types/inventaire'
import TransfertDialog from '../../components/Inventaire/TransfertDialog'
import ReformeDialog from '../../components/Inventaire/ReformeDialog'
import MouvementsTable from '../../components/Inventaire/MouvementsTable'

const ETAT_LABELS: Record<string, string> = {
  BON: 'Bon état', MOYEN: 'État moyen',
  HORS_SERVICE: 'Hors service', EN_REPARATION: 'En réparation'
}

export default function InventaireFiche() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [bien, setBien] = useState<BienInventaire | null>(null)
  const [mouvements, setMouvements] = useState<MouvementInventaire[]>([])
  const [showTransfert, setShowTransfert] = useState(false)
  const [showReforme, setShowReforme] = useState(false)

  function load() {
    const nid = Number(id)
    inventaireApi.findById(nid).then(setBien)
    inventaireApi.getMouvements(nid).then(setMouvements)
  }

  useEffect(() => { load() }, [id])

  if (!bien) return <p>Chargement...</p>

  const isReforme = bien.statut === 'REFORME'
  const affectation = bien.affectation?.libelle ?? bien.affectationLibre ?? '—'

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{bien.designation}</h1>
          <p className="text-gray-500 font-mono">{bien.numeroInventaire}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate(`/inventaire/${id}/edit`)}
            className="border px-4 py-2 rounded hover:bg-gray-50">Modifier</button>
          {!isReforme && (
            <button onClick={() => setShowTransfert(true)}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Transférer</button>
          )}
          {!isReforme && (
            <button onClick={() => setShowReforme(true)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Réformer</button>
          )}
        </div>
      </div>

      <div className="bg-white shadow rounded p-6 grid grid-cols-2 gap-4 text-sm">
        <div><span className="font-medium">Marque / Modèle :</span> {bien.marqueModele ?? '—'}</div>
        <div><span className="font-medium">Date d'acquisition :</span> {bien.dateAcquisition}</div>
        <div><span className="font-medium">Prix d'achat :</span> {bien.prixAchat?.toLocaleString()} DA</div>
        <div><span className="font-medium">Affectation :</span> {affectation}</div>
        <div><span className="font-medium">État :</span> {ETAT_LABELS[bien.etatMateriel]}</div>
        <div><span className="font-medium">Statut :</span> {bien.statut}</div>
        {bien.observations && (
          <div className="col-span-2"><span className="font-medium">Observations :</span> {bien.observations}</div>
        )}
      </div>

      <div className="bg-white shadow rounded p-6">
        <h2 className="font-semibold mb-3">Historique des mouvements</h2>
        <MouvementsTable mouvements={mouvements} />
      </div>

      {showTransfert && (
        <TransfertDialog
          onCancel={() => setShowTransfert(false)}
          onConfirm={async req => {
            await inventaireApi.transferer(Number(id), req)
            setShowTransfert(false)
            load()
          }}
        />
      )}

      {showReforme && (
        <ReformeDialog
          onCancel={() => setShowReforme(false)}
          onConfirm={async req => {
            await inventaireApi.reformer(Number(id), req)
            setShowReforme(false)
            load()
          }}
        />
      )}
    </div>
  )
}
