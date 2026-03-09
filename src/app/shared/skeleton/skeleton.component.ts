import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-skeleton',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './skeleton.component.html',
    styleUrl: './skeleton.component.css'
})
export class SkeletonComponent {
    @Input() type: 'table' | 'card' | 'list' | 'text' = 'table';
    @Input() rows: number = 5;
    @Input() columns: number = 5;

    get rowArray() {
        return Array(this.rows).fill(0);
    }

    get colArray() {
        return Array(this.columns).fill(0);
    }
}
