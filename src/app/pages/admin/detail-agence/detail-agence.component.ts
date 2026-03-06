import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AppDataService } from '../../../services/app-data.service';
import { FormatService } from '../../../services/format.service';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';

@Component({
    selector: 'app-detail-agence',
    standalone: true,
    imports: [CommonModule, RouterModule, StatusBadgeComponent],
    templateUrl: './detail-agence.component.html',
    styleUrl: './detail-agence.component.css'
})
export class DetailAgenceComponent implements OnInit {
    agence: any = null;
    vehicules: any[] = [];

    constructor(
        public appData: AppDataService,
        public fmt: FormatService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        this.agence = this.appData.agences.find(a => a.id === id) || null;
        if (this.agence) {
            this.vehicules = this.appData.vehicules.filter(v => v.agenceId === id);
        }
    }
}
