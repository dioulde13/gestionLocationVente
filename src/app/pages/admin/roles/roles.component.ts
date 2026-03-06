import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppDataService } from '../../../services/app-data.service';
import { FormatService } from '../../../services/format.service';

@Component({
  selector: 'app-admin-roles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent {
  roles = [
    { name: 'admin', label: 'Administrateur', icon: '🛡️', color: 'var(--error-100)', desc: 'Accès complet à toute la plateforme', permissions: ['Gérer utilisateurs', 'Valider KYC', 'Valider véhicules', 'Voir audit log', 'Gérer rôles', 'Gérer agences', 'Statistiques globales'] },
    { name: 'proprietaire', label: 'Propriétaire', icon: '🚗', color: 'var(--primary-100)', desc: 'Gestion des véhicules et locations', permissions: ['Ajouter véhicules', 'Modifier véhicules', 'Gérer tarifs', 'Gérer disponibilité', 'Voir exploitation', 'Documents véhicules'] },
    { name: 'client', label: 'Client', icon: '👤', color: 'var(--success-100)', desc: 'Location de véhicules', permissions: ['Rechercher véhicules', 'Réserver véhicules', 'Gérer favoris', 'Voir historique', 'Soumettre KYC', 'Déclarer incidents'] },
    { name: 'agence', label: 'Agence', icon: '🏢', color: 'var(--accent-100)', desc: "Gestion d'agence de location", permissions: ['Gérer flotte', 'Voir réservations', 'Statistiques agence', 'Gérer clients agence'] },
  ];
  constructor(public appData: AppDataService) { }
  getUserCount(role: string): number { return this.appData.users.filter(u => u.role === role).length; }
}
