import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VehicleCardComponent } from '../../shared/vehicle-card/vehicle-card.component';
import { VehicleService } from '../../services/vehicle.service';
import { AppDataService } from '../../services/app-data.service';
import { AuthService } from '../../services/auth.service';
import { Vehicle } from '../../models/models';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, RouterModule, VehicleCardComponent],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent implements OnInit {
  isScrolled = false;
  isMobileMenuOpen = false;
  popularVehicles: Vehicle[] = [];

  // Features data
  features = [
    {
      icon: '🔍',
      title: 'Recherche avancée',
      desc: 'Trouvez le véhicule parfait grâce à nos filtres intelligents : marque, prix, catégorie, et plus.'
    },
    {
      icon: '🔒',
      title: 'Paiement sécurisé',
      desc: 'Transactions sécurisées avec suivi en temps réel. Contrats numériques pour votre protection.'
    },
    {
      icon: '📊',
      title: 'Tableau de bord',
      desc: 'Suivez vos locations, revenus et statistiques depuis un tableau de bord intuitif.'
    },
    {
      icon: '📅',
      title: 'Calendrier interactif',
      desc: 'Gérez les disponibilités de vos véhicules avec un calendrier dynamique et intuitif.'
    },
    {
      icon: '✅',
      title: 'Vérification KYC',
      desc: 'Identité vérifiée pour chaque utilisateur garantissant confiance et sécurité.'
    },
    {
      icon: '📱',
      title: '100% Responsive',
      desc: 'Accédez à la plateforme depuis votre mobile, tablette ou ordinateur sans compromis.'
    },
  ];

  // Steps data
  steps = [
    {
      num: 1,
      title: 'Créez votre compte',
      desc: "Inscription rapide avec vérification d'identité pour une expérience sécurisée.",
      style: 'background:linear-gradient(135deg,var(--primary-500),var(--primary-700));box-shadow:0 8px 24px rgba(37,99,235,0.3);'
    },
    {
      num: 2,
      title: 'Choisissez votre véhicule',
      desc: 'Parcourez notre catalogue et trouvez le véhicule qui correspond à vos besoins.',
      style: 'background:linear-gradient(135deg,var(--accent-500),var(--accent-700));box-shadow:0 8px 24px rgba(245,158,11,0.3);'
    },
    {
      num: 3,
      title: 'Roulez !',
      desc: 'Confirmez votre réservation, signez le contrat numérique et récupérez les clés.',
      style: 'background:linear-gradient(135deg,var(--success-500),#047857);box-shadow:0 8px 24px rgba(16,185,129,0.3);'
    },
  ];

  // Testimonials data
  testimonials = [
    {
      name: 'Mamadou Diallo',
      initials: 'MD',
      role: 'Client depuis 2025',
      text: "Service excellent ! J'ai loué un Toyota Land Cruiser pour un voyage à Labé. Tout était parfait du début à la fin.",
      color: 'linear-gradient(135deg,var(--primary-400),var(--primary-600))'
    },
    {
      name: 'Ibrahima Bah',
      initials: 'IB',
      role: 'Propriétaire · Bah Auto',
      text: "En tant que propriétaire, AutoLoc m'a permis de rentabiliser ma flotte. L'interface de gestion est très intuitive.",
      color: 'linear-gradient(135deg,var(--success-500),#059669)'
    },
    {
      name: 'Aissatou Camara',
      initials: 'AC',
      role: 'Cliente depuis 2025',
      text: "La vérification KYC m'a mis en confiance. Je sais que mes véhicules sont entre de bonnes mains.",
      color: 'linear-gradient(135deg,var(--accent-400),var(--accent-600))'
    },
  ];

  constructor(
    private vehicleService: VehicleService,
    private appData: AppDataService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Load popular vehicles from service
    this.popularVehicles = this.vehicleService.getFilteredVehicles({ sort: 'populaire' }).slice(0, 6);

    // Setup smooth scrolling for anchor links
    this.setupSmoothScroll();
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get dashboardRoute(): string {
    return this.appData.currentUser ? this.authService.getDashboardRoute(this.appData.currentUser.role) : '/';
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }

  @HostListener('window:resize', [])
  onWindowResize(): void {
    // Close mobile menu on resize to desktop
    if (window.innerWidth >= 768) {
      this.closeMobileMenu();
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;

    // Prevent body scroll when menu is open
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  private setupSmoothScroll(): void {
    // Setup smooth scrolling for anchor links
    setTimeout(() => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          e.preventDefault();
          const href = anchor.getAttribute('href');
          if (href) {
            const target = document.querySelector(href);
            if (target) {
              const headerHeight = 72; // Height of fixed header
              const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

              window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
              });

              // Close mobile menu if open
              this.closeMobileMenu();
            }
          }
        });
      });
    }, 100);
  }
}
