import axios from 'axios'
import type { BonApprovisionnement, BonDistribution, StockCarburant, Vehicule } from '../types/carburant'

const VEH = '/api/vehicules'
const APPRO = '/api/bons-approvisionnement'
const DISTRIB = '/api/bons-distribution'
const STOCK = '/api/stock-carburant'

export const vehiculeApi = {
  findAll: () => axios.get<Vehicule[]>(VEH).then(r => r.data),
  findById: (id: number) => axios.get<Vehicule>(`${VEH}/${id}`).then(r => r.data),
  create: (v: Vehicule) => axios.post<Vehicule>(VEH, v).then(r => r.data),
  update: (id: number, v: Vehicule) => axios.put<Vehicule>(`${VEH}/${id}`, v).then(r => r.data),
}

export const bonApproApi = {
  findAll: () => axios.get<BonApprovisionnement[]>(APPRO).then(r => r.data),
  findById: (id: number) => axios.get<BonApprovisionnement>(`${APPRO}/${id}`).then(r => r.data),
  create: (b: BonApprovisionnement) => axios.post<BonApprovisionnement>(APPRO, b).then(r => r.data),
  valider: (id: number) => axios.post<BonApprovisionnement>(`${APPRO}/${id}/valider`).then(r => r.data),
  exportPdf: () => axios.get(`${APPRO}/export/pdf`, { responseType: 'blob' }).then(r => r.data),
  exportExcel: () => axios.get(`${APPRO}/export/excel`, { responseType: 'blob' }).then(r => r.data),
  imprimer: (id: number) => axios.get(`${APPRO}/${id}/imprimer`, { responseType: 'blob' }).then(r => r.data),
}

export const bonDistribApi = {
  findAll: () => axios.get<BonDistribution[]>(DISTRIB).then(r => r.data),
  findById: (id: number) => axios.get<BonDistribution>(`${DISTRIB}/${id}`).then(r => r.data),
  create: (b: BonDistribution) => axios.post<BonDistribution>(DISTRIB, b).then(r => r.data),
  exportPdf: () => axios.get(`${DISTRIB}/export/pdf`, { responseType: 'blob' }).then(r => r.data),
  exportExcel: () => axios.get(`${DISTRIB}/export/excel`, { responseType: 'blob' }).then(r => r.data),
  imprimer: (id: number) => axios.get(`${DISTRIB}/${id}/imprimer`, { responseType: 'blob' }).then(r => r.data),
}

export const stockCarburantApi = {
  findAll: () => axios.get<StockCarburant[]>(STOCK).then(r => r.data),
}
