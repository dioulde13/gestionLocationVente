import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppDataService } from '../../../services/app-data.service';
import { FormatService } from '../../../services/format.service';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';

@Component({
  selector: 'app-admin-clients',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusBadgeComponent],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class AdminClientsComponent implements OnInit {
  clients: any[] = [];

  constructor(public appData: AppDataService, public fmt: FormatService) { }
  ngOnInit() { this.clients = this.appData.users.filter(u => u.role === 'client' && u.statut !== 'banni'); }

  getLocationCount(id: string): number { return this.appData.locations.filter(l => l.clientId === id).length; }
}
