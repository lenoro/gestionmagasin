export type TypeCarburant = 'GASOIL' | 'ESSENCE' | 'GPL'
export type StatutAppro = 'BROUILLON' | 'VALIDE'
export type StatutVehicule = 'ACTIF' | 'INACTIF'

export interface Vehicule {
  id?: number
  immatriculation: string
  marque: string
  modele?: string
  typeCarburant: TypeCarburant
  chauffeurHabituel?: string
  observations?: string
  statut?: StatutVehicule
}

export interface StockCarburant {
  id?: number
  typeCarburant: TypeCarburant
  quantiteLitres: number
}

export interface BonApprovisionnement {
  id?: number
  numeroBon?: string
  dateBon: string
  fournisseur: { id: number; producerName: string }
  typeCarburant: TypeCarburant
  quantiteLitres: number
  prixUnitaire: number
  statut?: StatutAppro
  observations?: string
  createdAt?: string
}

export interface BonDistribution {
  id?: number
  numeroBon?: string
  dateBon: string
  vehicule: { id: number; immatriculation: string; marque: string; typeCarburant: TypeCarburant }
  typeCarburant: TypeCarburant
  quantiteLitres: number
  kilometrage?: number | null
  chauffeur?: string
  visa?: string
  observations?: string
  createdAt?: string
}
