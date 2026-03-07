import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppDataService } from '../../../services/app-data.service';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css'
})
export class DocumentsComponent implements OnInit {
  vehicles: any[] = [];
  constructor(private appData: AppDataService) { }
  ngOnInit() { this.vehicles = this.appData.vehicules.filter(v => v.proprietaireId === this.appData.currentUser?.id); }
}
