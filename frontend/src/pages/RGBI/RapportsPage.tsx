import { useState } from 'react'
import { rapportApi } from '../../api/rgbiApi'
import type { FiltresRapport } from '../../types/rgbi'
import FiltrePanel from '../../components/RGBI/FiltrePanel'

type OngletId = 'consommation' | 'besoins' | 'grand-livre' | 'fiche-bien' | 'entrees' | 'sorties' | 'bordereau'

interface OngletConfig {
  id: OngletId
  label: string
  filtres: ('dateRange' | 'fournisseur' | 'affectation' | 'consommateur')[]
  colonnes: string[]
  hasExcel: boolean
}

const ONGLETS: OngletConfig[] = [
  { id: 'consommation', label: 'Registre Consommation', filtres: ['dateRange', 'affectation', 'consommateur'],
    colonnes: ['Code', 'Désignation', 'N° Nomencl.', 'Unité', 'Qté totale', 'Service(s)', 'Demandeur(s)'], hasExcel: true },
  { id: 'besoins', label: 'État des Besoins', filtres: [],
    colonnes: ['Code', 'Désignation', 'N° Nomencl.', 'Stock actuel', 'Seuil min', 'Qté à commander', 'Unité'], hasExcel: true },
  { id: 'grand-livre', label: 'Grand Livre', filtres: ['dateRange'],
    colonnes: ['N° Inventaire', 'Désignation', 'Marque/Modèle', 'Date acq.', 'Prix (DA)', 'État', 'Statut', 'Affectation'], hasExcel: true },
  { id: 'fiche-bien', label: 'Fiche de Bien', filtres: [],
    colonnes: ['N° Inventaire', 'Désignation', 'Marque', 'Date acq.', 'Prix (DA)', 'État', 'Affectation'], hasExcel: false },
  { id: 'entrees', label: 'Registre Entrées', filtres: ['dateRange', 'fournisseur'],
    colonnes: ['N° Bon', 'Date', 'Type', 'Fournisseur / Source', 'Nb articles', 'Montant total (DA)', 'Visa'], hasExcel: true },
  { id: 'sorties', label: 'Registre Sorties', filtres: ['dateRange', 'affectation', 'consommateur'],
    colonnes: ['N° Bon', 'Date', 'Service', 'Demandeur', 'Type sortie', 'Nb articles', 'Visa magasin.', 'Visa approbat.'], hasExcel: true },
  { id: 'bordereau', label: 'Bordereau Transmission', filtres: [],
    colonnes: ['N° Bon', 'Date', 'Service dest.', 'Demandeur', 'Nb articles'], hasExcel: false },
]

function rowValues(id: OngletId, item: any): string[] {
  switch (id) {
    case 'consommation':
      return [item.articleCode, item.articleName, item.numNomenclature, item.unitesMesure,
              String(item.qteTotal), item.services, item.consommateurs]
    case 'besoins':
      return [item.articleCode, item.articleName, item.numNomenclature,
              String(item.stockActuel), String(item.stockMinimum), String(item.qteACommander), item.unitesMesure]
    case 'grand-livre':
      return [item.numeroInventaire, item.designation, item.marqueModele ?? '—',
              item.dateAcquisition, String(item.prixAchat), item.etatMateriel, item.statut,
              item.affectation?.libelle ?? item.affectationLibre ?? '—']
    case 'fiche-bien':
      return [item.numeroInventaire, item.designation, item.marqueModele ?? '—',
              item.dateAcquisition, String(item.prixAchat), item.etatMateriel,
              item.affectation?.libelle ?? item.affectationLibre ?? '—']
    case 'entrees': {
      const src = item.fournisseur?.raisonSociale ?? item.serviceSource?.libelle ?? '—'
      return [item.numeroBon, item.dateBon, item.typeBon?.replace('_', ' ') ?? '—', src,
              String(item.lignes?.length ?? 0), '—', item.visa ?? '—']
    }
    case 'sorties':
      return [item.numeroBon, item.dateBon, item.serviceDestination?.libelle ?? '—',
              item.consommateur?.nomPrenom ?? '—', item.typeSortie?.replace('_', ' ') ?? '—',
              String(item.lignes?.length ?? 0), item.visaMagasinier ?? '—', item.visaApprobateur ?? '—']
    case 'bordereau':
      return [item.numeroBon, item.dateBon, item.serviceDestination?.libelle ?? '—',
              item.consommateur?.nomPrenom ?? '—', String(item.lignes?.length ?? 0)]
    default:
      return []
  }
}

