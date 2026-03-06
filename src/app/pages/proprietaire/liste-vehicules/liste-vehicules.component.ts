import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppDataService } from '../../../services/app-data.service';
import { FormatService } from '../../../services/format.service';
import { ToastService } from '../../../services/toast.service';
import { FormsModule } from '@angular/forms';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-liste-vehicules',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, StatusBadgeComponent],
  templateUrl: './liste-vehicules.component.html',
  styleUrl: './liste-vehicules.component.css'
})
export class ListeVehiculesComponent implements OnInit {
  vehicles: any[] = [];
  filteredVehicles: any[] = [];
  filter = { type: '', status: '' };

  constructor(
    public appData: AppDataService,
    public fmt: FormatService,
    private toast: ToastService,
    private modalService: ModalService
  ) { }
  ngOnInit() { this.loadVehicles(); }
  loadVehicles() {
    this.vehicles = this.appData.vehicules.filter(v => v.proprietaireId === this.appData.currentUser?.id);
    this.applyFilters();
  }

  applyFilters() {
    this.filteredVehicles = this.vehicles.filter(v => {
      const typeMatch = !this.filter.type || v.type === this.filter.type;
      const statusMatch = !this.filter.status || this.getTransactionStatus(v).code === this.filter.status;
      return typeMatch && statusMatch;
    });
  }

  getTransactionStatus(vehicle: any): { label: string, color: string, code: string } {
    const d = this.appData.demandes.find(x => x.vehiculeId === vehicle.id && x.statut !== 'refuse');
    if (!d) return { label: 'Libre', color: 'text-slate-400', code: 'libre' };

    if (d.statut === 'termine') return { label: vehicle.type === 'vente' ? 'Vendu' : 'Loué (Fini)', color: 'text-green-600', code: 'termine' };
    if (d.statut === 'valide') return { label: vehicle.type === 'vente' ? 'En cours de vente' : 'En location', color: 'text-blue-600', code: 'en_cours' };
    return { label: 'En négociation', color: 'text-amber-500', code: 'negoc' };
  }

  async askDelete(id: string) {
    const confirmed = await this.modalService.confirm({
      title: 'Supprimer le véhicule',
      message: 'Êtes-vous sûr de vouloir supprimer définitivement ce véhicule ? Cette action est irréversible.',
      type: 'danger'
    });

    if (confirmed) {
      this.appData.vehicules = this.appData.vehicules.filter(v => v.id !== id);
      this.appData.saveData();
      this.toast.success('Supprimé', 'Véhicule supprimé');
      this.loadVehicles();
    }
  }

  toggleDispo(id: string) {
    const v = this.appData.vehicules.find(x => x.id === id);
    if (v) {
      v.disponible = !v.disponible;
      this.appData.saveData();
      this.toast.info('Mis à jour', v.disponible ? 'Disponible' : 'Indisponible');
    }
  }
}
