import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppDataService } from '../../../services/app-data.service';
import { FormatService } from '../../../services/format.service';
import { VehicleService } from '../../../services/vehicle.service';
import { ToastService } from '../../../services/toast.service';
import { Vehicle } from '../../../models/models';


@Component({
  selector: 'app-detail-vehicule',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './detail-vehicule.component.html',
  styleUrl: './detail-vehicule.component.css'
})
export class DetailVehiculeComponent implements OnInit {
  vehicle: Vehicle | null = null; isFav = false; startDate = ''; endDate = '';
  priceCalc = { days: 0, total: 0, perDay: 0 };
  constructor(public appData: AppDataService, public fmt: FormatService, private vehicleService: VehicleService, private toast: ToastService, private route: ActivatedRoute) { }
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.vehicle = this.appData.vehicules.find(v => v.id === id) || null;
    if (this.vehicle) this.isFav = this.vehicleService.isFavorite(this.vehicle.id);
  }
  toggleFav() { if (this.vehicle) this.isFav = this.vehicleService.toggleFavorite(this.vehicle.id); }
  calcPrice() { if (this.vehicle && this.startDate && this.endDate) this.priceCalc = this.vehicleService.calculateRentalPrice(this.vehicle, this.startDate, this.endDate); }
  book() {
    if (!this.vehicle) return;

    if (this.vehicle.type === 'location') {
      if (!this.startDate || !this.endDate) { this.toast.warning('Dates requises', 'Sélectionnez les dates'); return; }
      this.requestIntermediary('location');
    } else {
      this.requestIntermediary('achat');
    }
  }

  requestIntermediary(type: 'location' | 'achat') {
    if (!this.vehicle) return;

    const demande: any = {
      id: this.appData.generateId(),
      vehiculeId: this.vehicle.id,
      clientId: this.appData.currentUser?.id || '',
      type: type,
      statut: 'nouveau',
      messageClient: type === 'location' ? `Demande de location du ${this.startDate} au ${this.endDate}` : 'Souhaite acheter ce véhicule',
      dateDebut: this.startDate,
      dateFin: this.endDate,
      prixEstime: type === 'location' ? this.priceCalc.total : this.vehicle.prixVente,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.appData.demandes.push(demande);
    this.appData.saveData();

    this.toast.success('Demande envoyée', 'L\'administrateur va vérifier votre demande et contacter le propriétaire.');
  }

  getOwnerName(): string {
    const u = this.appData.users.find(x => x.id === this.vehicle?.proprietaireId);
    return u ? (u.nomAgence || `${u.prenom} ${u.nom}`) : 'Propriétaire';
  }

  get ownerSince(): string {
    const u = this.appData.users.find(x => x.id === this.vehicle?.proprietaireId);
    return u ? u.dateInscription : 'octobre 2025';
  }

  contactOwner() {
    this.toast.info('Contact', 'Fonctionnalité de contact bientôt disponible');
  }
}
