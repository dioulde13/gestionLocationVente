import { Component, OnInit, QueryList, ViewChildren, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.css'
})
export class OtpComponent implements OnInit {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;
  digits: string[] = ['', '', '', ''];
  loading = false;
  otpHint: any = null;

  constructor(
    private authService: AuthService,
    private toast: ToastService,
    private storage: StorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.otpHint = this.storage.get<any>('pendingOTP');
  }

  onInput(index: number): void {
    if (this.digits[index] && index < 3) {
      const inputs = this.otpInputs.toArray();
      inputs[index + 1]?.nativeElement.focus();
    }
  }

  onKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.digits[index] && index > 0) {
      const inputs = this.otpInputs.toArray();
      inputs[index - 1]?.nativeElement.focus();
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const text = event.clipboardData?.getData('text')?.replace(/\D/g, '').slice(0, 4) || '';
    text.split('').forEach((char, i) => { this.digits[i] = char; });
  }

  async onSubmit(): Promise<void> {
    const otp = this.digits.join('');
    if (otp.length !== 4) {
      this.toast.warning('Code incomplet', 'Veuillez saisir les 4 chiffres');
      return;
    }
    this.loading = true;
    const result = await this.authService.verifyOTP(otp);
    this.loading = false;
    if (result.success) {
      this.toast.success('Vérifié !', result.message);
      if (result.redirectTo) {
        setTimeout(() => this.router.navigate([result.redirectTo]), 1000);
      }
    } else {
      this.toast.error('Code invalide', result.message);
      this.digits = ['', '', '', ''];
      this.otpInputs.first?.nativeElement.focus();
    }
  }

  resendOTP(): void {
    const pending = this.storage.get<any>('pendingOTP');
    if (pending) {
      this.toast.info('Code renvoyé', `Un nouveau code a été envoyé. Code: ${pending.otp}`);
    } else {
      this.toast.warning('Erreur', 'Aucune demande OTP en cours.');
    }
  }
}
