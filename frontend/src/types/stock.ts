export interface Grade {
  id?: number
  libelle: string
}

export interface FonctionRef {
  id?: number
  libelle: string
}

export interface ServiceRef {
  id?: number
  libelle: string
}

export interface Famille {
  id?: number
  code: string
  libelle: string
  description?: string
}

export interface Unite {
  id?: number
  code: string
  libelle: string
}

export interface Fournisseur {
  id?: number
  code?: string
  raisonSociale: string
  adresse?: string
  ville?: string
  telephone?: string
  email?: string
  nif?: string
  rc?: string
  contactNom?: string
  delaiPaiementJours?: number
  actif?: boolean
}

export interface Depot {
  id?: number
  code?: string
  libelle: string
  adresse?: string
  responsable?: string
  actif?: boolean
}

export interface Employe {
  id?: number
  matricule?: string
  nom: string
  prenom?: string
  grade?: string
  fonction?: string
  service?: string
  telephone?: string
  email?: string
  actif?: boolean
}

export interface Produit {
  id?: number
  reference?: string
  designation: string
  description?: string
  famille?: Famille
  unite?: Unite
  fournisseurPrefere?: Fournisseur
  prixAchatMoyen?: number
  prixUnitaire?: number
  stockActuel?: number
  stockMinimum?: number
  stockMaximum?: number
  emplacement?: string
  typeArticle?: string
  categorie?: string
  actif?: boolean
}

export interface BonEntreeLigneGS {
  id?: number
  produit?: Produit
  quantite: number
  prixUnitaire?: number
}

export interface BonEntreeGS {
  id?: number
  numero?: string
  dateEntree: string
  fournisseur?: Fournisseur
  depot?: Depot
  numeroBLFournisseur?: string
  agentReception?: string
  statut?: string
  notes?: string
  lignes?: BonEntreeLigneGS[]
}

export interface BonSortieLigneGS {
  id?: number
  produit?: Produit
  quantiteDemandee: number
  quantiteServie?: number
  prixUnitaire?: number
}

export interface BonSortieGS {
  id?: number
  numero?: string
  dateSortie: string
  employe?: Employe
  depot?: Depot
  agentMagasin?: string
  statut?: string
  motif?: string
  notes?: string
  lignes?: BonSortieLigneGS[]
}
