import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppDataService } from '../../../services/app-data.service';
import { FormatService } from '../../../services/format.service';

@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit-log.component.html',
  styleUrl: './audit-log.component.css'
})
export class AuditLogComponent implements OnInit {
  filteredLogs: any[] = []; searchTerm = '';
  constructor(public appData: AppDataService, public fmt: FormatService) { }
  ngOnInit() { this.filterLogs(); }
  filterLogs() {
    let logs = [...this.appData.auditLog];
    if (this.searchTerm) { const q = this.searchTerm.toLowerCase(); logs = logs.filter(l => l.action.toLowerCase().includes(q) || l.utilisateur.toLowerCase().includes(q) || l.details.toLowerCase().includes(q)); }
    this.filteredLogs = logs;
  }
}
