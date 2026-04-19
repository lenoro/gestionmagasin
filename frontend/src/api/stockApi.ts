import axios from 'axios'
import type { Grade, FonctionRef, ServiceRef, Famille, Unite, Fournisseur, Depot, Employe, Produit, BonEntreeGS, BonSortieGS } from '../types/stock'

// API principale du backend GestionMagasin — localhost en dev, relatif en prod
const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:8080' : ''
const apiAxios = axios.create({ baseURL: API_BASE })

// ─── APIs référentiels (Grade, Fonction, Service, Employe) — port 8080 ───
export const gradeApi = {
  findAll: () => apiAxios.get<Grade[]>('/api/grades').then(r => r.data),
  create: (g: Grade) => apiAxios.post<Grade>('/api/grades', g).then(r => r.data),
  update: (id: number, g: Grade) => apiAxios.put<Grade>(`/api/grades/${id}`, g).then(r => r.data),
  delete: (id: number) => apiAxios.delete(`/api/grades/${id}`),
}

export const fonctionApi = {
  findAll: () => apiAxios.get<FonctionRef[]>('/api/fonctions').then(r => r.data),
  create: (f: FonctionRef) => apiAxios.post<FonctionRef>('/api/fonctions', f).then(r => r.data),
  update: (id: number, f: FonctionRef) => apiAxios.put<FonctionRef>(`/api/fonctions/${id}`, f).then(r => r.data),
  delete: (id: number) => apiAxios.delete(`/api/fonctions/${id}`),
}

export const serviceRefApi = {
  findAll: () => apiAxios.get<ServiceRef[]>('/api/services-ref').then(r => r.data),
  create: (s: ServiceRef) => apiAxios.post<ServiceRef>('/api/services-ref', s).then(r => r.data),
  update: (id: number, s: ServiceRef) => apiAxios.put<ServiceRef>(`/api/services-ref/${id}`, s).then(r => r.data),
  delete: (id: number) => apiAxios.delete(`/api/services-ref/${id}`),
}

export const employeApiV2 = {
  findAll: () => apiAxios.get<Employe[]>('/api/employes').then(r => r.data),
  findActifs: () => apiAxios.get<Employe[]>('/api/employes/actifs').then(r => r.data),
  create: (e: Employe) => apiAxios.post<Employe>('/api/employes', e).then(r => r.data),
  update: (id: number, e: Employe) => apiAxios.put<Employe>(`/api/employes/${id}`, e).then(r => r.data),
  delete: (id: number) => apiAxios.delete(`/api/employes/${id}`),
}

const GS_BASE = 'http://localhost:8081'
const TOKEN_KEY = 'gs_token'

// Instance axios dédiée à GestionStock avec le token JWT
const gsAxios = axios.create({ baseURL: GS_BASE })

gsAxios.interceptors.request.use(config => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

gsAxios.interceptors.response.use(
  res => res,
  error => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem(TOKEN_KEY)
      window.location.href = '/gs-login'
    }
    return Promise.reject(error)
  }
)

export const stockAuthApi = {
  login: (username: string, password: string) =>
    axios.post<{ token: string; username: string; role: string }>(
      `${GS_BASE}/auth/login`, { username, password }
    ).then(r => {
      localStorage.setItem(TOKEN_KEY, r.data.token)
      return r.data
    }),
  logout: () => localStorage.removeItem(TOKEN_KEY),
  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),
  getUsername: () => localStorage.getItem('gs_username'),
}

export const familleApi = {
  findAll: () => gsAxios.get<Famille[]>('/familles').then(r => r.data),
  create: (f: Famille) => gsAxios.post<Famille>('/familles', f).then(r => r.data),
  update: (id: number, f: Famille) => gsAxios.put<Famille>(`/familles/${id}`, f).then(r => r.data),
  delete: (id: number) => gsAxios.delete(`/familles/${id}`),
}

