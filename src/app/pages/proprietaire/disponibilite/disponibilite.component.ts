import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppDataService } from '../../../services/app-data.service';
import { FormatService } from '../../../services/format.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-disponibilite',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './disponibilite.component.html',
  styleUrl: './disponibilite.component.css'
})
export class DisponibiliteComponent implements OnInit {
  vehicles: any[] = [];
  constructor(private appData: AppDataService, public fmt: FormatService, private toast: ToastService) { }
  ngOnInit() { this.vehicles = this.appData.vehicules.filter(v => v.proprietaireId === this.appData.currentUser?.id); }
  toggle(v: any) { v.disponible = !v.disponible; this.appData.saveData(); this.toast.info('Mis à jour', `${v.marque} ${v.modele} ${v.disponible ? 'disponible' : 'indisponible'}`); }
}
