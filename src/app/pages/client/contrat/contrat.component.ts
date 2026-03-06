import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AppDataService } from '../../../services/app-data.service';
import { FormatService } from '../../../services/format.service';

@Component({
  selector: 'app-contrat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contrat.component.html',
  styleUrl: './contrat.component.css'
})
export class ContratComponent implements OnInit {
  location: any; clientName = ''; clientEmail = ''; vehicleName = ''; vehicleImmat = '';
  constructor(public appData: AppDataService, public fmt: FormatService, private route: ActivatedRoute) { }
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.location = this.appData.locations.find(l => l.id === id);
    if (this.location) {
      const c = this.appData.users.find(u => u.id === this.location.clientId); const v = this.appData.vehicules.find(x => x.id === this.location.vehiculeId);
      this.clientName = c ? `${c.prenom} ${c.nom}` : ''; this.clientEmail = c?.email || '';
      this.vehicleName = v ? `${v.marque} ${v.modele}` : ''; this.vehicleImmat = v?.immatriculation || '';
    }
  }
}
