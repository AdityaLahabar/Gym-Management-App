import { Component, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

//import { AuthService } from '../../services/auth.service';
import { UserRole } from '../models/user.model';
import { AuthService } from '../services/auth.service';
//import { UserRole } from '../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ CommonModule,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {


   @Output() toggleSidenav = new EventEmitter<void>();
  
  constructor(private authService: AuthService) {}
  
  user = computed(() => this.authService.user());
  isLoggedIn = computed(() => this.authService.isLoggedIn());
  isAdmin = computed(() => this.user()?.role === UserRole.ADMIN);
  
  logout(): void {
    this.authService.logout();
  }

  mobileMenuOpen: boolean = false;

toggleMobileMenu(): void {
  this.mobileMenuOpen = !this.mobileMenuOpen;
}


}
