import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppDataService } from '../../../services/app-data.service';
import { VehicleService } from '../../../services/vehicle.service';
import { VehicleCardComponent } from '../../../shared/vehicle-card/vehicle-card.component';
import { Vehicle } from '../../../models/models';

@Component({
  selector: 'app-favoris',
  standalone: true,
  imports: [CommonModule, VehicleCardComponent],
  templateUrl: './favoris.component.html',
  styleUrl: './favoris.component.css'
})
export class FavorisComponent implements OnInit {
  favVehicles: Vehicle[] = [];
  constructor(private appData: AppDataService) { }
  ngOnInit() { this.favVehicles = this.appData.vehicules.filter(v => this.appData.favoris.includes(v.id)); }
}
