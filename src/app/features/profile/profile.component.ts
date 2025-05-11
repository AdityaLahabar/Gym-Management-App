import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { User, UserRole } from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
     CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user: User | null = null;
  profileForm: FormGroup;
  isLoading = false;
  hideCurrentPassword = true;
  hideNewPassword = true;
  
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.user = this.authService.user();
    
    this.profileForm = this.fb.group({
      name: [this.user?.name, [Validators.required]],
      email: [{ value: this.user?.email, disabled: true }],
      currentPassword: [''],
      newPassword: ['', [Validators.minLength(6)]]
    });
  }
  
  saveProfile() {
    // This is just a mock implementation
    // In a real application, you would call an API to update the user profile
    
    if (this.profileForm.valid) {
      this.isLoading = true;
      
      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        this.notificationService.showSuccess('Profile updated successfully');
      }, 1000);
    }
  }
}