export default function RapportsPage() {
  const [onglet, setOnglet] = useState<OngletId>('consommation')
  const [filtres, setFiltres] = useState<FiltresRapport>({})
  const [bonId, setBonId] = useState('')
  const [bienId, setBienId] = useState('')
  const [apercu, setApercu] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const config = ONGLETS.find(o => o.id === onglet)!

  async function charger() {
    setLoading(true); setError(''); setApercu(null)
    try {
      let data: any
      switch (onglet) {
        case 'consommation': data = await rapportApi.consommation(filtres); break
        case 'besoins':      data = await rapportApi.besoins(); break
        case 'grand-livre':  data = await rapportApi.grandLivre(filtres); break
        case 'fiche-bien':   data = bienId ? [await rapportApi.ficheBien(Number(bienId))] : []; break
        case 'entrees':      data = await rapportApi.entrees(filtres); break
        case 'sorties':      data = await rapportApi.sorties(filtres); break
        case 'bordereau':    data = bonId ? [await rapportApi.bordereau(Number(bonId))] : []; break
      }
      setApercu(Array.isArray(data) ? data : [data])
    } catch { setError('Erreur lors du chargement') }
    finally { setLoading(false) }
  }

  async function exporterPdf() {
    try {
      switch (onglet) {
        case 'consommation': await rapportApi.pdfConsommation(filtres); break
        case 'besoins':      await rapportApi.pdfBesoins(); break
        case 'grand-livre':  await rapportApi.pdfGrandLivre(filtres); break
        case 'fiche-bien':   if (bienId) await rapportApi.pdfFicheBien(Number(bienId)); break
        case 'entrees':      await rapportApi.pdfEntrees(filtres); break
        case 'sorties':      await rapportApi.pdfSorties(filtres); break
        case 'bordereau':    if (bonId) await rapportApi.pdfBordereau(Number(bonId)); break
      }
    } catch { setError('Erreur export PDF') }
  }

  async function exporterExcel() {
    try {
      switch (onglet) {
        case 'consommation': await rapportApi.excelConsommation(filtres); break
        case 'besoins':      await rapportApi.excelBesoins(); break
        case 'grand-livre':  await rapportApi.excelGrandLivre(filtres); break
        case 'entrees':      await rapportApi.excelEntrees(filtres); break
        case 'sorties':      await rapportApi.excelSorties(filtres); break
        default: break
      }
    } catch { setError('Erreur export Excel') }
  }

  function changerOnglet(id: OngletId) {
    setOnglet(id); setFiltres({}); setApercu(null); setError(''); setBonId(''); setBienId('')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Rapports réglementaires CFPA</h1>

      <div className="flex flex-wrap gap-1 mb-4 border-b">
        {ONGLETS.map(o => (
          <button key={o.id} onClick={() => changerOnglet(o.id)}
            className={`px-3 py-2 text-sm rounded-t border-b-2 transition-colors ${
              onglet === o.id
                ? 'border-blue-600 text-blue-700 font-semibold bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}>
            {o.label}
          </button>
        ))}
      </div>

      {onglet === 'fiche-bien' && (
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-1">N° Inventaire (ID)</label>
          <input type="number" value={bienId} onChange={e => setBienId(e.target.value)}
            placeholder="Ex: 1" className="border rounded px-3 py-1.5 text-sm w-40" />
        </div>
      )}
      {onglet === 'bordereau' && (
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-1">ID du bon de sortie</label>
          <input type="number" value={bonId} onChange={e => setBonId(e.target.value)}
            placeholder="Ex: 5" className="border rounded px-3 py-1.5 text-sm w-40" />
        </div>
      )}

      {config.filtres.length > 0 && (
        <FiltrePanel filtres={config.filtres} values={filtres} onChange={setFiltres} />
      )}

      <div className="flex gap-2 mb-4">
        <button onClick={charger} disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm disabled:opacity-50">
          {loading ? 'Chargement…' : 'Aperçu'}
        </button>
        <button onClick={exporterPdf}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm">
          Exporter PDF
        </button>
        {config.hasExcel && (
          <button onClick={exporterExcel}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm">
            Exporter Excel
          </button>
        )}
      </div>

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      {apercu !== null && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow text-sm">
            <thead className="bg-blue-700 text-white">
              <tr>
                {config.colonnes.map(c => (
                  <th key={c} className="px-3 py-2 text-left whitespace-nowrap">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {apercu.length === 0 ? (
                <tr><td colSpan={config.colonnes.length}
                  className="px-4 py-6 text-center text-gray-400">Aucune donnée pour ces filtres</td></tr>
              ) : apercu.map((item, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  {rowValues(onglet, item).map((v, j) => (
                    <td key={j} className="px-3 py-1.5 whitespace-nowrap">{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-gray-400 mt-2">{apercu.length} ligne(s)</p>
        </div>
      )}
    </div>
  )
}
