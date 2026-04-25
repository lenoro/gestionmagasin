import { useEffect, useState } from 'react'
import { articleApi } from '../../api/commercialApi'
import { inventaireApi } from '../../api/inventaireApi'
import type { Article } from '../../types/commercial'
import type { BienInventaire } from '../../types/inventaire'
import PdfPreviewModal from '../../components/PdfPreviewModal'

const BASE = '/api/etats'

function today() {
  return new Date().toISOString().slice(0, 10)
}

function firstOfMonth() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
}

function buildUrl(base: string, params: Record<string, string | number | number[]>): string {
  const p = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (Array.isArray(v)) v.forEach(id => p.append(k, String(id)))
    else if (v !== '' && v !== undefined) p.append(k, String(v))
  }
  return `${base}?${p.toString()}`
}

function BienCheckList({ biens, selected, onChange }: {
  biens: BienInventaire[]
  selected: number[]
  onChange: (ids: number[]) => void
}) {
  const toggle = (id: number) =>
    onChange(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id])
  return (
    <div className="max-h-40 overflow-y-auto border border-gray-200 rounded p-2 text-sm min-w-72">
      {biens.length === 0
        ? <p className="text-gray-400 italic">Aucun bien</p>
        : biens.map(b => (
          <label key={b.id} className="flex items-center gap-2 py-0.5 cursor-pointer hover:bg-gray-50">
            <input type="checkbox" checked={selected.includes(b.id!)}
              onChange={() => toggle(b.id!)} className="w-3 h-3" />
            <span>{b.designation} — {b.numeroInventaire ?? '—'}</span>
          </label>
        ))
      }
    </div>
  )
}

function Card({ title, ref: refCode, children }: { title: string; ref?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded shadow p-5 mb-4">
      <div className="flex justify-between items-start mb-3">
        <h2 className="font-semibold text-gray-800 text-base">{title}</h2>
        {refCode && <span className="text-xs text-gray-400 font-mono">{refCode}</span>}
      </div>
      {children}
    </div>
  )
}

function BtnApercu({ onClick, disabled = false }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
    >
      <span>👁</span> Aperçu
    </button>
  )
}

