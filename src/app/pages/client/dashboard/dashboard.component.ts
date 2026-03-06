import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppDataService } from '../../../services/app-data.service';
import { FormatService } from '../../../services/format.service';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusBadgeComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class ClientDashboardComponent implements OnInit {
  user: any; totalLocations = 0; activeLocations = 0; totalFavoris = 0; totalSpent = 0; recentLocations: any[] = [];
  constructor(public appData: AppDataService, public fmt: FormatService) { }
  ngOnInit() {
    this.user = this.appData.currentUser;
    const locs = this.appData.locations.filter(l => l.clientId === this.user?.id);
    this.totalLocations = locs.length; this.activeLocations = locs.filter(l => l.statut === 'en_cours').length;
    this.totalFavoris = this.appData.favoris.length; this.totalSpent = locs.filter(l => l.paiement === 'payé').reduce((s, l) => s + l.prixTotal, 0);
    this.recentLocations = locs.slice(0, 5);
  }
  getVehicleName(id: string): string { const v = this.appData.vehicules.find(x => x.id === id); return v ? `${v.marque} ${v.modele}` : 'N/A'; }
}
