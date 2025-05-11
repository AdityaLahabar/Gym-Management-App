//import { Component } from '@angular/core';
import { Component, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

//import { AuthService } from '../../services/auth.service';
//import { UserRole } from '../../models/user.model';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
     CommonModule,
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {
  @Output() closeSidenav = new EventEmitter<void>();
  
  constructor(private authService: AuthService) {}
  
  isLoggedIn = computed(() => this.authService.isLoggedIn());
  isAdmin = computed(() => this.authService.user()?.role === UserRole.ADMIN);
  
  logout(): void {
    this.authService.logout();
  }
}
