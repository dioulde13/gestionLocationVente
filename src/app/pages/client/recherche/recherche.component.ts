import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { VehicleService } from '../../../services/vehicle.service';
import { VehicleCardComponent } from '../../../shared/vehicle-card/vehicle-card.component';
import { Vehicle } from '../../../models/models';

@Component({
  selector: 'app-recherche',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, VehicleCardComponent],
  templateUrl: './recherche.component.html',
  styleUrl: './recherche.component.css'
})
export class RechercheComponent implements OnInit {
  results: Vehicle[] = []; filters: any = { search: '', type: '', categorie: '', marque: '', carburant: '', transmission: '', ville: '', sort: 'rating' }; filterOpts: any = {};
  constructor(private vehicleService: VehicleService) { }
  ngOnInit() { this.filterOpts = this.vehicleService.getVehicleFilterOptions(); this.applyFilters(); }
  applyFilters() { this.results = this.vehicleService.getFilteredVehicles(this.filters); }
  resetFilters() { this.filters = { search: '', categorie: '', marque: '', carburant: '', transmission: '', ville: '', sort: 'rating' }; this.applyFilters(); }
}
