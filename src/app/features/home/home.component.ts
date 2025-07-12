import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
     CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
 constructor(public authService: AuthService) {}
  backgroundImages: string[] = [
   'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/1547248/pexels-photo-1547248.jpeg',
    'https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg',
    'https://images.pexels.com/photos/28061/pexels-photo.jpg'
  ];
  currentIndex = 0;
  currentBackground = this.backgroundImages[0];

  ngOnInit(): void {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.backgroundImages.length;
      this.currentBackground = this.backgroundImages[this.currentIndex];
    }, 5000); // every 5 seconds
  }
}
