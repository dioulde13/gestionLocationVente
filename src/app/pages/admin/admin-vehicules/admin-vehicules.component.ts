import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppDataService } from '../../../services/app-data.service';
import { FormatService } from '../../../services/format.service';
import { ToastService } from '../../../services/toast.service';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-admin-vehicules',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-vehicules.component.html',
  styleUrl: './admin-vehicules.component.css'
})
export class AdminVehiculesComponent implements OnInit {
  allVehicles: any[] = [];

  constructor(
    public appData: AppDataService,
    public fmt: FormatService,
    private toast: ToastService,
    private modalService: ModalService
  ) { }
  ngOnInit() { this.allVehicles = this.appData.vehicules; }
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
      }
    }
  }
}
