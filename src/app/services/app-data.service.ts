import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { User, Vehicle, Location, Agence, Incident, AuditLog, Demande } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AppDataService {
    currentUser: User | null;
    users: User[];
    vehicules: Vehicle[];
    locations: Location[];
    agences: Agence[];
    favoris: string[];
    incidents: Incident[];
    auditLog: AuditLog[];
    demandes: Demande[];

    readonly OTP_CODES: Record<string, string> = {
        'admin@autoloc.com': '1234',
        'mamadou@email.com': '1111',
        'aissatou@email.com': '2222',
        'ibrahima@email.com': '3333',
        'mohamed@email.com': '4444',
        'alpha@email.com': '5555',
        'fatoumata@email.com': '6666',
        'oumar@email.com': '7777',
        'agence@autoloc.com': '8888',
        'mariama.agence@email.com': '9999',
        '_default': '0000'
    };

    constructor(private storage: StorageService) {
        this.currentUser = this.storage.get<User>('currentUser');

        this.users = this.storage.get<User[]>('users', [
            { id: 'u1', nom: 'Diallo', prenom: 'Mamadou', email: 'mamadou@email.com', telephone: '+224 621 00 00 00', role: 'client', password: 'Test1234', statut: 'actif', kyc: 'valide', dateInscription: '2025-11-15', avatar: '', ville: 'Conakry', adresse: '123 Rue de la République' },
            { id: 'u2', nom: 'Camara', prenom: 'Aissatou', email: 'aissatou@email.com', telephone: '+224 622 00 00 00', role: 'client', password: 'Test1234', statut: 'actif', kyc: 'en_attente', dateInscription: '2025-12-01', avatar: '', ville: 'Conakry', adresse: '45 Avenue de la Gare' },
            { id: 'u3', nom: 'Bah', prenom: 'Ibrahima', email: 'ibrahima@email.com', telephone: '+224 623 00 00 00', role: 'proprietaire', password: 'Test1234', statut: 'actif', kyc: 'valide', dateInscription: '2025-10-20', avatar: '', nomAgence: 'Bah Auto Location', ville: 'Conakry', adresse: '78 Boulevard du Commerce' },
            { id: 'u4', nom: 'Soumah', prenom: 'Mohamed', email: 'mohamed@email.com', telephone: '+224 624 00 00 00', role: 'proprietaire', password: 'Test1234', statut: 'actif', kyc: 'valide', dateInscription: '2025-09-10', avatar: '', nomAgence: 'Soumah Cars', ville: 'Conakry', adresse: '22 Rue du Port' },
            { id: 'u5', nom: 'Admin', prenom: 'Super', email: 'admin@autoloc.com', telephone: '+224 625 00 00 00', role: 'admin', password: 'Admin1234', statut: 'actif', kyc: 'valide', dateInscription: '2025-01-01', avatar: '' },
            { id: 'u6', nom: 'Barry', prenom: 'Fatoumata', email: 'fatoumata@email.com', telephone: '+224 626 00 00 00', role: 'client', password: 'Test1234', statut: 'suspendu', kyc: 'refuse', dateInscription: '2025-12-15', avatar: '', ville: 'Labé', adresse: '12 Rue Centrale' },
            { id: 'u7', nom: 'Condé', prenom: 'Alpha', email: 'alpha@email.com', telephone: '+224 627 00 00 00', role: 'client', password: 'Test1234', statut: 'actif', kyc: 'non_soumis', dateInscription: '2026-01-05', avatar: '', ville: 'Kankan', adresse: '5 Avenue Principale' },
            { id: 'u8', nom: 'Sylla', prenom: 'Oumar', email: 'oumar@email.com', telephone: '+224 628 00 00 00', role: 'proprietaire', password: 'Test1234', statut: 'actif', kyc: 'valide', dateInscription: '2025-08-25', avatar: '', nomAgence: 'Sylla Motors', ville: 'Conakry', adresse: '90 Route du Niger' },
            { id: 'u9', nom: 'Touré', prenom: 'Abdoulaye', email: 'agence@autoloc.com', telephone: '+224 629 00 00 00', role: 'agence', password: 'Agence1234', statut: 'actif', kyc: 'valide', dateInscription: '2025-06-15', avatar: '', nomAgence: 'AutoLoc Conakry', ville: 'Conakry', adresse: '100 Boulevard de la Paix' },
            { id: 'u10', nom: 'Keita', prenom: 'Mariama', email: 'mariama.agence@email.com', telephone: '+224 630 00 00 00', role: 'agence', password: 'Agence1234', statut: 'actif', kyc: 'valide', dateInscription: '2025-07-01', avatar: '', nomAgence: 'Keita Location Services', ville: 'Kindia', adresse: '15 Rue Commerciale' },
        ]) as User[];

        this.vehicules = this.storage.get<Vehicle[]>('vehicules', [
            { id: 'v1', proprietaireId: 'u3', marque: 'Toyota', modele: 'Land Cruiser', annee: 2024, categorie: 'SUV', carburant: 'Diesel', transmission: 'Automatique', type: 'location', places: 7, climatisation: true, prixJour: 350000, prixSemaine: 2100000, prixMois: 7500000, disponible: true, statut: 'valide', ville: 'Conakry', couleur: 'Blanc', kilometrage: 15000, immatriculation: 'RC 1234 A', description: 'Toyota Land Cruiser V8 en excellent état, climatisé, GPS intégré.', images: ['https://images.unsplash.com/photo-1594563703937-fdc640497dcd?q=80&w=800'], documents: 'valide', rating: 4.8, totalLocations: 45 },
            { id: 'v2', proprietaireId: 'u3', marque: 'Mercedes', modele: 'Classe E', annee: 2023, categorie: 'Berline', carburant: 'Essence', transmission: 'Automatique', type: 'location', places: 5, climatisation: true, prixJour: 500000, prixSemaine: 3000000, prixMois: 10000000, disponible: true, statut: 'valide', ville: 'Conakry', couleur: 'Noir', kilometrage: 22000, immatriculation: 'RC 5678 B', description: 'Mercedes Classe E 300, intérieur cuir, toit ouvrant.', images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800'], documents: 'valide', rating: 4.9, totalLocations: 32 },
            { id: 'v3', proprietaireId: 'u4', marque: 'Hyundai', modele: 'Tucson', annee: 2024, categorie: 'SUV', carburant: 'Essence', transmission: 'Automatique', type: 'location', places: 5, climatisation: true, prixJour: 250000, prixSemaine: 1500000, prixMois: 5000000, disponible: true, statut: 'valide', ville: 'Conakry', couleur: 'Gris', kilometrage: 8000, immatriculation: 'RC 9012 C', description: 'Hyundai Tucson N Line, caméra 360°, aide au stationnement.', images: ['https://images.unsplash.com/photo-1704381987595-5fa2863be246?q=80&w=800'], documents: 'valide', rating: 4.6, totalLocations: 28 },
            { id: 'v4', proprietaireId: 'u4', marque: 'Toyota', modele: 'Hilux', annee: 2023, categorie: 'Pick-up', carburant: 'Diesel', transmission: 'Manuelle', type: 'location', places: 5, climatisation: true, prixJour: 200000, prixSemaine: 1200000, prixMois: 4000000, disponible: false, statut: 'valide', ville: 'Conakry', couleur: 'Rouge', kilometrage: 35000, immatriculation: 'RC 3456 D', description: 'Toyota Hilux double cabine, parfait pour tous terrains.', images: ['https://images.unsplash.com/photo-1601002221663-e382d54a6132?q=80&w=800'], documents: 'valide', rating: 4.5, totalLocations: 56 },
            { id: 'v5', proprietaireId: 'u3', marque: 'BMW', modele: 'X5', annee: 2024, categorie: 'SUV', carburant: 'Diesel', transmission: 'Automatique', type: 'location', places: 5, climatisation: true, prixJour: 450000, prixSemaine: 2700000, prixMois: 9000000, disponible: true, statut: 'en_attente', ville: 'Conakry', couleur: 'Bleu', kilometrage: 5000, immatriculation: 'RC 7890 E', description: 'BMW X5 M Sport, écran panoramique, son Harman Kardon.', images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800'], documents: 'en_attente', rating: 0, totalLocations: 0 },
            { id: 'v6', proprietaireId: 'u8', marque: 'Renault', modele: 'Duster', annee: 2023, categorie: 'SUV', carburant: 'Essence', transmission: 'Manuelle', type: 'vente', places: 5, climatisation: true, prixVente: 120000000, disponible: true, statut: 'valide', ville: 'Conakry', couleur: 'Vert', kilometrage: 42000, immatriculation: 'RC 2345 F', description: 'Renault Duster 4x4, idéal pour les routes difficiles.', images: ['https://images.unsplash.com/photo-1688647714881-432298c4642f?q=80&w=800'], documents: 'valide', rating: 4.3, totalLocations: 67 },
            { id: 'v7', proprietaireId: 'u8', marque: 'Toyota', modele: 'Corolla', annee: 2024, categorie: 'Berline', carburant: 'Hybride', transmission: 'Automatique', type: 'location', places: 5, climatisation: true, prixJour: 180000, prixSemaine: 1100000, prixMois: 3500000, disponible: true, statut: 'valide', ville: 'Conakry', couleur: 'Argent', kilometrage: 12000, immatriculation: 'RC 6789 G', description: 'Toyota Corolla Hybride, économique et confortable.', images: ['https://images.unsplash.com/photo-1623859627214-bf7388612ca8?q=80&w=800'], documents: 'valide', rating: 4.7, totalLocations: 38 },
            { id: 'v8', proprietaireId: 'u4', marque: 'Ford', modele: 'Ranger', annee: 2023, categorie: 'Pick-up', carburant: 'Diesel', transmission: 'Automatique', type: 'vente', places: 5, climatisation: true, prixVente: 250000000, disponible: true, statut: 'valide', ville: 'Conakry', couleur: 'Noir', kilometrage: 28000, immatriculation: 'RC 0123 H', description: 'Ford Ranger Wildtrak, puissant et robuste.', images: ['https://images.unsplash.com/photo-1611016186353-9af58c69a533?q=80&w=800'], documents: 'valide', rating: 4.4, totalLocations: 41 },
            { id: 'v9', proprietaireId: 'u9', marque: 'Peugeot', modele: '3008', annee: 2024, categorie: 'SUV', carburant: 'Diesel', transmission: 'Automatique', type: 'location', places: 5, climatisation: true, prixJour: 300000, prixSemaine: 1800000, prixMois: 6000000, disponible: true, statut: 'valide', ville: 'Conakry', couleur: 'Bleu', kilometrage: 10000, immatriculation: 'RC 4567 I', description: 'Peugeot 3008 GT Line, très confortable.', images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800'], documents: 'valide', rating: 4.6, totalLocations: 15 },
            { id: 'v10', proprietaireId: 'u10', marque: 'Kia', modele: 'Sportage', annee: 2024, categorie: 'SUV', carburant: 'Essence', transmission: 'Automatique', type: 'location', places: 5, climatisation: true, prixJour: 220000, prixSemaine: 1300000, prixMois: 4500000, disponible: true, statut: 'valide', ville: 'Kindia', couleur: 'Blanc', kilometrage: 7000, immatriculation: 'KA 1234 A', description: 'Kia Sportage dernière génération, moderne et économique.', images: ['https://images.unsplash.com/photo-1631505310214-cc2180556209?q=80&w=800'], documents: 'valide', rating: 4.5, totalLocations: 22 },
            { id: 'v11', proprietaireId: 'u3', marque: 'Audi', modele: 'A6', annee: 2024, categorie: 'Berline', carburant: 'Essence', transmission: 'Automatique', type: 'location', places: 5, climatisation: true, prixJour: 600000, prixSemaine: 3600000, prixMois: 12000000, disponible: true, statut: 'valide', ville: 'Conakry', couleur: 'Gris Nardo', kilometrage: 3000, immatriculation: 'RC 1111 X', description: 'Audi A6 Quattro, élégance et performance.', images: ['https://images.unsplash.com/photo-1621359953476-b04955648282?q=80&w=800'], documents: 'valide', rating: 4.9, totalLocations: 5 },
            { id: 'v12', proprietaireId: 'u4', marque: 'Land Rover', modele: 'Defender', annee: 2023, categorie: 'SUV', carburant: 'Diesel', transmission: 'Automatique', type: 'location', places: 5, climatisation: true, prixJour: 700000, prixSemaine: 4200000, prixMois: 15000000, disponible: true, statut: 'valide', ville: 'Conakry', couleur: 'Gris Sable', kilometrage: 12000, immatriculation: 'RC 2222 Y', description: 'Land Rover Defender 110, franchisseur hors pair.', images: ['https://images.unsplash.com/photo-1605515298946-d062f2e9da53?q=80&w=800'], documents: 'valide', rating: 5.0, totalLocations: 12 },
            { id: 'v13', proprietaireId: 'u8', marque: 'Volkswagen', modele: 'Tiguan', annee: 2024, categorie: 'SUV', carburant: 'Essence', transmission: 'Automatique', type: 'location', places: 5, climatisation: true, prixJour: 280000, prixSemaine: 1700000, prixMois: 5500000, disponible: true, statut: 'valide', ville: 'Conakry', couleur: 'Blanc', kilometrage: 4500, immatriculation: 'RC 3333 Z', description: 'VW Tiguan Allspace, confort familial assuré.', images: ['https://images.unsplash.com/photo-1549611016-3a70d82b5040?q=80&w=800'], documents: 'valide', rating: 4.7, totalLocations: 8 },
            { id: 'v14', proprietaireId: 'u9', marque: 'Nissan', modele: 'Patrol', annee: 2024, categorie: 'SUV', carburant: 'Essence', transmission: 'Automatique', type: 'location', places: 8, climatisation: true, prixJour: 400000, prixSemaine: 2400000, prixMois: 8500000, disponible: true, statut: 'valide', ville: 'Conakry', couleur: 'Noir', kilometrage: 6000, immatriculation: 'RC 4444 J', description: 'Nissan Patrol V8 Titanium Edition.', images: ['https://images.unsplash.com/photo-1606148301540-08f3316badbb?q=80&w=800'], documents: 'valide', rating: 4.8, totalLocations: 20 },
            { id: 'v15', proprietaireId: 'u3', marque: 'Lexus', modele: 'LX 600', annee: 2024, categorie: 'SUV', carburant: 'Essence', transmission: 'Automatique', type: 'location', places: 7, climatisation: true, prixJour: 800000, prixSemaine: 4800000, prixMois: 18000000, disponible: true, statut: 'valide', ville: 'Conakry', couleur: 'Blanc Perle', kilometrage: 1000, immatriculation: 'RC 5555 K', description: 'Lexus LX 600 Ultra Luxury, le summum du confort.', images: ['https://images.unsplash.com/photo-1617469767053-d3b508a042a2?q=80&w=800'], documents: 'valide', rating: 5.0, totalLocations: 2 },
            { id: 'v16', proprietaireId: 'u4', marque: 'Toyota', modele: 'Rav4', annee: 2024, categorie: 'SUV', carburant: 'Hybride', transmission: 'Automatique', type: 'vente', places: 5, climatisation: true, prixVente: 165000000, disponible: true, statut: 'valide', ville: 'Conakry', couleur: 'Bleu', kilometrage: 2500, immatriculation: 'RC 6666 L', description: 'Toyota Rav4 Hybrid Limited Edition.', images: ['https://images.unsplash.com/photo-1621285853634-913cddc3e5b3?q=80&w=800'], documents: 'valide', rating: 4.8, totalLocations: 0 },
            { id: 'v17', proprietaireId: 'u8', marque: 'Mitsubishi', modele: 'L200', annee: 2023, categorie: 'Pick-up', carburant: 'Diesel', transmission: 'Manuelle', type: 'vente', places: 5, climatisation: true, prixVente: 140000000, disponible: true, statut: 'valide', ville: 'Mamou', couleur: 'Blanc', kilometrage: 15000, immatriculation: 'RC 7777 M', description: 'Mitsubishi L200 Triton, robustesse légendaire.', images: ['https://images.unsplash.com/photo-1611016186353-9af58c69a533?q=80&w=800'], documents: 'valide', rating: 4.5, totalLocations: 0 },
            { id: 'v18', proprietaireId: 'u9', marque: 'Jeep', modele: 'Wrangler', annee: 2023, categorie: 'SUV', carburant: 'Essence', transmission: 'Automatique', type: 'location', places: 4, climatisation: true, prixJour: 450000, prixSemaine: 2700000, prixMois: 9000000, disponible: true, statut: 'valide', ville: 'Conakry', couleur: 'Rouge', kilometrage: 8000, immatriculation: 'RC 8888 N', description: 'Jeep Wrangler Rubicon, prêt pour l\'aventure.', images: ['https://images.unsplash.com/photo-1549416805-4f40f3532f8d?q=80&w=800'], documents: 'valide', rating: 4.9, totalLocations: 15 },
            { id: 'v19', proprietaireId: 'u10', marque: 'Suzuki', modele: 'Jimny', annee: 2024, categorie: 'SUV', carburant: 'Essence', transmission: 'Manuelle', type: 'location', places: 4, climatisation: true, prixJour: 180000, prixSemaine: 1100000, prixMois: 3800000, disponible: true, statut: 'valide', ville: 'Conakry', couleur: 'Jaune Kaki', kilometrage: 2000, immatriculation: 'RC 9999 O', description: 'Suzuki Jimny 5 portes, compact et agile.', images: ['https://images.unsplash.com/photo-1610450949065-9f203875569e?q=80&w=800'], documents: 'valide', rating: 4.7, totalLocations: 3 },
            { id: 'v20', proprietaireId: 'u3', marque: 'Porsche', modele: 'Cayenne', annee: 2024, categorie: 'SUV', carburant: 'Essence', transmission: 'Automatique', type: 'location', places: 5, climatisation: true, prixJour: 1000000, prixSemaine: 6000000, prixMois: 22000000, disponible: true, statut: 'valide', ville: 'Conakry', couleur: 'Noir', kilometrage: 1500, immatriculation: 'RC 0000 P', description: 'Porsche Cayenne Coupe, luxe et sportivité.', images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800'], documents: 'valide', rating: 5.0, totalLocations: 1 },
        ]) as Vehicle[];

        this.locations = this.storage.get<Location[]>('locations', [
            { id: 'l1', vehiculeId: 'v1', clientId: 'u1', dateDebut: '2026-02-10', dateFin: '2026-02-15', prixTotal: 1750000, statut: 'termine', paiement: 'payé', createdAt: '2026-02-08' },
            { id: 'l2', vehiculeId: 'v3', clientId: 'u1', dateDebut: '2026-02-20', dateFin: '2026-02-25', prixTotal: 1250000, statut: 'en_cours', paiement: 'payé', createdAt: '2026-02-18' },
            { id: 'l3', vehiculeId: 'v2', clientId: 'u2', dateDebut: '2026-01-15', dateFin: '2026-01-20', prixTotal: 2500000, statut: 'termine', paiement: 'payé', createdAt: '2026-01-13' },
            { id: 'l4', vehiculeId: 'v6', clientId: 'u7', dateDebut: '2026-03-01', dateFin: '2026-03-07', prixTotal: 900000, statut: 'en_attente', paiement: 'en_attente', createdAt: '2026-02-25' },
            { id: 'l5', vehiculeId: 'v4', clientId: 'u1', dateDebut: '2025-12-20', dateFin: '2025-12-27', prixTotal: 1200000, statut: 'termine', paiement: 'payé', createdAt: '2025-12-18' },
            { id: 'l6', vehiculeId: 'v7', clientId: 'u2', dateDebut: '2026-02-28', dateFin: '2026-03-05', prixTotal: 1100000, statut: 'en_cours', paiement: 'payé', createdAt: '2026-02-26' },
            { id: 'l7', vehiculeId: 'v9', clientId: 'u1', dateDebut: '2026-03-01', dateFin: '2026-03-04', prixTotal: 900000, statut: 'en_cours', paiement: 'payé', createdAt: '2026-02-28' },
        ]) as Location[];

        this.agences = this.storage.get<Agence[]>('agences', [
            { id: 'ag1', userId: 'u9', nom: 'AutoLoc Conakry', adresse: '100 Boulevard de la Paix', ville: 'Conakry', telephone: '+224 629 00 00 00', email: 'agence@autoloc.com', vehiculesCount: 3, statut: 'actif', dateCreation: '2025-06-15' },
            { id: 'ag2', userId: 'u10', nom: 'Keita Location Services', adresse: '15 Rue Commerciale', ville: 'Kindia', telephone: '+224 630 00 00 00', email: 'mariama.agence@email.com', vehiculesCount: 2, statut: 'actif', dateCreation: '2025-07-01' },
        ]) as Agence[];

        this.favoris = this.storage.get<string[]>('favoris', ['v1', 'v3', 'v7']) as string[];

        this.incidents = this.storage.get<Incident[]>('incidents', [
            { id: 'inc1', locationId: 'l1', clientId: 'u1', type: 'panne', description: 'Pneu crevé durant le trajet', statut: 'en_cours', dateDeclaration: '2026-02-12', photos: [] },
            { id: 'inc2', locationId: 'l3', clientId: 'u2', type: 'accident', description: 'Léger accrochage sur le parking', statut: 'termine', dateDeclaration: '2026-01-18', photos: [] },
        ]) as Incident[];

        this.auditLog = this.storage.get<AuditLog[]>('auditLog', [
            { id: 'a1', action: 'Connexion', utilisateur: 'admin@autoloc.com', details: 'Connexion réussie', date: '2026-02-28T10:30:00', ip: '192.168.1.1' },
            { id: 'a2', action: 'Validation KYC', utilisateur: 'admin@autoloc.com', details: 'KYC validé pour Mamadou Diallo', date: '2026-02-27T14:15:00', ip: '192.168.1.1' },
            { id: 'a3', action: 'Suspension', utilisateur: 'admin@autoloc.com', details: 'Compte de Fatoumata Barry suspendu', date: '2026-02-26T09:45:00', ip: '192.168.1.1' },
            { id: 'a4', action: 'Validation véhicule', utilisateur: 'admin@autoloc.com', details: 'Documents BMW X5 validés', date: '2026-02-25T16:20:00', ip: '192.168.1.1' },
            { id: 'a5', action: 'Inscription', utilisateur: 'alpha@email.com', details: 'Nouvel utilisateur inscrit', date: '2026-01-05T11:00:00', ip: '192.168.1.50' },
        ]) as AuditLog[];

        this.demandes = this.storage.get<Demande[]>('demandes', []) as Demande[];
    }

    getOTPForEmail(email: string): string {
        return this.OTP_CODES[email] || this.OTP_CODES['_default'];
    }

    generateId(): string {
        return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    // Après
    generateOTP(): string {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

    saveData(): void {
        this.storage.set('users', this.users);
        this.storage.set('vehicules', this.vehicules);
        this.storage.set('locations', this.locations);
        this.storage.set('agences', this.agences);
        this.storage.set('favoris', this.favoris);
        this.storage.set('incidents', this.incidents);
        this.storage.set('auditLog', this.auditLog);
        this.storage.set('demandes', this.demandes);
    }

    getStatusBadge(status: string): { cssClass: string; label: string; dot: boolean } {
        const config: Record<string, { cssClass: string; label: string; dot: boolean }> = {
            'non_soumis': { cssClass: 'badge-neutral', label: 'Non soumis', dot: true },
            'en_attente': { cssClass: 'badge-warning', label: 'En attente', dot: true },
            'valide': { cssClass: 'badge-success', label: 'Validé', dot: true },
            'refuse': { cssClass: 'badge-danger', label: 'Refusé', dot: true },
            'expire': { cssClass: 'badge-dark', label: 'Expiré', dot: true },
            'actif': { cssClass: 'badge-success', label: 'Actif', dot: true },
            'suspendu': { cssClass: 'badge-danger', label: 'Suspendu', dot: true },
            'inactif': { cssClass: 'badge-neutral', label: 'Inactif', dot: true },
            'disponible': { cssClass: 'badge-success', label: 'Disponible', dot: true },
            'loue': { cssClass: 'badge-primary', label: 'Loué', dot: true },
            'en_maintenance': { cssClass: 'badge-warning', label: 'En maintenance', dot: true },
            'en_cours': { cssClass: 'badge-info', label: 'En cours', dot: true },
            'termine': { cssClass: 'badge-success', label: 'Terminé', dot: true },
            'annule': { cssClass: 'badge-danger', label: 'Annulé', dot: true },
        };
        return config[status] || { cssClass: 'badge-neutral', label: status, dot: false };
    }

    getAvatarColor(name: string): string {
        const colors = [
            'linear-gradient(135deg, #3B82F6, #1D4ED8)',
            'linear-gradient(135deg, #10B981, #047857)',
            'linear-gradient(135deg, #F59E0B, #D97706)',
            'linear-gradient(135deg, #EF4444, #B91C1C)',
            'linear-gradient(135deg, #8B5CF6, #7C3AED)',
            'linear-gradient(135deg, #EC4899, #BE185D)',
            'linear-gradient(135deg, #06B6D4, #0891B2)',
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
        return colors[Math.abs(hash) % colors.length];
    }

    getCarPlaceholder(make: string = 'Auto'): string {
        return `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250">
        <defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#F1F5F9"/><stop offset="100%" style="stop-color:#E2E8F0"/></linearGradient></defs>
        <rect width="400" height="250" fill="url(#bg)"/>
        <g transform="translate(150, 85)"><rect x="10" y="30" width="80" height="35" rx="8" fill="#94A3B8"/><rect x="0" y="45" width="100" height="25" rx="5" fill="#64748B"/><circle cx="20" cy="72" r="10" fill="#334155"/><circle cx="80" cy="72" r="10" fill="#334155"/><circle cx="20" cy="72" r="4" fill="#94A3B8"/><circle cx="80" cy="72" r="4" fill="#94A3B8"/><rect x="55" y="38" width="20" height="12" rx="2" fill="#CBD5E1" opacity="0.8"/><rect x="25" y="38" width="20" height="12" rx="2" fill="#CBD5E1" opacity="0.8"/></g>
        <text x="200" y="190" fill="#94A3B8" font-family="Inter,sans-serif" font-size="14" font-weight="500" text-anchor="middle">${make}</text>
      </svg>
    `)}`;
    }

    getRoleLabel(role: string): string {
        const labels: Record<string, string> = {
            admin: 'Administrateur',
            proprietaire: 'Propriétaire',
            client: 'Client',
            agence: 'Agence'
        };
        return labels[role] || role.charAt(0).toUpperCase() + role.slice(1);
    }
}
