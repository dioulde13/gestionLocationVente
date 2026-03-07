import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppDataService } from '../../services/app-data.service';

@Component({
    selector: 'app-status-badge',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './status-badge.component.html',
    styleUrl: './status-badge.component.css'
})
export class StatusBadgeComponent {
    @Input() status: string = '';

    get badgeInfo() { return this.appData.getStatusBadge(this.status); }

    constructor(private appData: AppDataService) { }
}
