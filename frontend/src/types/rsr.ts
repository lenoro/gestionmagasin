export type StatutReparation = 'EN_ATTENTE' | 'ENVOYE_ATELIER' | 'RETOURNE' | 'CLOS'

export interface LigneFicheReparation {
  id?: number
  article: { id: number; articleCode: string; designation: string; stock: number }
  quantite: number
}

export interface FicheReparation {
  id?: number
  numeroFiche?: string
  bien: { id: number; designation: string; numeroInventaire: string }
  motif: string
  statut?: StatutReparation
  reparateur?: string
  fournisseur?: { id: number; producerName: string } | null
  coutReparation?: number | null
  dateEnvoi?: string | null
  dateRetour?: string | null
  dateCloture?: string | null
  observations?: string
  lignes: LigneFicheReparation[]
  createdAt?: string
}
