import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {
  constructor(public toastService: ToastService) { }

  getIcon(type: string): string {
    const icons: Record<string, string> = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
    return icons[type] || 'ℹ';
  }

  removeToast(toast: any): void {
    const current = (this.toastService as any).toastsSubject.value;
    (this.toastService as any).toastsSubject.next(current.filter((t: any) => t !== toast));
  }
}
