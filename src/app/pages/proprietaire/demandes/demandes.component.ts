import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppDataService } from '../../../services/app-data.service';
import { FormatService } from '../../../services/format.service';
import { ToastService } from '../../../services/toast.service';
import { Demande, Vehicle, User } from '../../../models/models';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';

@Component({
    selector: 'app-proprietaire-demandes',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, StatusBadgeComponent],
    templateUrl: './demandes.component.html',
    styleUrl: './demandes.component.css'
})
export class ProprietaireDemandesComponent implements OnInit {
    demandes: any[] = [];
    filteredDemandes: any[] = [];
    filter = { type: '', status: '' };

    constructor(
        public appData: AppDataService,
        public fmt: FormatService,
        private toast: ToastService
    ) { }

    ngOnInit() {
        this.loadDemandes();
    }

    loadDemandes() {
        const myVehicleIds = this.appData.vehicules
            .filter(v => v.proprietaireId === this.appData.currentUser?.id)
            .map(v => v.id);

        this.demandes = this.appData.demandes
            .filter(d => myVehicleIds.includes(d.vehiculeId) && d.statut !== 'nouveau')
            .map(d => ({
                ...d,
                vehicle: this.appData.vehicules.find(v => v.id === d.vehiculeId),
                client: this.appData.users.find(u => u.id === d.clientId)
            }));

        this.applyFilters();
    }

    applyFilters() {
        this.filteredDemandes = this.demandes.filter(d => {
            const typeMatch = !this.filter.type || d.type === this.filter.type;
            const statusMatch = !this.filter.status || d.statut === this.filter.status;
            return typeMatch && statusMatch;
        });
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
