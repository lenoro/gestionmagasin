export type Domaine = 'INFORMATIQUE' | 'GESTION' | 'DROIT' | 'TECHNIQUE' | 'SCIENCES' | 'LANGUES' | 'AUTRE'

export const DOMAINES: Domaine[] = ['INFORMATIQUE', 'GESTION', 'DROIT', 'TECHNIQUE', 'SCIENCES', 'LANGUES', 'AUTRE']

export const DOMAINE_BADGE: Record<Domaine, string> = {
  INFORMATIQUE: 'bg-blue-100 text-blue-800',
  GESTION: 'bg-purple-100 text-purple-800',
  DROIT: 'bg-red-100 text-red-800',
  TECHNIQUE: 'bg-orange-100 text-orange-800',
  SCIENCES: 'bg-green-100 text-green-800',
  LANGUES: 'bg-yellow-100 text-yellow-800',
  AUTRE: 'bg-gray-100 text-gray-800',
}

export interface Ouvrage {
  id?: number
  numeroOuvrage?: string
  titre: string
  auteur: string
  isbn?: string
  editeur?: string
  domaine: Domaine
  anneePublication?: number | null
  localisation?: string
  nbreExemplaires?: number
  createdAt?: string
}
