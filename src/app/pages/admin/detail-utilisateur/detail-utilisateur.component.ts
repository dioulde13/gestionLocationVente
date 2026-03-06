import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AppDataService } from '../../../services/app-data.service';
import { FormatService } from '../../../services/format.service';
import { ToastService } from '../../../services/toast.service';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';
import { User } from '../../../models/models';

@Component({
  selector: 'app-detail-utilisateur',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusBadgeComponent],
  templateUrl: './detail-utilisateur.component.html',
  styleUrl: './detail-utilisateur.component.css'
})
export class DetailUtilisateurComponent implements OnInit {
  user: User | null = null; userLocations: any[] = []; userVehicles: any[] = [];
  constructor(public appData: AppDataService, public fmt: FormatService, private toast: ToastService, private route: ActivatedRoute) { }
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.user = this.appData.users.find(u => u.id === id) || null;
    if (this.user) { this.userLocations = this.appData.locations.filter(l => l.clientId === id); this.userVehicles = this.appData.vehicules.filter(v => v.proprietaireId === id); }
  }
  getVehicleName(vId: string): string { const v = this.appData.vehicules.find(x => x.id === vId); return v ? `${v.marque} ${v.modele}` : 'N/A'; }
  toggleStatus() { if (!this.user) return; this.user.statut = this.user.statut === 'actif' ? 'suspendu' : 'actif'; this.appData.saveData(); this.toast.success('Mis à jour', `Compte ${this.user.statut}`); }
  validateKYC(status: string) { if (!this.user) return; this.user.kyc = status as any; this.appData.saveData(); this.toast.success('KYC', `KYC ${status === 'valide' ? 'validé' : 'refusé'}`); }
}
