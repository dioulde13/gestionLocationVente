import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppDataService } from '../../../services/app-data.service';
import { FormatService } from '../../../services/format.service';

@Component({
  selector: 'app-proprietaire-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class ProprietaireDashboardComponent implements OnInit {
  myVehicles = 0; availableVehicles = 0; totalRentals = 0; totalRevenue = 0;
  constructor(public appData: AppDataService, public fmt: FormatService) { }
  ngOnInit() {
    const uid = this.appData.currentUser?.id; const vs = this.appData.vehicules.filter(v => v.proprietaireId === uid);
    this.myVehicles = vs.length; this.availableVehicles = vs.filter(v => v.disponible).length;
    const vids = vs.map(v => v.id); const locs = this.appData.locations.filter(l => vids.includes(l.vehiculeId));
    this.totalRentals = locs.length; this.totalRevenue = locs.filter(l => l.paiement === 'payé').reduce((s, l) => s + l.prixTotal, 0);
  }
}
