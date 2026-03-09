import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppDataService } from '../../../services/app-data.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-ajouter-vehicule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ajouter-vehicule.component.html',
  styleUrl: './ajouter-vehicule.component.css'
})
export class AjouterVehiculeComponent {
  f: any = { type: 'location', marque: '', modele: '', annee: 2024, categorie: 'SUV', carburant: 'Essence', transmission: 'Automatique', places: 5, climatisation: true, couleur: '', ville: 'Conakry', kilometrage: 0, immatriculation: '', prixJour: 200000, prixSemaine: 1200000, prixMois: 4000000, prixVente: 0, description: '' };

  imagesPreviews: string[] = [];

  constructor(private appData: AppDataService, private toast: ToastService, private router: Router) { }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const files = Array.from(input.files);
    this.imagesPreviews = [];

    files.forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) this.imagesPreviews.push(result);
      };
      reader.readAsDataURL(file);
    });
  }

  removeImage(index: number): void {
    this.imagesPreviews.splice(index, 1);
  }

  submit() {
    if (!this.f.marque || !this.f.modele) { this.toast.warning('Champs requis', 'Veuillez remplir la marque et le modèle'); return; }
    this.appData.vehicules.push({
      id: this.appData.generateId(),
      proprietaireId: this.appData.currentUser?.id || '',
      ...this.f,
      disponible: true,
      statut: 'en_attente',
      images: [...this.imagesPreviews],
      documents: 'en_attente',
      rating: 0,
      totalLocations: 0
    });
    this.appData.saveData();
    this.toast.success('Véhicule ajouté !', 'Votre véhicule est en attente de validation');
    this.router.navigate(['/proprietaire/vehicules']);
  }
}
