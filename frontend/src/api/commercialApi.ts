import axios from 'axios'
import type { Article, Client, Vendeur, Facture } from '../types/commercial'

const BASE = 'http://localhost:8080'

export const articleApi = {
  findAll: () => axios.get<Article[]>(`${BASE}/articles`).then(r => r.data),
  findById: (id: number) => axios.get<Article>(`${BASE}/articles/${id}`).then(r => r.data),
  create: (a: Article) => axios.post<Article>(`${BASE}/articles`, a).then(r => r.data),
  update: (id: number, a: Article) => axios.put<Article>(`${BASE}/articles/${id}`, a).then(r => r.data),
}

export const clientApi = {
  findAll: () => axios.get<Client[]>(`${BASE}/clients`).then(r => r.data),
  findById: (id: number) => axios.get<Client>(`${BASE}/clients/${id}`).then(r => r.data),
  create: (c: Client) => axios.post<Client>(`${BASE}/clients`, c).then(r => r.data),
  update: (id: number, c: Client) => axios.put<Client>(`${BASE}/clients/${id}`, c).then(r => r.data),
}

export const vendeurApi = {
  findAll: () => axios.get<Vendeur[]>(`${BASE}/vendeurs`).then(r => r.data),
  findById: (id: number) => axios.get<Vendeur>(`${BASE}/vendeurs/${id}`).then(r => r.data),
  create: (v: Vendeur) => axios.post<Vendeur>(`${BASE}/vendeurs`, v).then(r => r.data),
  update: (id: number, v: Vendeur) => axios.put<Vendeur>(`${BASE}/vendeurs/${id}`, v).then(r => r.data),
}

export const factureApi = {
  findAll: () => axios.get<Facture[]>(`${BASE}/factures`).then(r => r.data),
  findById: (id: number) => axios.get<Facture>(`${BASE}/factures/${id}`).then(r => r.data),
  create: (f: Facture) => axios.post<Facture>(`${BASE}/factures`, f).then(r => r.data),
  update: (id: number, f: Facture) => axios.put<Facture>(`${BASE}/factures/${id}`, f).then(r => r.data),
}
