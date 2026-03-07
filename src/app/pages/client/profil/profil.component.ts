import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppDataService } from '../../../services/app-data.service';
import { FormatService } from '../../../services/format.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent {
  user: any; form: any = {};
  constructor(public appData: AppDataService, public fmt: FormatService, private toast: ToastService) {
    this.user = this.appData.currentUser;
    if (this.user) this.form = { ...this.user };
  }
  save() {
    if (!this.user) return;
    Object.assign(this.user, { nom: this.form.nom, prenom: this.form.prenom, email: this.form.email, telephone: this.form.telephone, ville: this.form.ville, adresse: this.form.adresse });
    this.appData.saveData(); this.toast.success('Profil mis à jour', 'Vos informations ont été enregistrées');
  }
}
