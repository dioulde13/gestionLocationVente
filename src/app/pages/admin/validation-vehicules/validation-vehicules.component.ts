import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppDataService } from '../../../services/app-data.service';
import { FormatService } from '../../../services/format.service';
import { ToastService } from '../../../services/toast.service';
import { ModalService } from '../../../services/modal.service';
import { SkeletonComponent } from '../../../shared/skeleton/skeleton.component';

@Component({
  selector: 'app-validation-vehicules',
  standalone: true,
  imports: [CommonModule, RouterModule, SkeletonComponent],
  templateUrl: './validation-vehicules.component.html',
  styleUrl: './validation-vehicules.component.css'
})
export class ValidationVehiculesComponent implements OnInit {
  pendingVehicles: any[] = [];
  pagedVehicles: any[] = [];
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

  ngOnInit() { this.loadPending(); }

  async loadPending() {
    await this.appData.simulateLoading();
    this.pendingVehicles = this.appData.vehicules
      .filter(v => v.statut === 'en_attente')
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || '2024-01-01').getTime();
        const dateB = new Date(b.createdAt || '2024-01-01').getTime();
        return dateB - dateA;
      });
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.pendingVehicles.length / this.pageSize);
    if (this.currentPage > this.totalPages) this.currentPage = Math.max(1, this.totalPages);
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedVehicles = this.pendingVehicles.slice(start, start + this.pageSize);
    this.cdr.detectChanges();
  }

  setPage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  getOwnerName(id: string): string { const u = this.appData.users.find(x => x.id === id); return u ? `${u.prenom} ${u.nom}` : 'N/A'; }

  async askValidate(id: string, status: string) {
    const isValide = status === 'valide';
    const confirmed = await this.modalService.confirm({
      title: isValide ? 'Valider véhicule' : 'Refuser véhicule',
      message: `Êtes-vous sûr de vouloir ${isValide ? 'valider' : 'refuser'} ce véhicule ?`,
      type: isValide ? 'info' : 'danger'
    });

    if (confirmed) {
      this.onConfirmAction(id, status);
    }
  }

  private onConfirmAction(id: string, status: string) {
    const v = this.appData.vehicules.find(x => x.id === id);
    if (v) {
      v.statut = status as any;
      if (status === 'valide') {
        v.documents = 'valide';
        v.disponible = true;
      }

      this.appData.auditLog.unshift({
        id: this.appData.generateId(),
        action: 'Validation véhicule',
        utilisateur: this.appData.currentUser?.email || '',
        details: `${v.marque} ${v.modele} ${status === 'valide' ? 'validé' : 'refusé'}`,
        date: new Date().toISOString(),
        ip: '192.168.1.1'
      });

      this.appData.saveData();
      this.toast.success('Véhicule', `Véhicule ${status === 'valide' ? 'validé' : 'refusé'}`);
      this.loadPending();
    }
  }
}
