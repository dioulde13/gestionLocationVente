import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppDataService } from '../../../services/app-data.service';
import { FormatService } from '../../../services/format.service';
import { ToastService } from '../../../services/toast.service';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-validation-kyc',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusBadgeComponent],
  templateUrl: './validation-kyc.component.html',
  styleUrl: './validation-kyc.component.css'
})
export class ValidationKycComponent implements OnInit {
  pendingUsers: any[] = [];

  constructor(
    public appData: AppDataService,
    public fmt: FormatService,
    private toast: ToastService,
    private modalService: ModalService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() { this.loadPending(); }

  loadPending() {
    this.pendingUsers = this.appData.users.filter(u => u.kyc === 'en_attente');
    this.cdr.detectChanges();
  }

  async askValidate(id: string, status: string) {
    const isValide = status === 'valide';
    const confirmed = await this.modalService.confirm({
      title: isValide ? 'Valider KYC' : 'Refuser KYC',
      message: `Êtes-vous sûr de vouloir ${isValide ? 'valider' : 'refuser'} le dossier KYC de cet utilisateur ?`,
      type: isValide ? 'info' : 'danger'
    });

    if (confirmed) {
      this.onConfirmAction(id, status);
    }
  }

  private onConfirmAction(id: string, status: string) {
    const u = this.appData.users.find(x => x.id === id);
    if (u) {
      u.kyc = status as any;

      // Also update user status to actif if KYC is validated
      if (status === 'valide') {
        u.statut = 'actif';
      }

      this.appData.auditLog.unshift({
        id: this.appData.generateId(),
        action: 'Validation KYC',
        utilisateur: this.appData.currentUser?.email || '',
        details: `KYC ${status === 'valide' ? 'validé' : 'refusé'} pour ${u.prenom} ${u.nom}`,
        date: new Date().toISOString(),
        ip: '192.168.1.1'
      });

      this.appData.saveData();
      this.toast.success('KYC', `KYC ${status === 'valide' ? 'validé' : 'refusé'}`);
      this.loadPending();
    }
  }
}
