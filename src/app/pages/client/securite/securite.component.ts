import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppDataService } from '../../../services/app-data.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-securite',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './securite.component.html',
  styleUrl: './securite.component.css'
})
export class SecuriteComponent {
  currentPwd = ''; newPwd = ''; confirmPwd = '';
  constructor(private appData: AppDataService, private toast: ToastService) { }
  changePassword() {
    const user = this.appData.currentUser; if (!user) return;
    if (this.currentPwd !== user.password) { this.toast.error('Erreur', 'Mot de passe actuel incorrect'); return; }
    if (this.newPwd !== this.confirmPwd) { this.toast.error('Erreur', 'Les mots de passe ne correspondent pas'); return; }
    user.password = this.newPwd; this.appData.saveData(); this.toast.success('Mot de passe modifié', 'Votre mot de passe a été mis à jour');
    this.currentPwd = ''; this.newPwd = ''; this.confirmPwd = '';
  }
}
