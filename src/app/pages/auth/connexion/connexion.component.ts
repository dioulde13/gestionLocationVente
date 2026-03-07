import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.css'
})
export class ConnexionComponent {
  email = '';
  password = '';
  remember = false;
  showPassword = false;
  loading = false;

  constructor(private authService: AuthService, private toast: ToastService, private router: Router) { }

  fillDemo(email: string, password: string): void {
    this.email = email;
    this.password = password;
  }

  async onSubmit(): Promise<void> {
    if (!this.email || !this.password) {
      this.toast.warning('Champs requis', 'Veuillez remplir tous les champs');
      return;
    }
    this.loading = true;
    const result = await this.authService.login(this.email, this.password);
    this.loading = false;
    if (result.success) {
      this.toast.info('Code OTP envoyé', result.message);
      setTimeout(() => this.router.navigate(['/auth/otp']), 1500);
    } else {
      this.toast.error('Échec', result.message);
    }
  }
}
