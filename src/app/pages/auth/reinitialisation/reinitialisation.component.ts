import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-reinitialisation',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './reinitialisation.component.html',
  styleUrl: './reinitialisation.component.css'
})
export class ReinitialisationComponent {
  password = ''; confirmPassword = ''; loading = false;
  constructor(private authService: AuthService, private toast: ToastService, private router: Router) { }
  async onSubmit(): Promise<void> {
    if (this.password !== this.confirmPassword) { this.toast.error('Erreur', 'Les mots de passe ne correspondent pas'); return; }
    this.loading = true;
    await this.authService.resetPassword(this.password);
    this.loading = false;
    this.toast.success('Mot de passe modifié !', 'Vous pouvez vous connecter.');
    setTimeout(() => this.router.navigate(['/auth/connexion']), 1500);
  }
}
