export type CategorieArticle = 'CONSOMMABLE' | 'NON_CONSOMMABLE'

export interface Article {
  id?: number
  articleCode?: string
  articleName: string
  description?: string
  price: number
  stock?: number
  categorie?: CategorieArticle
}

export interface Client {
  id?: number
  clientCode?: string
  clientName: string
  email?: string
  phone?: string
  address?: string
}

export interface Vendeur {
  id?: number
  vendorCode?: string
  vendorName: string
  contactEmail?: string
  phone?: string
}

export interface ItemFacture {
  id?: number
  article?: Article
  quantity: number
  unitPrice: number
  lineTotal?: number
}

export interface Facture {
  id?: number
  invoiceNumber?: string
  invoiceDate: string
  client: Client
  vendeur?: Vendeur | null
  totalAmount?: number
  status?: string
  items?: ItemFacture[]
}
