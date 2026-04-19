import axios from 'axios'
import type { BonEntree, BonSortie, ApprouverRequest, RejeterRequest } from '../types/rgbi'

const BASE = 'http://localhost:8080/api'

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
