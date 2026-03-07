import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal.service';

@Component({
    selector: 'app-confirm-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './confirm-modal.component.html',
    styleUrl: './confirm-modal.component.css'
})
export class ConfirmModalComponent {

    constructor(public modalService: ModalService) { }

    onConfirm() {
        this.modalService.onConfirm();
    }

    onCancel() {
        this.modalService.onCancel();
    }
}
