import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppDataService } from '../../../services/app-data.service';
import { FormatService } from '../../../services/format.service';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';

@Component({
  selector: 'app-admin-agences',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusBadgeComponent],
  templateUrl: './agences.component.html',
  styleUrl: './agences.component.css'
})
export class AdminAgencesComponent implements OnInit {
  agences: any[] = [];

  constructor(public appData: AppDataService, public fmt: FormatService) { }
  ngOnInit() { this.agences = this.appData.agences; }
}
