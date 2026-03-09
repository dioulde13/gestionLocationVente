import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-proprietaire-layout',
  standalone: true,
  imports: [RouterModule, SidebarComponent, NavbarComponent, ConfirmModalComponent],
  templateUrl: './proprietaire-layout.component.html',
  styleUrl: './proprietaire-layout.component.css'
})
export class ProprietaireLayoutComponent { }
