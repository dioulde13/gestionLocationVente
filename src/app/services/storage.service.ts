import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
    private prefix = 'autoloc_';

    get<T>(key: string, defaultValue: T | null = null): T | null {
        try {
            const item = localStorage.getItem(`${this.prefix}${key}`);
            return item ? JSON.parse(item) as T : defaultValue;
        } catch {
            return defaultValue;
        }
    }

    set(key: string, value: any): void {
        try {
            localStorage.setItem(`${this.prefix}${key}`, JSON.stringify(value));
        } catch (e) {
            console.warn('Storage error:', e);
        }
    }

    remove(key: string): void {
        localStorage.removeItem(`${this.prefix}${key}`);
    }

    clear(): void {
        Object.keys(localStorage)
            .filter(k => k.startsWith(this.prefix))
            .forEach(k => localStorage.removeItem(k));
    }
}
