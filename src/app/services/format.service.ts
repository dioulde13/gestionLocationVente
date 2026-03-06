import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FormatService {

    currency(amount: number, currency: string = 'GNF'): string {
        return new Intl.NumberFormat('fr-FR').format(amount) + ' ' + currency;
    }

    date(dateStr: string): string {
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    }

    dateShort(dateStr: string): string {
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            year: 'numeric', month: '2-digit', day: '2-digit'
        });
    }

    dateTime(dateStr: string): string {
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        } as any);
    }

    timeAgo(dateStr: string): string {
        const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
        const intervals = [
            { label: 'an', seconds: 31536000 },
            { label: 'mois', seconds: 2592000 },
            { label: 'jour', seconds: 86400 },
            { label: 'heure', seconds: 3600 },
            { label: 'minute', seconds: 60 },
        ];
        for (const i of intervals) {
            const count = Math.floor(seconds / i.seconds);
            if (count > 0) return `Il y a ${count} ${i.label}${count > 1 && i.label !== 'mois' ? 's' : ''}`;
        }
        return "À l'instant";
    }

    capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    truncate(str: string, len: number = 50): string {
        return str.length > len ? str.substring(0, len) + '...' : str;
    }

    initials(name: string): string {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }
}
