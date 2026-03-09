import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppDataService } from '../../../services/app-data.service';
import { FormatService } from '../../../services/format.service';
import { ToastService } from '../../../services/toast.service';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';
import { SkeletonComponent } from '../../../shared/skeleton/skeleton.component';

@Component({
    selector: 'app-proprietaire-demandes',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, StatusBadgeComponent, SkeletonComponent],
    templateUrl: './demandes.component.html',
    styleUrl: './demandes.component.css'
})
export class ProprietaireDemandesComponent implements OnInit {
    demandes: any[] = [];
    filteredDemandes: any[] = [];
    filter = { type: '', status: '' };

    currentPage: number = 1;
    pageSize: number = 10;
    totalPages: number = 1;

    constructor(
        public appData: AppDataService,
        public fmt: FormatService,
        private toast: ToastService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.loadDemandes();
    }

    async loadDemandes() {
        await this.appData.simulateLoading();
        const myVehicleIds = this.appData.vehicules
            .filter(v => v.proprietaireId === this.appData.currentUser?.id)
            .map(v => v.id);

        this.demandes = this.appData.demandes
            .filter(d => myVehicleIds.includes(d.vehiculeId) && d.statut !== 'nouveau')
            .map(d => ({
                ...d,
                vehicle: this.appData.vehicules.find(v => v.id === d.vehiculeId),
                client: this.appData.users.find(u => u.id === d.clientId)
            }))
            .sort((a, b) => {
                const dateA = new Date(a.createdAt || '2024-01-01').getTime();
                const dateB = new Date(b.createdAt || '2024-01-01').getTime();
                return dateB - dateA;
            });

        this.applyFilters();
    }

    applyFilters() {
        this.filteredDemandes = this.demandes.filter(d => {
            const typeMatch = !this.filter.type || d.type === this.filter.type;
            const statusMatch = !this.filter.status || d.statut === this.filter.status;
            return typeMatch && statusMatch;
        });
        this.updatePagination();
    }

    updatePagination() {
        this.totalPages = Math.ceil(this.filteredDemandes.length / this.pageSize);
        if (this.currentPage > this.totalPages) this.currentPage = Math.max(1, this.totalPages);
        this.cdr.detectChanges();
    }

    setPage(page: number) {
        this.currentPage = page;
        this.updatePagination();
    }

    get pagedDemandes() {
        const start = (this.currentPage - 1) * this.pageSize;
        return this.filteredDemandes.slice(start, start + this.pageSize);
    }

    updateStatus(demande: any, newStatus: string) {
        const d = this.appData.demandes.find(x => x.id === demande.id);
        if (d) {
            (d as any).statut = newStatus;
            d.updatedAt = new Date().toISOString();

            if (newStatus === 'termine' && d.type === 'achat') {
                const v = this.appData.vehicules.find(x => x.id === d.vehiculeId);
                if (v) {
                    v.disponible = false;
                }
            }

            this.appData.saveData();
            this.toast.success('Statut mis à jour', `La demande est maintenant: ${newStatus}`);
            this.loadDemandes();
        }
    }
}
