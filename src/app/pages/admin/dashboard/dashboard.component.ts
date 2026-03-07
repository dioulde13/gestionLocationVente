import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppDataService } from '../../../services/app-data.service';
import { FormatService } from '../../../services/format.service';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusBadgeComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  totalUsers = 0; totalVehicles = 0; totalAgences = 0; pendingKyc = 0; totalRevenue = 0; activeRentals = 0;
  recentActivity: any[] = []; newUsers: any[] = [];

  constructor(public appData: AppDataService, public format: FormatService) { }

  ngOnInit(): void {
    this.totalUsers = this.appData.users.filter(u => u.role !== 'admin').length;
    this.totalVehicles = this.appData.vehicules.length;
    this.totalAgences = this.appData.users.filter(u => u.role === 'agence').length;
    this.pendingKyc = this.appData.users.filter(u => u.kyc === 'en_attente').length;
    this.totalRevenue = this.appData.locations.filter(l => l.paiement === 'payé').reduce((s, l) => s + l.prixTotal, 0);
    this.activeRentals = this.appData.locations.filter(l => l.statut === 'en_cours').length;
    this.recentActivity = this.appData.auditLog.slice(0, 8);
    this.newUsers = [...this.appData.users].filter(u => u.role !== 'admin').sort((a, b) => new Date(b.dateInscription).getTime() - new Date(a.dateInscription).getTime()).slice(0, 5);
  }

  getLogIcon(action: string): string {
    if (action === 'Connexion') return '🔑';
    if (action === 'Inscription') return '👤';
    if (action.includes('KYC')) return '✅';
    if (action.includes('Suspension')) return '🚫';
    return '📋';
  }
}
