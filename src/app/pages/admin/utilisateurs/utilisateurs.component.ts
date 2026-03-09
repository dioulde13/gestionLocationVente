import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppDataService } from '../../../services/app-data.service';
import { FormatService } from '../../../services/format.service';
import { ToastService } from '../../../services/toast.service';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';
import { ModalService } from '../../../services/modal.service';
import { SkeletonComponent } from '../../../shared/skeleton/skeleton.component';

@Component({
  selector: 'app-utilisateurs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, StatusBadgeComponent, SkeletonComponent],
  templateUrl: './utilisateurs.component.html',
  styleUrl: './utilisateurs.component.css'
})
export class UtilisateursComponent implements OnInit {
  users: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;

  constructor(
    public appData: AppDataService,
    public fmt: FormatService,
    private toast: ToastService,
    private modalService: ModalService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() { this.loadUsers(); }

  async loadUsers() {
    await this.appData.simulateLoading();
    this.users = this.appData.users
      .filter(u => u.statut !== 'banni')
      .sort((a, b) => {
        const dateA = new Date(a.dateInscription || '2024-01-01').getTime();
        const dateB = new Date(b.dateInscription || '2024-01-01').getTime();
        return dateB - dateA;
      });
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.totalFilteredItems / this.pageSize);
    if (this.currentPage > this.totalPages) this.currentPage = Math.max(1, this.totalPages);
    this.cdr.detectChanges();
  }

  setPage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  get totalFilteredItems(): number {
    return this.allFilteredUsers.length;
  }

  get allFilteredUsers() {
    return this.users.filter(u =>
      u.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      u.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get pagedUsers() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.allFilteredUsers.slice(start, start + this.pageSize);
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
