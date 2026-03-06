import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppDataService } from '../../../services/app-data.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-incident',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './incident.component.html',
  styleUrl: './incident.component.css'
})
export class IncidentComponent {
  form = { locationId: '', type: 'panne', description: '' }; myLocations: any[] = [];
  constructor(private appData: AppDataService, private toast: ToastService) { this.myLocations = this.appData.locations.filter(l => l.clientId === this.appData.currentUser?.id); if (this.myLocations.length) this.form.locationId = this.myLocations[0].id; }
  getVehicle(id: string): string { const v = this.appData.vehicules.find(x => x.id === id); return v ? `${v.marque} ${v.modele}` : 'N/A'; }
  submit() {
    this.appData.incidents.push({ id: this.appData.generateId(), locationId: this.form.locationId, clientId: this.appData.currentUser?.id || '', type: this.form.type, description: this.form.description, statut: 'en_cours', dateDeclaration: new Date().toISOString().split('T')[0], photos: [] });
    this.appData.saveData(); this.toast.success('Incident signalé', 'Votre signalement a été enregistré'); this.form.description = '';
  }
}
