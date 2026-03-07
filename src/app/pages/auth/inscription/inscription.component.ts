import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.css'
})
export class InscriptionComponent {
  form = { nom: '', prenom: '', email: '', telephone: '', role: 'client', password: '', nomAgence: '' };
  confirmPassword = '';
  termsAccepted = false;
  loading = false;

  constructor(private authService: AuthService, private toast: ToastService, private router: Router) { }

  async onSubmit(): Promise<void> {
    if (!this.form.nom || !this.form.prenom || !this.form.email || !this.form.telephone || !this.form.password) {
      this.toast.warning('Champs requis', 'Veuillez remplir tous les champs obligatoires');
      return;
    }
    if (this.form.password !== this.confirmPassword) {
      this.toast.error('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }
    if (!this.termsAccepted) {
      this.toast.warning('Conditions', "Veuillez accepter les conditions d'utilisation");
      return;
    }
    this.loading = true;
    const result = await this.authService.register(this.form);
    this.loading = false;
    if (result.success) {
      this.toast.success('Inscription réussie !', `Un code de vérification a été envoyé. ${result.message}`);
      setTimeout(() => this.router.navigate(['/auth/otp']), 1500);
    } else {
      this.toast.error('Erreur', result.message);
    }
  }
}
