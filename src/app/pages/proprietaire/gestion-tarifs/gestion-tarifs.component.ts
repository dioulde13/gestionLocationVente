import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppDataService } from '../../../services/app-data.service';
import { FormatService } from '../../../services/format.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-gestion-tarifs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-tarifs.component.html',
  styleUrl: './gestion-tarifs.component.css'
})
export class GestionTarifsComponent implements OnInit {
  vehicles: any[] = [];
  constructor(public appData: AppDataService, public fmt: FormatService, private toast: ToastService) { }
  ngOnInit() { this.vehicles = this.appData.vehicules.filter(v => v.proprietaireId === this.appData.currentUser?.id); }
  save(v: any) { this.appData.saveData(); this.toast.success('Tarifs mis à jour', `${v.marque} ${v.modele}`); }
}
