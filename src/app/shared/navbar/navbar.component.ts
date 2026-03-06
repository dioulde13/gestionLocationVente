import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppDataService } from '../../services/app-data.service';
import { FormatService } from '../../services/format.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  breadcrumb = '';

  constructor(private appData: AppDataService, private format: FormatService) { }

  get userInitials(): string {
    const u = this.appData.currentUser;
    return u ? this.format.initials(`${u.prenom} ${u.nom}`) : '';
  }

  get avatarColor(): string {
    const u = this.appData.currentUser;
    return u ? this.appData.getAvatarColor(u.prenom + u.nom) : '';
  }
}