export default function EtatsPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [biens, setBiens] = useState<BienInventaire[]>([])

  // Modale PDF
  const [pdfUrl,   setPdfUrl]   = useState<string | null>(null)
  const [pdfTitle, setPdfTitle] = useState('')

  // BJR
  const [bjrDebut, setBjrDebut] = useState(firstOfMonth())
  const [bjrFin, setBjrFin]     = useState(today())

  // EJS
  const [ejsDebut, setEjsDebut] = useState(firstOfMonth())
  const [ejsFin, setEjsFin]     = useState(today())

  // État des Besoins
  const [section, setSection] = useState('')
  const [agent, setAgent]     = useState('')
  const [annee, setAnnee]     = useState(new Date().getFullYear())

  // FC/MC
  const [articleId, setArticleId] = useState<number | ''>('')

  // FC/MNC
  const [bienId, setBienId] = useState<number | ''>('')

  // PV Cession/Transfert
  const [pvCessionDir,  setPvCessionDir]  = useState('')
  const [pvCessionDest, setPvCessionDest] = useState('')
  const [pvCessionIds,  setPvCessionIds]  = useState<number[]>([])

  // PV Perte/Vol
  const [pvPvDir,       setPvPvDir]       = useState('')
  const [pvPvIntendant, setPvPvIntendant] = useState('')
  const [pvPvMag,       setPvPvMag]       = useState('')
  const [pvPvCirc,      setPvPvCirc]      = useState('')
  const [pvPvIds,       setPvPvIds]       = useState<number[]>([])

  // PV Réforme
  const [pvRefDir,  setPvRefDir]  = useState('')
  const [pvRefCfpa, setPvRefCfpa] = useState('')
  const [pvRefIntd, setPvRefIntd] = useState('')
  const [pvRefMag,  setPvRefMag]  = useState('')

  useEffect(() => {
    articleApi.findAll().then(setArticles).catch(() => {})
    inventaireApi.findAll().then(setBiens).catch(() => {})
  }, [])

  function apercu(url: string, title: string) {
    setPdfUrl(url)
    setPdfTitle(title)
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">États et fiches</h1>

      {/* 1. BJR */}
      <Card title="Bulletin Journalier de Réception" ref="MFP/IG/CMM/BJR/01">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Date début</label>
            <input type="date" value={bjrDebut} onChange={e => setBjrDebut(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Date fin</label>
            <input type="date" value={bjrFin} onChange={e => setBjrFin(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm" />
          </div>
          <BtnApercu onClick={() => apercu(`${BASE}/bjr?dateDebut=${bjrDebut}&dateFin=${bjrFin}`, 'Bulletin Journalier de Réception')} />
        </div>
      </Card>

      {/* 2. EJS */}
      <Card title="État Journalier des Sorties" ref="MFP/IG/CMM/EJS/02">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Date début</label>
            <input type="date" value={ejsDebut} onChange={e => setEjsDebut(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Date fin</label>
            <input type="date" value={ejsFin} onChange={e => setEjsFin(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm" />
          </div>
          <BtnApercu onClick={() => apercu(`${BASE}/ejs?dateDebut=${ejsDebut}&dateFin=${ejsFin}`, 'État Journalier des Sorties')} />
        </div>
      </Card>

      {/* 3. État Réforme */}
      <Card title="État du Matériel à Proposer à la Réforme">
        <p className="text-sm text-gray-500 mb-3">
          Liste les biens dont le statut est <em>Réformé</em> ou l'état <em>Hors service</em>.
        </p>
        <BtnApercu onClick={() => apercu(`${BASE}/reforme`, "État du Matériel à Proposer à la Réforme")} />
      </Card>

      {/* 4. État des Besoins */}
      <Card title="État des Besoins">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Section / Service</label>
            <input value={section} onChange={e => setSection(e.target.value)}
              placeholder="ex: Informatique"
              className="border border-gray-300 rounded px-3 py-1.5 text-sm w-40" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Enseignant / Agent</label>
            <input value={agent} onChange={e => setAgent(e.target.value)}
              placeholder="ex: M. Dupont"
              className="border border-gray-300 rounded px-3 py-1.5 text-sm w-40" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Année</label>
            <input type="number" value={annee} onChange={e => setAnnee(Number(e.target.value))}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm w-24" />
          </div>
          <BtnApercu onClick={() =>
            apercu(`${BASE}/besoins?section=${encodeURIComponent(section)}&agent=${encodeURIComponent(agent)}&annee=${annee}`, "État des Besoins")
          } />
        </div>
      </Card>

      {/* 5. FC/MC */}
      <Card title="Fichier Central — Matériel Consomptible" ref="MFP/IG/CMM/FC/MC/05">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Article</label>
            <select value={articleId} onChange={e => setArticleId(e.target.value ? Number(e.target.value) : '')}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm min-w-56">
              <option value="">— Sélectionner un article —</option>
              {articles.map(a => (
                <option key={a.id} value={a.id}>{a.articleName} ({a.articleCode})</option>
              ))}
            </select>
          </div>
          <BtnApercu
            disabled={articleId === ''}
            onClick={() => articleId !== '' && apercu(`${BASE}/fc-mc/${articleId}`, 'Fichier Central — Matériel Consomptible')}
          />
        </div>
      </Card>

      {/* 6. FC/MNC */}
      <Card title="Fichier Central — Matériel Non Consomptible" ref="MFP/IG/CMM/FC/MNC/06">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Bien inventorié</label>
            <select value={bienId} onChange={e => setBienId(e.target.value ? Number(e.target.value) : '')}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm min-w-56">
              <option value="">— Sélectionner un bien —</option>
              {biens.map(b => (
                <option key={b.id} value={b.id}>{b.designation} — {b.numeroInventaire}</option>
              ))}
            </select>
          </div>
          <BtnApercu
            disabled={bienId === ''}
            onClick={() => bienId !== '' && apercu(`${BASE}/fc-mnc/${bienId}`, 'Fichier Central — Matériel Non Consomptible')}
          />
        </div>
      </Card>

      {/* 7. RSR */}
      <Card title="Registre de Suivi des Ressources (RSR)">
        <p className="text-sm text-gray-500 mb-3">
          Liste tous les biens avec N° inventaire, désignation, marque, état de conservation, emplacement et date d'entrée.
        </p>
        <BtnApercu onClick={() => apercu(`${BASE}/rsr`, 'Registre de Suivi des Ressources (RSR)')} />
      </Card>

      {/* 8. Registre Matière */}
      <Card title="Registre Matière (Tableau détaillé)">
        <p className="text-sm text-gray-500 mb-3">
          Tableau avec N° inventaire, désignation, marque & série, date d'entrée, mode d'acquisition, prix d'achat, affectation, date/motif de sortie.
        </p>
        <BtnApercu onClick={() => apercu(`${BASE}/registre-matiere`, 'Registre Matière')} />
      </Card>

      {/* 9. RGBI */}
      <Card title="Registre Général des Biens Immobiliers (RGBI)">
        <p className="text-sm text-gray-500 mb-3">
          Liste les biens actifs avec désignation, consistance, mode d'acquisition, titre de propriété, valeur initiale.
        </p>
        <BtnApercu onClick={() => apercu(`${BASE}/rgbi`, 'Registre Général des Biens Immobiliers (RGBI)')} />
      </Card>

      {/* 10. PV Cession/Transfert */}
      <Card title="Procès-Verbal de Cession / Transfert" ref="MFP/IG/CMM/PV/C/T/07">
        <div className="flex flex-wrap gap-3 mb-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Directeur signataire</label>
            <input value={pvCessionDir} onChange={e => setPvCessionDir(e.target.value)}
              placeholder="M. ..." className="border border-gray-300 rounded px-3 py-1.5 text-sm w-48" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">CFPA destinataire</label>
            <input value={pvCessionDest} onChange={e => setPvCessionDest(e.target.value)}
              placeholder="Nom CFPA" className="border border-gray-300 rounded px-3 py-1.5 text-sm w-48" />
          </div>
        </div>
        <div className="mb-3">
          <label className="block text-xs text-gray-600 mb-1">Biens concernés ({pvCessionIds.length} sélectionné(s))</label>
          <BienCheckList biens={biens} selected={pvCessionIds} onChange={setPvCessionIds} />
        </div>
        <BtnApercu onClick={() =>
          apercu(buildUrl(`${BASE}/pv-cession`, {
            directeur: pvCessionDir,
            cfpDestination: pvCessionDest,
            bienIds: pvCessionIds,
          }), 'Procès-Verbal de Cession / Transfert')
        } />
      </Card>

      {/* 11. PV Perte/Vol */}
      <Card title="Procès-Verbal de Perte / Vol" ref="MFP/IG/CMM/PVPV/08">
        <div className="flex flex-wrap gap-3 mb-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Directeur</label>
            <input value={pvPvDir} onChange={e => setPvPvDir(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm w-44" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Intendant</label>
            <input value={pvPvIntendant} onChange={e => setPvPvIntendant(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm w-44" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Magasinier</label>
            <input value={pvPvMag} onChange={e => setPvPvMag(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm w-44" />
          </div>
          <div className="w-full">
            <label className="block text-xs text-gray-600 mb-1">Circonstances</label>
            <input value={pvPvCirc} onChange={e => setPvPvCirc(e.target.value)}
              placeholder="Décrire les circonstances..."
              className="border border-gray-300 rounded px-3 py-1.5 text-sm w-full" />
          </div>
        </div>
        <div className="mb-3">
          <label className="block text-xs text-gray-600 mb-1">Articles / biens ({pvPvIds.length} sélectionné(s))</label>
          <BienCheckList biens={biens} selected={pvPvIds} onChange={setPvPvIds} />
        </div>
        <BtnApercu onClick={() =>
          apercu(buildUrl(`${BASE}/pv-perte-vol`, {
            directeur: pvPvDir,
            intendant: pvPvIntendant,
            magasinier: pvPvMag,
            circonstances: pvPvCirc,
            bienIds: pvPvIds,
          }), 'Procès-Verbal de Perte / Vol')
        } />
      </Card>

      {/* 12. PV Réforme */}
      <Card title="Procès-Verbal de Réforme" ref="MFP/IG/CMM/PVR/10">
        <p className="text-sm text-gray-500 mb-3">
          Liste automatiquement tous les biens dont le statut est <em>Réformé</em>.
        </p>
        <div className="flex flex-wrap gap-3 mb-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Directeur</label>
            <input value={pvRefDir} onChange={e => setPvRefDir(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm w-44" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">CFPA</label>
            <input value={pvRefCfpa} onChange={e => setPvRefCfpa(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm w-44" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Intendant</label>
            <input value={pvRefIntd} onChange={e => setPvRefIntd(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm w-44" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Magasinier</label>
            <input value={pvRefMag} onChange={e => setPvRefMag(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm w-44" />
          </div>
        </div>
        <BtnApercu onClick={() =>
          apercu(buildUrl(`${BASE}/pv-reforme`, {
            directeur: pvRefDir,
            cfpa: pvRefCfpa,
            intendant: pvRefIntd,
            magasinier: pvRefMag,
          }), 'Procès-Verbal de Réforme')
        } />
      </Card>

      {/* Modale PDF — une seule instance pour toute la page */}
      <PdfPreviewModal
        url={pdfUrl}
        title={pdfTitle}
        onClose={() => setPdfUrl(null)}
      />
    </div>
  )
}
