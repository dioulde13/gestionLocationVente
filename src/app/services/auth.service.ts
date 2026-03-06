import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppDataService } from './app-data.service';
import { StorageService } from './storage.service';
import { ToastService } from './toast.service';
import { User } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {

    constructor(
        private appData: AppDataService,
        private storage: StorageService,
        // private toast: ToastService,
        private router: Router
    ) { }

    get currentUser(): User | null {
        return this.appData.currentUser;
    }

    isLoggedIn(): boolean {
        return this.appData.currentUser !== null;
    }

    login(email: string, password: string): Promise<{ success: boolean; message: string }> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const user = this.appData.users.find(u => u.email === email && u.password === password);
                if (!user) {
                    resolve({ success: false, message: 'Email ou mot de passe incorrect' });
                    return;
                }
                if (user.statut === 'suspendu') {
                    resolve({ success: false, message: 'Votre compte a été suspendu. Contactez le support.' });
                    return;
                }
                const otpCode = this.appData.getOTPForEmail(email);
                this.storage.set('pendingOTP', { email, otp: otpCode, type: 'login', userId: user.id });
                resolve({ success: true, message: `Code OTP envoyé. Code: ${otpCode}` });
            }, 1500);
        });
    }

    register(userData: any): Promise<{ success: boolean; message: string }> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const existing = this.appData.users.find(u => u.email === userData.email);
                if (existing) {
                    resolve({ success: false, message: 'Cet email est déjà utilisé' });
                    return;
                }
                const newUser: User = {
                    id: this.appData.generateId(),
                    nom: userData.nom,
                    prenom: userData.prenom,
                    email: userData.email,
                    telephone: userData.telephone,
                    password: userData.password,
                    role: userData.role || 'client',
                    statut: 'actif',
                    kyc: 'non_soumis',
                    dateInscription: new Date().toISOString().split('T')[0],
                    avatar: '',
                    ville: '',
                    adresse: ''
                };
                if (userData.role === 'proprietaire' || userData.role === 'agence') {
                    newUser.nomAgence = userData.nomAgence || '';
                }
                this.appData.users.push(newUser);
                this.appData.saveData();
                const otpCode = this.appData.generateOTP();
                this.storage.set('pendingOTP', { email: userData.email, otp: otpCode, type: 'registration' });
                resolve({ success: true, message: `Code OTP: ${otpCode}` });
            }, 2000);
        });
    }

    verifyOTP(otp: string): Promise<{ success: boolean; message: string; redirectTo?: string }> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const pending = this.storage.get<any>('pendingOTP');
                if (!pending || otp !== pending.otp) {
                    resolve({ success: false, message: 'Le code OTP saisi est incorrect.' });
                    return;
                }
                if (pending.type === 'login') {
                    const user = this.appData.users.find(u => u.id === pending.userId);
                    if (user) {
                        this.appData.currentUser = user;
                        this.storage.set('currentUser', user);
                        this.appData.auditLog.unshift({
                            id: this.appData.generateId(),
                            action: 'Connexion',
                            utilisateur: user.email,
                            details: `Connexion réussie (OTP vérifié) - Rôle: ${this.appData.getRoleLabel(user.role)}`,
                            date: new Date().toISOString(),
                            ip: '192.168.1.' + Math.floor(Math.random() * 255)
                        });
                        this.appData.saveData();
                        this.storage.remove('pendingOTP');
                        const dashboardMap: Record<string, string> = {
                            client: '/client/dashboard',
                            proprietaire: '/proprietaire/dashboard',
                            admin: '/admin/dashboard',
                            agence: '/agence/dashboard'
                        };
                        resolve({ success: true, message: `Bienvenue ${user.prenom} ${user.nom}`, redirectTo: dashboardMap[user.role] || '/client/dashboard' });
                    }
                } else {
                    this.storage.remove('pendingOTP');
                    resolve({ success: true, message: 'Votre compte a été activé avec succès.', redirectTo: '/auth/connexion' });
                }
            }, 2000);
        });
    }

    forgotPassword(email: string): Promise<{ success: boolean }> {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.storage.set('resetEmail', email);
                resolve({ success: true });
            }, 2000);
        });
    }

    resetPassword(password: string): Promise<{ success: boolean }> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const email = this.storage.get<string>('resetEmail');
                const user = this.appData.users.find(u => u.email === email);
                if (user) {
                    user.password = password;
                    this.appData.saveData();
                }
                this.storage.remove('resetEmail');
                resolve({ success: true });
            }, 2000);
        });
    }

    logout(): void {
        this.appData.currentUser = null;
        this.storage.remove('currentUser');
        this.router.navigate(['/auth/connexion']);
    }

    getDashboardRoute(role: string): string {
        const map: Record<string, string> = {
            client: '/client/dashboard',
            proprietaire: '/proprietaire/dashboard',
            admin: '/admin/dashboard',
            agence: '/agence/dashboard'
        };
        return map[role] || '/client/dashboard';
    }
}
