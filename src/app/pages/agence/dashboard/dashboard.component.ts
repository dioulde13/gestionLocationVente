import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppDataService } from '../../../services/app-data.service';
import { FormatService } from '../../../services/format.service';

@Component({
  selector: 'app-agence-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class AgenceDashboardComponent implements OnInit {
  agenceName = ''; vehicleCount = 0; activeRentals = 0; revenue = 0;
  constructor(public appData: AppDataService, public fmt: FormatService) { }
  ngOnInit() {
    const u = this.appData.currentUser; this.agenceName = u?.nomAgence || 'Mon Agence';
    const agence = this.appData.agences.find(a => a.userId === u?.id);
    this.vehicleCount = agence?.vehiculesCount || 0;
    this.activeRentals = this.appData.locations.filter(l => l.statut === 'en_cours').length;
    this.revenue = this.appData.locations.filter(l => l.paiement === 'payé').reduce((s, l) => s + l.prixTotal, 0);
  }
}
