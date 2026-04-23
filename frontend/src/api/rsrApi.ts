import axios from 'axios'
import type { FicheReparation } from '../types/rsr'

const BASE = '/api/fiches-reparation'

export const rsrApi = {
  findAll: () => axios.get<FicheReparation[]>(BASE).then(r => r.data),
  findById: (id: number) => axios.get<FicheReparation>(`${BASE}/${id}`).then(r => r.data),
  create: (fiche: FicheReparation) => axios.post<FicheReparation>(BASE, fiche).then(r => r.data),
  envoyer: (id: number) => axios.post<FicheReparation>(`${BASE}/${id}/envoyer`).then(r => r.data),
  retourner: (id: number) => axios.post<FicheReparation>(`${BASE}/${id}/retourner`).then(r => r.data),
  clore: (id: number) => axios.post<FicheReparation>(`${BASE}/${id}/clore`).then(r => r.data),
  exportPdf: () => axios.get(`${BASE}/export/pdf`, { responseType: 'blob' }).then(r => r.data),
  exportExcel: () => axios.get(`${BASE}/export/excel`, { responseType: 'blob' }).then(r => r.data),
  imprimer: (id: number) => axios.get(`${BASE}/${id}/imprimer`, { responseType: 'blob' }).then(r => r.data),
}
