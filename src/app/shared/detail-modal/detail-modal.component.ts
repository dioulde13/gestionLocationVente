import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatService } from '../../services/format.service';

@Component({
    selector: 'app-detail-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './detail-modal.component.html',
    styleUrl: './detail-modal.component.css'
})
export class DetailModalComponent {
    @Input() isOpen = false;
    @Input() title = 'Détails';
    @Input() data: any = null;
    @Input() type: any = 'vehicle';

    @Output() close = new EventEmitter<void>();

    constructor(public fmt: FormatService) { }

    onClose() {
        this.close.emit();
    }
}
