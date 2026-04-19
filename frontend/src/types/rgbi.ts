export type TypeBonEntree = 'COMMANDE_FOURNISSEUR' | 'RETOUR_SERVICE'
export type TypeBonSortie = 'DEMANDE' | 'SORTIE_DIRECTE'
export type StatutBonEntree = 'BROUILLON' | 'VALIDE'
export type StatutBonSortie = 'EN_ATTENTE' | 'APPROUVE' | 'TRAITE' | 'REJETE'

export interface LigneBonEntree {
  id?: number
  article: { id: number; articleCode: string; articleName: string; stock: number }
  quantite: number
  prixUnitaire: number
}

export interface LigneBonSortie {
  id?: number
  article: { id: number; articleCode: string; articleName: string; stock: number }
  quantite: number
}

export interface BonEntree {
  id?: number
  numeroBon?: string
  typeBon: TypeBonEntree
  dateBon: string
  fournisseur?: { id: number; producerName: string }
  serviceSource?: { id: number; libelle: string }
  statut?: StatutBonEntree
  visa?: string
  observations?: string
  lignes: LigneBonEntree[]
  createdAt?: string
}

export interface BonSortie {
  id?: number
  numeroBon?: string
  typeBon: TypeBonSortie
  dateBon: string
  serviceDestination: { id: number; libelle: string }
  statut?: StatutBonSortie
  visaMagasinier?: string
  visaApprobateur?: string
  observations?: string
  lignes: LigneBonSortie[]
  createdAt?: string
}

export interface ApprouverRequest {
  visaApprobateur: string
}

export interface RejeterRequest {
  motif: string
}
