import { Injectable } from '@angular/core';
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
    private _isOpen = false;
    private _config: ModalConfig = {
        title: 'Confirmation',
        message: 'Êtes-vous sûr de vouloir effectuer cette action ?',
        confirmText: 'Confirmer',
        cancelText: 'Annuler',
        type: 'info'
    };

    private confirmSubject = new Subject<boolean>();

    get isOpen() { return this._isOpen; }
    get config() { return this._config; }

    confirm(config: ModalConfig): Promise<boolean> {
        this._config = {
            title: config.title,
            message: config.message,
            confirmText: config.confirmText || 'Confirmer',
            cancelText: config.cancelText || 'Annuler',
            type: config.type || 'info'
        };
        this._isOpen = true;

        return new Promise((resolve) => {
            const sub = this.confirmSubject.subscribe(result => {
                sub.unsubscribe();
                resolve(result);
            });
        });
    }

    onConfirm() {
        this._isOpen = false;
        this.confirmSubject.next(true);
    }

    onCancel() {
        this._isOpen = false;
        this.confirmSubject.next(false);
    }
}
