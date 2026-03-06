import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppDataService } from '../../../services/app-data.service';
import { FormatService } from '../../../services/format.service';
import { FormsModule } from '@angular/forms';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent, RouterModule, FormsModule],
  templateUrl: './historique.component.html',
  styleUrl: './historique.component.css'
})
export class HistoriqueComponent implements OnInit {
  locations: any[] = [];
  filteredLocations: any[] = [];
  filter = { type: '', status: '' };

  constructor(public appData: AppDataService, public fmt: FormatService) { }

  ngOnInit() {
    this.loadLocations();
  }

  loadLocations() {
    this.locations = this.appData.locations
      .filter(l => l.clientId === this.appData.currentUser?.id)
      .map(l => ({
        ...l,
        vehicle: this.appData.vehicules.find(v => v.id === l.vehiculeId),
        owner: this.getOwner(l.vehiculeId)
      }));
    this.applyFilters();
  }

  applyFilters() {
    this.filteredLocations = this.locations.filter(l => {
      // Type is always 'location' for 'locations' table, but could be extended
      const statusMatch = !this.filter.status || l.statut === this.filter.status;
      return statusMatch;
    });
  }

  getOwner(vehicleId: string) {
    const v = this.appData.vehicules.find(x => x.id === vehicleId);
    return v ? this.appData.users.find(u => u.id === v.proprietaireId) : undefined;
  }
}
