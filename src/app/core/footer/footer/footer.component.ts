import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, MatToolbarModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
 currentYear = new Date().getFullYear();
}
