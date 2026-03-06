import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppDataService } from '../../../services/app-data.service';
import { FormatService } from '../../../services/format.service';
import { ToastService } from '../../../services/toast.service';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-utilisateurs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, StatusBadgeComponent],
  templateUrl: './utilisateurs.component.html',
  styleUrl: './utilisateurs.component.css'
})
export class UtilisateursComponent implements OnInit {
  users: any[] = [];
  searchTerm: string = '';

  constructor(
    public appData: AppDataService,
    public fmt: FormatService,
    private toast: ToastService,
    private modalService: ModalService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() { this.loadUsers(); }

  loadUsers() {
    this.users = this.appData.users.filter(u => u.statut !== 'banni');
    this.cdr.detectChanges();
  }

  get filteredUsers() {
    return this.users.filter(u =>
      u.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      u.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  async askToggleStatus(user: any) {
    const isActif = user.statut === 'actif';
    const confirmed = await this.modalService.confirm({
      title: 'Changer statut compte',
      message: `Voulez-vous ${isActif ? 'suspendre' : 'activer'} ce compte ?`,
      type: isActif ? 'danger' : 'info'
    });

    if (confirmed) {
      this.onConfirmAction(user, 'toggle');
    }
  }

  async askBanUser(user: any) {
    const confirmed = await this.modalService.confirm({
      title: 'Bannir utilisateur',
      message: `Êtes-vous sûr de vouloir bannir définitivement cet utilisateur ?`,
      type: 'danger'
    });

    if (confirmed) {
      this.onConfirmAction(user, 'ban');
    }
  }

  private onConfirmAction(user: any, action: 'toggle' | 'ban') {
    const userInArray = this.appData.users.find(u => u.id === user.id);

    if (userInArray) {
      if (action === 'toggle') {
        userInArray.statut = userInArray.statut === 'actif' ? 'suspendu' : 'actif';
        this.toast.success('Statut mis à jour', `Compte ${userInArray.statut}`);
      } else if (action === 'ban') {
        userInArray.statut = 'banni';
        this.toast.error('Utilisateur banni', 'L\'utilisateur ne peut plus se connecter');
        this.loadUsers();
      }
      this.appData.saveData();
    }
  }
}
