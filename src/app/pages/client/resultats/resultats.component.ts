import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleService } from '../../../services/vehicle.service';
import { VehicleCardComponent } from '../../../shared/vehicle-card/vehicle-card.component';
import { Vehicle } from '../../../models/models';

@Component({
  selector: 'app-resultats',
  standalone: true,
  imports: [CommonModule, VehicleCardComponent],
  templateUrl: './resultats.component.html',
  styleUrl: './resultats.component.css'
})
export class ResultatsComponent implements OnInit {
  vehicles: Vehicle[] = [];
  constructor(private vehicleService: VehicleService) { }
  ngOnInit() { this.vehicles = this.vehicleService.getFilteredVehicles({}); }
}
