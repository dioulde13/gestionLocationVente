import { Component, Input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppDataService } from '../../services/app-data.service';
import { FormatService } from '../../services/format.service';
import { AuthService } from '../../services/auth.service';

interface SidebarLink {
  label: string;
  icon: string;
  route?: string;
  tooltip: string;
  children?: { label: string; route: string }[];
}

interface SidebarSection {
  title: string;
  links: SidebarLink[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() role: string = 'admin';

  @HostBinding('class.collapsed') isCollapsed = false;
  @HostBinding('class.open') isMobileOpen = false;
  openSubmenus: Record<string, boolean> = {};

  constructor(
    public appData: AppDataService,
    private format: FormatService,
    public authService: AuthService
  ) { }

  get sections(): SidebarSection[] {
    switch (this.role) {
      case 'admin': return this.adminSections;
      case 'proprietaire': return this.proprietaireSections;
      case 'agence': return this.agenceSections;
      case 'client': return this.clientSections;
      default: return [];
    }
  }

  private clientSections: SidebarSection[] = [
    {
      title: 'PRINCIPAL',
      links: [
        { label: 'Tableau de bord', icon: 'ph-squares-four', route: '/client/dashboard', tooltip: 'Tableau de bord' },
        { label: 'Rechercher', icon: 'ph-magnifying-glass', route: '/client/recherche', tooltip: 'Rechercher' },
        { label: 'Favoris', icon: 'ph-heart', route: '/client/favoris', tooltip: 'Favoris' },
        { label: 'Mes locations', icon: 'ph-clipboard-text', route: '/client/historique', tooltip: 'Mes locations' },
        { label: 'Mes demandes', icon: 'ph-chat-circle-dots', route: '/client/demandes', tooltip: 'Mes demandes d\'achat/location' },
      ]
    },
    {
      title: 'MON COMPTE',
      links: [
        { label: 'Profil', icon: 'ph-user', route: '/client/profil', tooltip: 'Profil' },
        { label: 'Vérification KYC', icon: 'ph-shield-check', route: '/client/kyc', tooltip: 'Vérification KYC' },
        { label: 'Sécurité', icon: 'ph-lock', route: '/client/securite', tooltip: 'Sécurité' },
        { label: 'Appareils', icon: 'ph-keypad', route: '/client/appareils', tooltip: 'Appareils' },
      ]
    }
  ];

  get userName(): string {
    const u = this.appData.currentUser;
    return u ? `${u.prenom} ${u.nom}` : '';
  }

  get userRole(): string {
    return this.appData.currentUser ? this.appData.getRoleLabel(this.appData.currentUser.role) : '';
  }

  get userInitials(): string {
    return this.appData.currentUser ? this.format.initials(`${this.appData.currentUser.prenom} ${this.appData.currentUser.nom}`) : '';
  }

  get avatarColor(): string {
    const u = this.appData.currentUser;
    return u ? this.appData.getAvatarColor(u.prenom + u.nom) : '';
  }

  toggleCollapse(): void { this.isCollapsed = !this.isCollapsed; }
  toggleMobile(): void { this.isMobileOpen = !this.isMobileOpen; }
  closeMobile(): void { this.isMobileOpen = false; }
  toggleSubmenu(label: string): void { this.openSubmenus[label] = !this.openSubmenus[label]; }

  private adminSections: SidebarSection[] = [
    {
      title: 'Administration',
      links: [
        { label: 'Tableau de bord', icon: 'ph-squares-four', route: '/admin/dashboard', tooltip: 'Tableau de bord' },
        {
          label: 'Utilisateurs', icon: 'ph-users', tooltip: 'Utilisateurs', children: [
            { label: 'Gérer les utilisateurs', route: '/admin/utilisateurs' },
          ]
        },
        {
          label: 'Validations', icon: 'ph-shield-check', tooltip: 'Validations', children: [
            { label: 'Validation KYC', route: '/admin/validation-kyc' },
            { label: 'Validation véhicules', route: '/admin/validation-vehicules' },
          ]
        },
        { label: 'Demandes', icon: 'ph-chat-circle-dots', route: '/admin/demandes', tooltip: 'Demandes de location/achat' },
      ]
    },
    {
      title: 'Gestion',
      links: [
        { label: 'Véhicules', icon: 'ph-car-profile', route: '/admin/vehicules', tooltip: 'Véhicules' },
        { label: 'Clients', icon: 'ph-user-circle', route: '/admin/clients', tooltip: 'Clients' },
        { label: 'Agences', icon: 'ph-storefront', route: '/admin/agences', tooltip: 'Agences' },
      ]
    },
    {
      title: 'Système',
      links: [
        { label: 'Rôles & Permissions', icon: 'ph-key', route: '/admin/roles', tooltip: 'Rôles & Permissions' },
        { label: "Journal d'audit", icon: 'ph-clipboard-text', route: '/admin/audit-log', tooltip: "Journal d'audit" },
      ]
    }
  ];

  private proprietaireSections: SidebarSection[] = [
    {
      title: 'Mon espace',
      links: [
        { label: 'Tableau de bord', icon: 'ph-squares-four', route: '/proprietaire/dashboard', tooltip: 'Tableau de bord' },
        { label: 'Mes véhicules', icon: 'ph-car-profile', route: '/proprietaire/vehicules', tooltip: 'Mes véhicules' },
        { label: 'Mes transactions', icon: 'ph-chat-circle-dots', route: '/proprietaire/demandes', tooltip: 'Mes transactions (ventes/locations)' },
        { label: 'Ajouter véhicule', icon: 'ph-plus-circle', route: '/proprietaire/ajouter-vehicule', tooltip: 'Ajouter véhicule' },
      ]
    },
    {
      title: 'Gestion',
      links: [
        { label: 'Tarifs', icon: 'ph-currency-circle-dollar', route: '/proprietaire/tarifs', tooltip: 'Tarifs' },
        { label: 'Disponibilité', icon: 'ph-calendar', route: '/proprietaire/disponibilite', tooltip: 'Disponibilité' },
        { label: 'Documents', icon: 'ph-folder-open', route: '/proprietaire/documents', tooltip: 'Documents' },
        { label: 'Suivi exploitation', icon: 'ph-chart-line', route: '/proprietaire/exploitation', tooltip: 'Suivi exploitation' },
      ]
    }
  ];

  private agenceSections: SidebarSection[] = [
    {
      title: 'Agence',
      links: [
        { label: 'Tableau de bord', icon: 'ph-squares-four', route: '/agence/dashboard', tooltip: 'Tableau de bord' },
      ]
    }
  ];
}
