export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: 'client' | 'proprietaire' | 'admin' | 'agence';
  password: string;
  statut: 'actif' | 'suspendu' | 'inactif' | 'banni';
  kyc: 'non_soumis' | 'en_attente' | 'valide' | 'refuse' | 'expire';
  dateInscription: string;
  avatar: string;
  ville?: string;
  adresse?: string;
  nomAgence?: string;
}



export interface Vehicle {
  id: string;
  proprietaireId: string;
  agenceId?: string;
  marque: string;
  modele: string;
  annee: number;
  categorie: string;
  carburant: string;
  transmission: string;
  type: 'location' | 'vente';
  prixVente?: number;
  places: number;
  climatisation: boolean;
  prixJour?: number;
  prixSemaine?: number;
  prixMois?: number;
  disponible: boolean;
  statut: 'en_attente' | 'valide' | 'refuse' | 'vendu' | 'en_location';
  ville: string;
  couleur: string;
  kilometrage: number;
  immatriculation: string;
  description: string;
  images: string[];
  documents: string;
  rating: number;
  totalLocations: number;
}

export interface Location {
  id: string;
  vehiculeId: string;
  clientId: string;
  dateDebut: string;
  dateFin: string;
  prixTotal: number;
  statut: 'en_attente' | 'en_cours' | 'termine' | 'annule';
  paiement: string;
  createdAt: string;
}

export interface Agence {
  id: string;
  userId: string;
  nom: string;
  adresse: string;
  ville: string;
  telephone: string;
  email: string;
  vehiculesCount: number;
  statut: string;
  dateCreation: string;
}

export interface Incident {
  id: string;
  locationId: string;
  clientId: string;
  type: string;
  description: string;
  statut: string;
  dateDeclaration: string;
  photos: string[];
}

export interface AuditLog {
  id: string;
  action: string;
  utilisateur: string;
  details: string;
  date: string;
  ip: string;
}

export interface CalendarEvent {
  id: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  type: string;
  label: string;
}

export interface ToastMessage {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

export interface Demande {
  id: string;
  vehiculeId: string;
  clientId: string;
  type: 'location' | 'achat';
  statut: 'nouveau' | 'en_attente_proprietaire' | 'valide' | 'refuse' | 'termine';
  messageClient?: string;
  messageAdmin?: string;
  dateDebut?: string;
  dateFin?: string;
  prixEstime?: number;
  createdAt: string;
  updatedAt: string;
}
