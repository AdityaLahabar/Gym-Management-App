import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

//import { HeaderComponent } from './core/components/header/header.component';
//import { FooterComponent } from './core/components/footer/footer.component';
///import { SidenavComponent } from './core/components/sidenav/sidenav.component';
import { NotificationComponent } from './shared/components/notification/notification.component';
import { AuthService } from './core/services/auth.service';
import { FooterComponent } from './core/footer/footer/footer.component';
import { HeaderComponent } from './core/header/header.component';
import { SidenavComponent } from './core/sidenav/sidenav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
     CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    HeaderComponent,
    FooterComponent,
    SidenavComponent,
    NotificationComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
   constructor(private authService: AuthService) {
    // Initialize auth state from localStorage on app start
    this.authService.checkAuthState();
  }
}
