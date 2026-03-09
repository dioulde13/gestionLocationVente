import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppDataService } from '../../../services/app-data.service';
import { FormatService } from '../../../services/format.service';
import { ToastService } from '../../../services/toast.service';
import { FormsModule } from '@angular/forms';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';
import { ModalService } from '../../../services/modal.service';
import { SkeletonComponent } from '../../../shared/skeleton/skeleton.component';

@Component({
  selector: 'app-liste-vehicules',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, StatusBadgeComponent, SkeletonComponent],
  templateUrl: './liste-vehicules.component.html',
  styleUrl: './liste-vehicules.component.css'
})
export class ListeVehiculesComponent implements OnInit {
  vehicles: any[] = [];
  filteredVehicles: any[] = [];
  filter = { type: '', status: '' };
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;

  constructor(
    public appData: AppDataService,
    public fmt: FormatService,
    private toast: ToastService,
    private modalService: ModalService,
    private cdr: ChangeDetectorRef
  ) { }
  ngOnInit() { this.loadVehicles(); }
  async loadVehicles() {
    await this.appData.simulateLoading();
    this.vehicles = this.appData.vehicules
      .filter(v => v.proprietaireId === this.appData.currentUser?.id)
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || '2024-01-01').getTime();
        const dateB = new Date(b.createdAt || '2024-01-01').getTime();
        return dateB - dateA;
      });
    this.applyFilters();
  }

  applyFilters() {
    this.filteredVehicles = this.vehicles.filter(v => {
      const typeMatch = !this.filter.type || v.type === this.filter.type;
      const statusMatch = !this.filter.status || this.getTransactionStatus(v).code === this.filter.status;
      return typeMatch && statusMatch;
    });
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredVehicles.length / this.pageSize);
    if (this.currentPage > this.totalPages) this.currentPage = Math.max(1, this.totalPages);
    this.cdr.detectChanges();
  }

  setPage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  get pagedVehicles() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredVehicles.slice(start, start + this.pageSize);
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
