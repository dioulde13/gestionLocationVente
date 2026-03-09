import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppDataService } from '../../../services/app-data.service';
import { FormatService } from '../../../services/format.service';
import { ToastService } from '../../../services/toast.service';
import { ModalService } from '../../../services/modal.service';
import { SkeletonComponent } from '../../../shared/skeleton/skeleton.component';

@Component({
  selector: 'app-admin-vehicules',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SkeletonComponent],
  templateUrl: './admin-vehicules.component.html',
  styleUrl: './admin-vehicules.component.css'
})
export class AdminVehiculesComponent implements OnInit {
  allVehicles: any[] = [];
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

  ngOnInit() {
    this.refreshData();
  }

  async refreshData() {
    await this.appData.simulateLoading();
    this.allVehicles = [...this.appData.vehicules].sort((a, b) => {
      const dateA = new Date(a.createdAt || '2024-01-01').getTime();
      const dateB = new Date(b.createdAt || '2024-01-01').getTime();
      return dateB - dateA;
    });
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.allVehicles.length / this.pageSize);
    if (this.currentPage > this.totalPages) this.currentPage = Math.max(1, this.totalPages);
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedVehicles = this.allVehicles.slice(start, start + this.pageSize);
    this.cdr.detectChanges();
  }

  setPage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  getOwner(id: string): string { const u = this.appData.users.find(x => x.id === id); return u ? `${u.prenom} ${u.nom}` : '—'; }

  async askUpdateStatus(id: string, status: any) {
    const confirmed = await this.modalService.confirm({
      title: 'Changer le statut',
      message: `Êtes-vous sûr de vouloir passer ce véhicule en statut "${status}" ?`,
      type: (status === 'refuse' || status === 'suspendu') ? 'danger' : 'info'
    });

    if (confirmed) {
      const v = this.appData.vehicules.find(x => x.id === id);
      if (v) {
        v.statut = status;
        this.appData.saveData();
        this.toast.success('Statut mis à jour', `Le véhicule est maintenant ${status}`);
        this.refreshData();
      }
    }
  }
}
