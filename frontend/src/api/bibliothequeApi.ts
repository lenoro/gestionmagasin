import axios from 'axios'
import type { Ouvrage } from '../types/bibliotheque'

const BASE = '/api/ouvrages'

export const ouvrageApi = {
  findAll: () => axios.get<Ouvrage[]>(BASE).then(r => r.data),
  findById: (id: number) => axios.get<Ouvrage>(`${BASE}/${id}`).then(r => r.data),
  create: (o: Ouvrage) => axios.post<Ouvrage>(BASE, o).then(r => r.data),
  update: (id: number, o: Ouvrage) => axios.put<Ouvrage>(`${BASE}/${id}`, o).then(r => r.data),
  exportPdf: () => axios.get(`${BASE}/export/pdf`, { responseType: 'blob' }).then(r => r.data),
  exportExcel: () => axios.get(`${BASE}/export/excel`, { responseType: 'blob' }).then(r => r.data),
}
