export type TypeBonEntree = 'COMMANDE_FOURNISSEUR' | 'RETOUR_SERVICE'
export type TypeBonSortie = 'DEMANDE' | 'SORTIE_DIRECTE'
export type StatutBonEntree = 'BROUILLON' | 'VALIDE'
export type StatutBonSortie = 'EN_ATTENTE' | 'APPROUVE' | 'TRAITE' | 'REJETE'
export type TypeSortie = 'CONSOMMATION_TP' | 'PRET_OUTILLAGE' | 'ADMINISTRATION'
export type TypeConsommateur = 'ENSEIGNANT' | 'STAGIAIRE' | 'ADMINISTRATION'

export interface Consommateur {
  id?: number
  nomPrenom: string
  serviceAtelier?: string
  typeConsommateur: TypeConsommateur
  telephone?: string
  actif?: boolean
}

export interface LigneBonEntree {
  id?: number
  article: { id: number; articleCode: string; articleName: string; stock: number; categorie?: string }
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
  fournisseur?: { id: number; raisonSociale: string; code?: string }
  numBonLivraison?: string
  numBonCommande?: string
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
  typeSortie?: TypeSortie
  dateBon: string
  serviceDestination: { id: number; libelle: string }
  consommateur?: { id: number; nomPrenom: string; serviceAtelier?: string }
  statut?: StatutBonSortie
  visaDemandeur?: string
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

// ── Rapports ─────────────────────────────────────────────────────
export interface FiltresRapport {
  dateDebut?: string
  dateFin?: string
  fournisseurId?: number
  affectationId?: number
  consommateurId?: number
}

export interface LigneConsommation {
  articleCode: string
  articleName: string
  numNomenclature: string
  unitesMesure: string
  qteTotal: number
  services: string
  consommateurs: string
}

export interface ArticleBesoin {
  articleCode: string
  articleName: string
  numNomenclature: string
  unitesMesure: string
  stockActuel: number
  stockMinimum: number
  qteACommander: number
}

export interface BienInventaireRapport {
  id: number
  numeroInventaire: string
  designation: string
  marqueModele?: string
  dateAcquisition: string
  prixAchat: number
  etatMateriel: string
  statut: string
  affectation?: { id: number; libelle: string }
  affectationLibre?: string
  observations?: string
}