export const uniteApi = {
  findAll: () => gsAxios.get<Unite[]>('/unites').then(r => r.data),
  create: (u: Unite) => gsAxios.post<Unite>('/unites', u).then(r => r.data),
  update: (id: number, u: Unite) => gsAxios.put<Unite>(`/unites/${id}`, u).then(r => r.data),
  delete: (id: number) => gsAxios.delete(`/unites/${id}`),
}

export const fournisseurApi = {
  findAll: () => gsAxios.get<Fournisseur[]>('/fournisseurs').then(r => r.data),
  findActifs: () => gsAxios.get<Fournisseur[]>('/fournisseurs/actifs').then(r => r.data),
  create: (f: Fournisseur) => gsAxios.post<Fournisseur>('/fournisseurs', f).then(r => r.data),
  update: (id: number, f: Fournisseur) => gsAxios.put<Fournisseur>(`/fournisseurs/${id}`, f).then(r => r.data),
  delete: (id: number) => gsAxios.delete(`/fournisseurs/${id}`),
}

export const depotApi = {
  findAll: () => gsAxios.get<Depot[]>('/depots').then(r => r.data),
  findActifs: () => gsAxios.get<Depot[]>('/depots/actifs').then(r => r.data),
  create: (d: Depot) => gsAxios.post<Depot>('/depots', d).then(r => r.data),
  update: (id: number, d: Depot) => gsAxios.put<Depot>(`/depots/${id}`, d).then(r => r.data),
  delete: (id: number) => gsAxios.delete(`/depots/${id}`),
}

export const employeApi = {
  findAll: () => gsAxios.get<Employe[]>('/employes').then(r => r.data),
  findActifs: () => gsAxios.get<Employe[]>('/employes/actifs').then(r => r.data),
  create: (e: Employe) => gsAxios.post<Employe>('/employes', e).then(r => r.data),
  update: (id: number, e: Employe) => gsAxios.put<Employe>(`/employes/${id}`, e).then(r => r.data),
  delete: (id: number) => gsAxios.delete(`/employes/${id}`),
}

export const produitApi = {
  findAll: () => gsAxios.get<Produit[]>('/produits').then(r => r.data),
  findActifs: () => gsAxios.get<Produit[]>('/produits/actifs').then(r => r.data),
  search: (q: string) => gsAxios.get<Produit[]>(`/produits/search?q=${q}`).then(r => r.data),
  alertes: () => gsAxios.get<Produit[]>('/produits/alertes').then(r => r.data),
  create: (p: Produit) => gsAxios.post<Produit>('/produits', p).then(r => r.data),
  update: (id: number, p: Produit) => gsAxios.put<Produit>(`/produits/${id}`, p).then(r => r.data),
  delete: (id: number) => gsAxios.delete(`/produits/${id}`),
}

export const bonEntreeGSApi = {
  findAll: () => gsAxios.get<BonEntreeGS[]>('/bons-entree').then(r => r.data),
  findById: (id: number) => gsAxios.get<BonEntreeGS>(`/bons-entree/${id}`).then(r => r.data),
  create: (b: BonEntreeGS) => gsAxios.post<BonEntreeGS>('/bons-entree', b).then(r => r.data),
  valider: (id: number) => gsAxios.post(`/bons-entree/${id}/valider`).then(r => r.data),
  annuler: (id: number) => gsAxios.post(`/bons-entree/${id}/annuler`).then(r => r.data),
  delete: (id: number) => gsAxios.delete(`/bons-entree/${id}`),
}

export const bonSortieGSApi = {
  findAll: () => gsAxios.get<BonSortieGS[]>('/bons-sortie').then(r => r.data),
  findById: (id: number) => gsAxios.get<BonSortieGS>(`/bons-sortie/${id}`).then(r => r.data),
  create: (b: BonSortieGS) => gsAxios.post<BonSortieGS>('/bons-sortie', b).then(r => r.data),
  valider: (id: number) => gsAxios.post(`/bons-sortie/${id}/valider`).then(r => r.data),
  annuler: (id: number) => gsAxios.post(`/bons-sortie/${id}/annuler`).then(r => r.data),
  delete: (id: number) => gsAxios.delete(`/bons-sortie/${id}`),
}
