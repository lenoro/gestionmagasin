import axios from 'axios'
import type { BienInventaire, MouvementInventaire, Affectation, TransfertRequest, ReformeRequest } from '../types/inventaire'

const BASE = 'http://localhost:8080/api'

export const inventaireApi = {
  findAll: () => axios.get<BienInventaire[]>(`${BASE}/inventaire`).then(r => r.data),
  findById: (id: number) => axios.get<BienInventaire>(`${BASE}/inventaire/${id}`).then(r => r.data),
  create: (bien: BienInventaire) => axios.post<BienInventaire>(`${BASE}/inventaire`, bien).then(r => r.data),
  update: (id: number, bien: BienInventaire) => axios.put<BienInventaire>(`${BASE}/inventaire/${id}`, bien).then(r => r.data),
  getMouvements: (id: number) => axios.get<MouvementInventaire[]>(`${BASE}/inventaire/${id}/mouvements`).then(r => r.data),
  transferer: (id: number, req: TransfertRequest) => axios.post<BienInventaire>(`${BASE}/inventaire/${id}/transfert`, req).then(r => r.data),
  reformer: (id: number, req: ReformeRequest) => axios.post<BienInventaire>(`${BASE}/inventaire/${id}/reforme`, req).then(r => r.data),
  exportPdf: () => window.open(`${BASE}/inventaire/export/pdf`, '_blank'),
  exportExcel: () => window.open(`${BASE}/inventaire/export/excel`, '_blank'),
}

export const affectationApi = {
  findAll: () => axios.get<Affectation[]>(`${BASE}/affectations`).then(r => r.data),
  create: (aff: Omit<Affectation, 'id'>) => axios.post<Affectation>(`${BASE}/affectations`, aff).then(r => r.data),
}
