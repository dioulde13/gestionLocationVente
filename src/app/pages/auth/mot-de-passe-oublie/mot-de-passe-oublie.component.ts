import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-mot-de-passe-oublie',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './mot-de-passe-oublie.component.html',
  styleUrl: './mot-de-passe-oublie.component.css'
})
export class MotDePasseOublieComponent {
  email = ''; loading = false;
  constructor(private authService: AuthService, private toast: ToastService, private router: Router) { }
  async onSubmit(): Promise<void> {
    this.loading = true;
    await this.authService.forgotPassword(this.email);
    this.loading = false;
    this.toast.success('Email envoyé !', 'Un lien de réinitialisation a été envoyé.');
    setTimeout(() => this.router.navigate(['/auth/reinitialisation']), 1500);
  }
}
