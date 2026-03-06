import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Vehicle } from '../../models/models';
import { AppDataService } from '../../services/app-data.service';
import { FormatService } from '../../services/format.service';
import { VehicleService } from '../../services/vehicle.service';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-vehicle-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './vehicle-card.component.html',
  styleUrl: './vehicle-card.component.css'
})
export class VehicleCardComponent {
  @Input() vehicle!: Vehicle;
  @Input() showFav: boolean = true;

  constructor(
    public appData: AppDataService,
    public fmt: FormatService,
    private vehicleService: VehicleService,
    private router: Router
  ) { }

  get isFav(): boolean {
    return this.vehicleService.isFavorite(this.vehicle.id);
  }

  getOwnerName(id: string): string {
    const u = this.appData.users.find(x => x.id === id);
    return u ? (u.nomAgence || `${u.prenom} ${u.nom}`) : 'Propriétaire';
  }

  goToDetail(): void {
    this.router.navigate(['/client/vehicule', this.vehicle.id]);
  }
}
