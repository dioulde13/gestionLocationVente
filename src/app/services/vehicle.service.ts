import { Injectable } from '@angular/core';
import { AppDataService } from './app-data.service';
import { ToastService } from './toast.service';
import { Vehicle } from '../models/models';

@Injectable({ providedIn: 'root' })
export class VehicleService {

    constructor(private appData: AppDataService, private toast: ToastService) { }

    getFilteredVehicles(filters: any = {}): Vehicle[] {
        let vehicles = [...this.appData.vehicules].filter(v => v.statut === 'valide');

        if (filters.search) {
            const q = filters.search.toLowerCase();
            vehicles = vehicles.filter(v =>
                v.marque.toLowerCase().includes(q) ||
                v.modele.toLowerCase().includes(q) ||
                v.description.toLowerCase().includes(q)
            );
        }

        if (filters.marque) vehicles = vehicles.filter(v => v.marque === filters.marque);
        if (filters.categorie) vehicles = vehicles.filter(v => v.categorie === filters.categorie);
        if (filters.carburant) vehicles = vehicles.filter(v => v.carburant === filters.carburant);
        if (filters.transmission) vehicles = vehicles.filter(v => v.transmission === filters.transmission);
        if (filters.ville) vehicles = vehicles.filter(v => v.ville === filters.ville);
        if (filters.disponible !== undefined) vehicles = vehicles.filter(v => v.disponible === filters.disponible);
        if (filters.type) vehicles = vehicles.filter(v => v.type === filters.type);
        if (filters.prixMin) {
            vehicles = vehicles.filter(v => (v.type === 'vente' ? (v.prixVente || 0) : (v.prixJour || 0)) >= filters.prixMin);
        }
        if (filters.prixMax) {
            vehicles = vehicles.filter(v => (v.type === 'vente' ? (v.prixVente || 0) : (v.prixJour || 0)) <= filters.prixMax);
        }
        if (filters.places) vehicles = vehicles.filter(v => v.places >= filters.places);
        if (filters.anneeMin) vehicles = vehicles.filter(v => v.annee >= filters.anneeMin);

        switch (filters.sort) {
            case 'prix-asc': vehicles.sort((a, b) => (a.prixJour || 0) - (b.prixJour || 0)); break;
            case 'prix-desc': vehicles.sort((a, b) => (b.prixJour || 0) - (a.prixJour || 0)); break;
            case 'recent': vehicles.sort((a, b) => b.annee - a.annee); break;
            case 'rating': vehicles.sort((a, b) => b.rating - a.rating); break;
            case 'populaire': vehicles.sort((a, b) => b.totalLocations - a.totalLocations); break;
            default: vehicles.sort((a, b) => b.rating - a.rating);
        }

        return vehicles;
    }

    toggleFavorite(vehicleId: string): boolean {
        const index = this.appData.favoris.indexOf(vehicleId);
        if (index > -1) {
            this.appData.favoris.splice(index, 1);
            this.toast.info('Retiré', 'Véhicule retiré des favoris');
            this.appData.saveData();
            return false;
        } else {
            this.appData.favoris.push(vehicleId);
            this.toast.success('Ajouté', 'Véhicule ajouté aux favoris');
            this.appData.saveData();
            return true;
        }
    }

    isFavorite(vehicleId: string): boolean {
        return this.appData.favoris.includes(vehicleId);
    }

    calculateRentalPrice(vehicle: Vehicle, startDate: string, endDate: string): { days: number; total: number; perDay: number } {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

        if (days <= 0) return { days: 0, total: 0, perDay: vehicle.prixJour || 0 };

        let total: number;
        if (days >= 30) {
            const months = Math.floor(days / 30);
            const remainingDays = days % 30;
            total = (months * (vehicle.prixMois || 0)) + (remainingDays * (vehicle.prixJour || 0));
        } else if (days >= 7) {
            const weeks = Math.floor(days / 7);
            const remainingDays = days % 7;
            total = (weeks * (vehicle.prixSemaine || 0)) + (remainingDays * (vehicle.prixJour || 0));
        } else {
            total = days * (vehicle.prixJour || 0);
        }

        return { days, total, perDay: Math.round(total / days) };
    }

    getVehicleFilterOptions(): any {
        const vehicles = this.appData.vehicules.filter(v => v.statut === 'valide');
        return {
            marques: [...new Set(vehicles.map(v => v.marque))].sort(),
            categories: [...new Set(vehicles.map(v => v.categorie))].sort(),
            carburants: [...new Set(vehicles.map(v => v.carburant))].sort(),
            transmissions: [...new Set(vehicles.map(v => v.transmission))].sort(),
            villes: [...new Set(vehicles.map(v => v.ville))].sort(),
            annees: [...new Set(vehicles.map(v => v.annee))].sort((a: number, b: number) => b - a),
        };
    }
}
