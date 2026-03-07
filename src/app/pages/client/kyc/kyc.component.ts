import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppDataService } from '../../../services/app-data.service';
import { ToastService } from '../../../services/toast.service';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';

@Component({
  selector: 'app-kyc',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadgeComponent],
  templateUrl: './kyc.component.html',
  styleUrl: './kyc.component.css'
})
export class KycComponent {
  user: any; docType = 'cni'; docNumber = '';
  constructor(public appData: AppDataService, private toast: ToastService) { this.user = this.appData.currentUser; }
  getKycMessage(): string {
    const m: Record<string, string> = { non_soumis: 'Vous devez soumettre vos documents KYC.', en_attente: 'Vos documents sont en cours de vérification.', valide: 'Votre identité a été vérifiée.', refuse: 'Vos documents ont été refusés. Soumettez à nouveau.' };
    return m[this.user?.kyc || 'non_soumis'] || '';
  }
  submit() { if (!this.user) return; this.user.kyc = 'en_attente'; this.appData.saveData(); this.toast.success('KYC soumis', 'Vos documents sont en cours de vérification'); }
}
