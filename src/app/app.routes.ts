import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    // Accueil
    {
        path: '',
        loadComponent: () => import('./pages/accueil/accueil.component').then(m => m.AccueilComponent),
    },

    // Auth
    {
        path: 'auth/connexion',
        loadComponent: () => import('./pages/auth/connexion/connexion.component').then(m => m.ConnexionComponent),
    },
    {
        path: 'auth/inscription',
        loadComponent: () => import('./pages/auth/inscription/inscription.component').then(m => m.InscriptionComponent),
    },
    {
        path: 'auth/otp',
        loadComponent: () => import('./pages/auth/otp/otp.component').then(m => m.OtpComponent),
    },
    {
        path: 'auth/mot-de-passe-oublie',
        loadComponent: () => import('./pages/auth/mot-de-passe-oublie/mot-de-passe-oublie.component').then(m => m.MotDePasseOublieComponent),
    },
    {
        path: 'auth/reinitialisation',
        loadComponent: () => import('./pages/auth/reinitialisation/reinitialisation.component').then(m => m.ReinitialisationComponent),
    },

    // Client
    {
        path: 'client',
        loadComponent: () => import('./layouts/client-layout/client-layout.component').then(m => m.ClientLayoutComponent),
        canActivate: [authGuard(['client'])],
        children: [
            { path: 'dashboard', loadComponent: () => import('./pages/client/dashboard/dashboard.component').then(m => m.ClientDashboardComponent) },
            { path: 'recherche', loadComponent: () => import('./pages/client/recherche/recherche.component').then(m => m.RechercheComponent) },
            { path: 'resultats', loadComponent: () => import('./pages/client/resultats/resultats.component').then(m => m.ResultatsComponent) },
            { path: 'vehicule/:id', loadComponent: () => import('./pages/client/detail-vehicule/detail-vehicule.component').then(m => m.DetailVehiculeComponent) },
            { path: 'profil', loadComponent: () => import('./pages/client/profil/profil.component').then(m => m.ProfilComponent) },
            { path: 'kyc', loadComponent: () => import('./pages/client/kyc/kyc.component').then(m => m.KycComponent) },
            { path: 'securite', loadComponent: () => import('./pages/client/securite/securite.component').then(m => m.SecuriteComponent) },
            { path: 'historique', loadComponent: () => import('./pages/client/historique/historique.component').then(m => m.HistoriqueComponent) },
            { path: 'favoris', loadComponent: () => import('./pages/client/favoris/favoris.component').then(m => m.FavorisComponent) },
            { path: 'demandes', loadComponent: () => import('./pages/client/mes-demandes/mes-demandes.component').then(m => m.MesDemandesComponent) },
            { path: 'contrat/:id', loadComponent: () => import('./pages/client/contrat/contrat.component').then(m => m.ContratComponent) },
            { path: 'incident', loadComponent: () => import('./pages/client/incident/incident.component').then(m => m.IncidentComponent) },
            { path: 'appareils', loadComponent: () => import('./pages/client/appareils/appareils.component').then(m => m.AppareilsComponent) },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        ],
    },

    // Proprietaire
    {
        path: 'proprietaire',
        loadComponent: () => import('./layouts/proprietaire-layout/proprietaire-layout.component').then(m => m.ProprietaireLayoutComponent),
        canActivate: [authGuard(['proprietaire'])],
        children: [
            { path: 'dashboard', loadComponent: () => import('./pages/proprietaire/dashboard/dashboard.component').then(m => m.ProprietaireDashboardComponent) },
            { path: 'vehicules', loadComponent: () => import('./pages/proprietaire/liste-vehicules/liste-vehicules.component').then(m => m.ListeVehiculesComponent) },
            { path: 'demandes', loadComponent: () => import('./pages/proprietaire/demandes/demandes.component').then(m => m.ProprietaireDemandesComponent) },
            { path: 'vehicule/:id', loadComponent: () => import('./pages/admin/detail-vehicule/detail-vehicule.component').then(m => m.DetailVehiculeComponent) },
            { path: 'ajouter-vehicule', loadComponent: () => import('./pages/proprietaire/ajouter-vehicule/ajouter-vehicule.component').then(m => m.AjouterVehiculeComponent) },
            { path: 'tarifs', loadComponent: () => import('./pages/proprietaire/gestion-tarifs/gestion-tarifs.component').then(m => m.GestionTarifsComponent) },
            { path: 'disponibilite', loadComponent: () => import('./pages/proprietaire/disponibilite/disponibilite.component').then(m => m.DisponibiliteComponent) },
            { path: 'documents', loadComponent: () => import('./pages/proprietaire/documents/documents.component').then(m => m.DocumentsComponent) },
            { path: 'exploitation', loadComponent: () => import('./pages/proprietaire/suivi-exploitation/suivi-exploitation.component').then(m => m.SuiviExploitationComponent) },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        ],
    },

    // Admin
    {
        path: 'admin',
        loadComponent: () => import('./layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
        canActivate: [authGuard(['admin'])],
        children: [
            { path: 'dashboard', loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent) },
            { path: 'utilisateurs', loadComponent: () => import('./pages/admin/utilisateurs/utilisateurs.component').then(m => m.UtilisateursComponent) },
            { path: 'utilisateur/:id', loadComponent: () => import('./pages/admin/detail-utilisateur/detail-utilisateur.component').then(m => m.DetailUtilisateurComponent) },
            { path: 'validation-kyc', loadComponent: () => import('./pages/admin/validation-kyc/validation-kyc.component').then(m => m.ValidationKycComponent) },
            { path: 'validation-vehicules', loadComponent: () => import('./pages/admin/validation-vehicules/validation-vehicules.component').then(m => m.ValidationVehiculesComponent) },
            { path: 'vehicules', loadComponent: () => import('./pages/admin/admin-vehicules/admin-vehicules.component').then(m => m.AdminVehiculesComponent) },
            { path: 'vehicule/:id', loadComponent: () => import('./pages/admin/detail-vehicule/detail-vehicule.component').then(m => m.DetailVehiculeComponent) },
            { path: 'clients', loadComponent: () => import('./pages/admin/clients/clients.component').then(m => m.AdminClientsComponent) },
            { path: 'agences', loadComponent: () => import('./pages/admin/agences/agences.component').then(m => m.AdminAgencesComponent) },
            { path: 'agence/:id', loadComponent: () => import('./pages/admin/detail-agence/detail-agence.component').then(m => m.DetailAgenceComponent) },
            { path: 'roles', loadComponent: () => import('./pages/admin/roles/roles.component').then(m => m.RolesComponent) },
            { path: 'audit-log', loadComponent: () => import('./pages/admin/audit-log/audit-log.component').then(m => m.AuditLogComponent) },
            { path: 'demandes', loadComponent: () => import('./pages/admin/demandes/demandes.component').then(m => m.AdminDemandesComponent) },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        ],
    },

    // Agence
    {
        path: 'agence',
        loadComponent: () => import('./layouts/agence-layout/agence-layout.component').then(m => m.AgenceLayoutComponent),
        canActivate: [authGuard(['agence'])],
        children: [
            { path: 'dashboard', loadComponent: () => import('./pages/agence/dashboard/dashboard.component').then(m => m.AgenceDashboardComponent) },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        ],
    },

    // Catch-all
    { path: '**', redirectTo: '' },
];
