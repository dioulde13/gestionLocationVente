import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppDataService } from '../services/app-data.service';

export function authGuard(allowedRoles: string[] = []): CanActivateFn {
    return () => {
        const appData = inject(AppDataService);
        const router = inject(Router);

        if (!appData.currentUser) {
            router.navigate(['/auth/connexion']);
            return false;
        }

        if (allowedRoles.length > 0 && !allowedRoles.includes(appData.currentUser.role)) {
            const dashboardMap: Record<string, string> = {
                client: '/client/dashboard',
                proprietaire: '/proprietaire/dashboard',
                admin: '/admin/dashboard',
                agence: '/agence/dashboard'
            };
            router.navigate([dashboardMap[appData.currentUser.role] || '/']);
            return false;
        }

        return true;
    };
}
