import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppDataService } from '../../../services/app-data.service';
import { FormatService } from '../../../services/format.service';
import { ToastService } from '../../../services/toast.service';
import { Demande, User, Vehicle } from '../../../models/models';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';
import { SkeletonComponent } from '../../../shared/skeleton/skeleton.component';

@Component({
    selector: 'app-admin-demandes',
    standalone: true,
    imports: [CommonModule, StatusBadgeComponent, SkeletonComponent],
    templateUrl: './demandes.component.html',
    styleUrl: './demandes.component.css'
})
export class AdminDemandesComponent implements OnInit {
    demandes: Demande[] = [];
    pagedDemandes: Demande[] = [];
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
        this.refreshData();
    }

    async refreshData() {
        await this.appData.simulateLoading();
        this.demandes = [...this.appData.demandes].sort((a, b) => {
            const dateA = new Date(a.createdAt || '2024-01-01').getTime();
            const dateB = new Date(b.createdAt || '2024-01-01').getTime();
            return dateB - dateA;
        });
        this.updatePagination();
    }

    updatePagination() {
        this.totalPages = Math.ceil(this.demandes.length / this.pageSize);
        if (this.currentPage > this.totalPages) this.currentPage = Math.max(1, this.totalPages);
        const start = (this.currentPage - 1) * this.pageSize;
        this.pagedDemandes = this.demandes.slice(start, start + this.pageSize);
        this.cdr.detectChanges();
    }

    setPage(page: number) {
        this.currentPage = page;
        this.updatePagination();
    }

    getUser(id: string): User | undefined {
        return this.appData.users.find(u => u.id === id);
    }

    getVehicle(id: string): Vehicle | undefined {
        return this.appData.vehicules.find(v => v.id === id);
    }

    getOwner(vehicleId: string): User | undefined {
        const v = this.getVehicle(vehicleId);
        return v ? this.getUser(v.proprietaireId) : undefined;
    }

    updateStatus(demande: Demande, newStatus: Demande['statut']) {
        demande.statut = newStatus;
        demande.updatedAt = new Date().toISOString();
        this.appData.saveData();
        this.toast.success('Statut mis à jour', `La demande est maintenant ${newStatus}`);

        if (newStatus === 'en_attente_proprietaire') {
            this.toast.info('Notification', 'Le propriétaire a été notifié de cette demande.');
        }
    }

    deleteDemande(id: string) {
        const index = this.appData.demandes.findIndex(d => d.id === id);
        if (index !== -1) {
            this.appData.demandes.splice(index, 1);
            this.appData.saveData();
            this.toast.warning('Supprimé', 'Demande supprimée');
        }
    }
}
