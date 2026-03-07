import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppDataService } from '../../../services/app-data.service';
import { FormatService } from '../../../services/format.service';
import { FormsModule } from '@angular/forms';
import { Demande, Vehicle, User } from '../../../models/models';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';

@Component({
    selector: 'app-mes-demandes',
    standalone: true,
    imports: [CommonModule, FormsModule, StatusBadgeComponent],
    templateUrl: './mes-demandes.component.html',
    styleUrl: './mes-demandes.component.css'
})
export class MesDemandesComponent implements OnInit {
    demandes: any[] = [];
    filteredDemandes: any[] = [];
    filter = { type: '', status: '' };

    constructor(
        public appData: AppDataService,
        public fmt: FormatService
    ) { }

    ngOnInit() {
        this.loadDemandes();
    }

    loadDemandes() {
        this.demandes = this.appData.demandes
            .filter(d => d.clientId === this.appData.currentUser?.id)
            .map(d => ({
                ...d,
                vehicle: this.appData.vehicules.find(v => v.id === d.vehiculeId),
                owner: this.getOwner(d.vehiculeId)
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

    getOwner(vehicleId: string): User | undefined {
        const v = this.appData.vehicules.find(x => x.id === vehicleId);
        return v ? this.appData.users.find(u => u.id === v.proprietaireId) : undefined;
    }
}
