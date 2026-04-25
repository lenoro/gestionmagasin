import axios from 'axios'
import type { BonEntree, BonSortie, ApprouverRequest, RejeterRequest } from '../types/rgbi'

const BASE = '/api'

export const bonEntreeApi = {
  findAll: () => axios.get<BonEntree[]>(`${BASE}/bons-entree`).then(r => r.data),
  findById: (id: number) => axios.get<BonEntree>(`${BASE}/bons-entree/${id}`).then(r => r.data),
  create: (bon: BonEntree) => axios.post<BonEntree>(`${BASE}/bons-entree`, bon).then(r => r.data),
  valider: (id: number) => axios.post<BonEntree>(`${BASE}/bons-entree/${id}/valider`).then(r => r.data),
  exportPdf: () => window.open(`${BASE}/bons-entree/export/pdf`, '_blank'),
  exportExcel: () => window.open(`${BASE}/bons-entree/export/excel`, '_blank'),
  imprimer: (id: number) => window.open(`${BASE}/bons-entree/${id}/imprimer`, '_blank'),
}

export const bonSortieApi = {
  findAll: () => axios.get<BonSortie[]>(`${BASE}/bons-sortie`).then(r => r.data),
  findById: (id: number) => axios.get<BonSortie>(`${BASE}/bons-sortie/${id}`).then(r => r.data),
  create: (bon: BonSortie) => axios.post<BonSortie>(`${BASE}/bons-sortie`, bon).then(r => r.data),
  approuver: (id: number, req: ApprouverRequest) => axios.post<BonSortie>(`${BASE}/bons-sortie/${id}/approuver`, req).then(r => r.data),
  rejeter: (id: number, req: RejeterRequest) => axios.post<BonSortie>(`${BASE}/bons-sortie/${id}/rejeter`, req).then(r => r.data),
  exportPdf: () => window.open(`${BASE}/bons-sortie/export/pdf`, '_blank'),
  exportExcel: () => window.open(`${BASE}/bons-sortie/export/excel`, '_blank'),
  imprimer: (id: number) => window.open(`${BASE}/bons-sortie/${id}/imprimer`, '_blank'),
}

const RAPPORT = '/api/rapports'

function toParams(f: import('../types/rgbi').FiltresRapport): string {
  const p = new URLSearchParams()
  if (f.dateDebut)      p.set('dateDebut', f.dateDebut)
  if (f.dateFin)        p.set('dateFin', f.dateFin)
  if (f.fournisseurId)  p.set('fournisseurId', String(f.fournisseurId))
  if (f.affectationId)  p.set('affectationId', String(f.affectationId))
  if (f.consommateurId) p.set('consommateurId', String(f.consommateurId))
  return p.toString() ? '?' + p.toString() : ''
}

function downloadBlob(url: string, filename: string) {
  return axios.get(url, { responseType: 'blob' }).then(r => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(r.data)
    a.download = filename
    a.click()
  })
}

export const rapportApi = {
  consommation: (f: import('../types/rgbi').FiltresRapport) =>
    axios.get(`${RAPPORT}/consommation${toParams(f)}`).then(r => r.data),
  besoins: () =>
    axios.get(`${RAPPORT}/besoins`).then(r => r.data),
  grandLivre: (f: import('../types/rgbi').FiltresRapport) =>
    axios.get(`${RAPPORT}/grand-livre${toParams(f)}`).then(r => r.data),
  ficheBien: (id: number) =>
    axios.get(`${RAPPORT}/fiche-bien/${id}`).then(r => r.data),
  entrees: (f: import('../types/rgbi').FiltresRapport) =>
    axios.get(`${RAPPORT}/entrees${toParams(f)}`).then(r => r.data),
  sorties: (f: import('../types/rgbi').FiltresRapport) =>
    axios.get(`${RAPPORT}/sorties${toParams(f)}`).then(r => r.data),
  bordereau: (id: number) =>
    axios.get(`${RAPPORT}/bordereau/${id}`).then(r => r.data),

  pdfConsommation: (f: import('../types/rgbi').FiltresRapport) =>
    downloadBlob(`${RAPPORT}/consommation/pdf${toParams(f)}`, 'registre-consommation.pdf'),
  pdfBesoins: () =>
    downloadBlob(`${RAPPORT}/besoins/pdf`, 'etat-besoins.pdf'),
  pdfGrandLivre: (f: import('../types/rgbi').FiltresRapport) =>
    downloadBlob(`${RAPPORT}/grand-livre/pdf${toParams(f)}`, 'grand-livre.pdf'),
  pdfFicheBien: (id: number) =>
    downloadBlob(`${RAPPORT}/fiche-bien/${id}/pdf`, `fiche-bien-${id}.pdf`),
  pdfEntrees: (f: import('../types/rgbi').FiltresRapport) =>
    downloadBlob(`${RAPPORT}/entrees/pdf${toParams(f)}`, 'registre-entrees.pdf'),
  pdfSorties: (f: import('../types/rgbi').FiltresRapport) =>
    downloadBlob(`${RAPPORT}/sorties/pdf${toParams(f)}`, 'registre-sorties.pdf'),
  pdfBordereau: (id: number) =>
    downloadBlob(`${RAPPORT}/bordereau/${id}/pdf`, `bordereau-${id}.pdf`),

  excelConsommation: (f: import('../types/rgbi').FiltresRapport) =>
    downloadBlob(`${RAPPORT}/consommation/excel${toParams(f)}`, 'registre-consommation.xlsx'),
  excelBesoins: () =>
    downloadBlob(`${RAPPORT}/besoins/excel`, 'etat-besoins.xlsx'),
  excelGrandLivre: (f: import('../types/rgbi').FiltresRapport) =>
    downloadBlob(`${RAPPORT}/grand-livre/excel${toParams(f)}`, 'grand-livre.xlsx'),
  excelEntrees: (f: import('../types/rgbi').FiltresRapport) =>
    downloadBlob(`${RAPPORT}/entrees/excel${toParams(f)}`, 'registre-entrees.xlsx'),
  excelSorties: (f: import('../types/rgbi').FiltresRapport) =>
    downloadBlob(`${RAPPORT}/sorties/excel${toParams(f)}`, 'registre-sorties.xlsx'),
}
