import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AppDataService } from '../../../services/app-data.service';
import { FormatService } from '../../../services/format.service';
import { ToastService } from '../../../services/toast.service';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';
import { ModalService } from '../../../services/modal.service';

@Component({
    selector: 'app-detail-vehicule',
    standalone: true,
    imports: [CommonModule, RouterModule, StatusBadgeComponent],
    templateUrl: './detail-vehicule.component.html',
    styleUrl: './detail-vehicule.component.css'
})
export class DetailVehiculeComponent implements OnInit {
    vehicle: any = null;
    owner: any = null;
    activeImageIndex = 0;

    constructor(
        public appData: AppDataService,
        public fmt: FormatService,
        private toast: ToastService,
        private route: ActivatedRoute,
        private modalService: ModalService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.loadVehicle();
    }

    loadVehicle() {
        const id = this.route.snapshot.paramMap.get('id');
        this.vehicle = this.appData.vehicules.find(v => v.id === id) || null;
        if (this.vehicle) {
            this.owner = this.appData.users.find(u => u.id === this.vehicle.proprietaireId) || null;
        }
    }

    async askUpdateStatus(status: any) {
        const isValide = status === 'valide';
        const isRefuse = status === 'refuse';
        const title = isValide ? 'Valider le véhicule' : isRefuse ? 'Refuser le véhicule' : 'Changer le statut';
        const message = `Êtes-vous sûr de vouloir passer ce véhicule au statut "${isValide ? 'Validé' : isRefuse ? 'Refusé' : status}" ?`;

        const confirmed = await this.modalService.confirm({
            title,
            message,
            type: isRefuse ? 'danger' : 'info'
        });

        if (confirmed) {
            this.onConfirmAction(status);
        }
    }

    private onConfirmAction(status: any) {
        if (this.vehicle && status) {
            const vehicleInArray = this.appData.vehicules.find(v => v.id === this.vehicle.id);
            if (vehicleInArray) {
                vehicleInArray.statut = status;
                if (status === 'valide') {
                    vehicleInArray.documents = 'valide';
                    vehicleInArray.disponible = true;
                }
            }

            this.appData.saveData();
            this.toast.success('Statut mis à jour', `Le véhicule est maintenant ${status}`);

            // Refresh local reference and trigger detection
            this.loadVehicle();
            this.cdr.detectChanges();
        }
    }
}
