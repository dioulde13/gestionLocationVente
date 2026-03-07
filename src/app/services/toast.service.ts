import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastMessage } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ToastService {
    private toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
    toasts$ = this.toastsSubject.asObservable();

    show(type: 'success' | 'error' | 'warning' | 'info', title: string, message: string, duration: number = 4000): void {
        const toast: ToastMessage = { type, title, message, duration };
        const current = this.toastsSubject.value;
        this.toastsSubject.next([...current, toast]);

        setTimeout(() => {
            const updated = this.toastsSubject.value.filter(t => t !== toast);
            this.toastsSubject.next(updated);
        }, duration);
    }

    success(title: string, message: string): void { this.show('success', title, message); }
    error(title: string, message: string): void { this.show('error', title, message); }
    warning(title: string, message: string): void { this.show('warning', title, message); }
    info(title: string, message: string): void { this.show('info', title, message); }
}
