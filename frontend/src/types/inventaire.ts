export type EtatMateriel = 'BON' | 'MOYEN' | 'HORS_SERVICE' | 'EN_REPARATION'
export type StatutBien = 'ACTIF' | 'REFORME' | 'TRANSFERE'
export type TypeMouvement = 'TRANSFERT' | 'REFORME'

export interface Affectation {
  id: number
  code: string
  libelle: string
}

export interface BienInventaire {
  id?: number
  numeroInventaire?: string
  designation: string
  marqueModele?: string
  dateAcquisition: string
  prixAchat: number
  affectation?: Affectation
  affectationLibre?: string
  etatMateriel: EtatMateriel
  observations?: string
  statut?: StatutBien
  createdAt?: string
}

export interface MouvementInventaire {
  id: number
  typeMouvement: TypeMouvement
  dateOperation: string
  affectationSource?: string
  affectationDestination?: string
  motif: string
  visa?: string
}

export interface TransfertRequest {
  affectationId?: number
  affectationLibre?: string
  motif: string
  visa?: string
}

export interface ReformeRequest {
  motif: string
  visa?: string
}
