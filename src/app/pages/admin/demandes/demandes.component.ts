import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppDataService } from '../../../services/app-data.service';
import { FormatService } from '../../../services/format.service';
import { ToastService } from '../../../services/toast.service';
import { Demande, User, Vehicle } from '../../../models/models';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';

@Component({
    selector: 'app-admin-demandes',
    standalone: true,
    imports: [CommonModule, StatusBadgeComponent],
    templateUrl: './demandes.component.html',
    styleUrl: './demandes.component.css'
})
export class AdminDemandesComponent implements OnInit {
    demandes: Demande[] = [];

    constructor(
        public appData: AppDataService,
        public fmt: FormatService,
        private toast: ToastService
    ) { }

    ngOnInit() {
        this.demandes = this.appData.demandes;
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
