import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

export interface ModalConfig {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'info' | 'danger';
}

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    isOpen = signal<boolean>(false);
    config = signal<ModalConfig>({
        title: 'Confirmation',
        message: 'Êtes-vous sûr de vouloir effectuer cette action ?',
        confirmText: 'Confirmer',
        cancelText: 'Annuler',
        type: 'info'
    });

    private confirmSubject = new Subject<boolean>();

    confirm(config: ModalConfig): Promise<boolean> {
        this.config.set({
            title: config.title,
            message: config.message,
            confirmText: config.confirmText || 'Confirmer',
            cancelText: config.cancelText || 'Annuler',
            type: config.type || 'info'
        });
        this.isOpen.set(true);

        return new Promise((resolve) => {
            const sub = this.confirmSubject.subscribe(result => {
                sub.unsubscribe();
                resolve(result);
            });
        });
    }

    onConfirm() {
        this.isOpen.set(false);
        this.confirmSubject.next(true);
    }

    onCancel() {
        this.isOpen.set(false);
        this.confirmSubject.next(false);
    }
}
