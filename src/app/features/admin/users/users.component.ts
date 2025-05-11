import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule, Sort } from '@angular/material/sort';

import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { User, UserRole } from '../../../core/models/user.model';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
//import { ConfirmDialogComponent } from './confirm-dialog.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
     CommonModule,
    FormsModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    MatPaginatorModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSortModule,
    ConfirmDialogComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  paginatedUsers: User[] = [];
  isLoading = true;
  
  // Filters
  searchTerm = '';
  roleFilter = '';
  
  // Pagination
  pageSize = 10;
  pageIndex = 0;
  
  // Table columns
  displayedColumns: string[] = ['name', 'email', 'membership', 'role', 'createdAt', 'actions'];
  
  // Current user
  currentUserId = '';
  
  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {
    const currentUser = this.authService.user();
    if (currentUser) {
      this.currentUserId = currentUser.id;
    }
  }
  
  ngOnInit() {
    this.loadUsers();
  }
  
  loadUsers() {
    this.isLoading = true;
    
    this.authService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.showError('Failed to load users');
        console.error('Error loading users:', error);
      }
    });
  }
  
  applyFilter() {
    let filteredData = [...this.users];
    
    // Apply search filter
    if (this.searchTerm) {
      const searchTermLower = this.searchTerm.toLowerCase();
      filteredData = filteredData.filter(user => 
        user.name.toLowerCase().includes(searchTermLower) ||
        user.email.toLowerCase().includes(searchTermLower)
      );
    }
    
    // Apply role filter
    if (this.roleFilter) {
      filteredData = filteredData.filter(user => user.role === this.roleFilter);
    }
    
    this.filteredUsers = filteredData;
    this.updatePaginatedUsers();
  }
  
  updatePaginatedUsers() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }
  
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedUsers();
  }
  
  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      return;
    }
    
    this.filteredUsers = this.filteredUsers.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return this.compare(a.name, b.name, isAsc);
        case 'email': return this.compare(a.email, b.email, isAsc);
        case 'role': return this.compare(a.role, b.role, isAsc);
        case 'createdAt': return this.compare(new Date(a.createdAt), new Date(b.createdAt), isAsc);
        default: return 0;
      }
    });
    
    this.updatePaginatedUsers();
  }
  
  compare(a: any, b: any, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  
  toggleUserRole(user: User) {
    const newRole = user.role === UserRole.ADMIN ? UserRole.MEMBER : UserRole.ADMIN;
    const roleName = newRole === UserRole.ADMIN ? 'Administrator' : 'Member';
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Change User Role',
        message: `Are you sure you want to change ${user.name}'s role to ${roleName}?`
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        
        this.authService.updateUserRole(user.id, newRole).subscribe({
          next: (updatedUser) => {
            // Update the user in the local array
            const index = this.users.findIndex(u => u.id === updatedUser.id);
            if (index !== -1) {
              this.users[index] = updatedUser;
            }
            
            this.applyFilter();
            this.isLoading = false;
            this.notificationService.showSuccess(`User role updated to ${roleName}`);
          },
          error: (error) => {
            this.isLoading = false;
            this.notificationService.showError('Failed to update user role');
            console.error('Error updating role:', error);
          }
        });
      }
    });
  }
  
  resetPassword(user: User) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Reset Password',
        message: `Are you sure you want to reset the password for ${user.name}?`
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // This would call an API in a real application
        this.notificationService.showSuccess(`Password reset email sent to ${user.email}`);
      }
    });
  }
  
  deleteUser(user: User) {
    if (user.id === this.currentUserId) {
      this.notificationService.showError('You cannot delete your own account');
      return;
    }
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete User',
        message: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
        isDangerous: true
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        
        this.authService.deleteUser(user.id).subscribe({
          next: (success) => {
            if (success) {
              // Remove the user from the local array
              this.users = this.users.filter(u => u.id !== user.id);
              this.applyFilter();
              this.notificationService.showSuccess('User deleted successfully');
            } else {
              this.notificationService.showError('Failed to delete user');
            }
            this.isLoading = false;
          },
          error: (error) => {
            this.isLoading = false;
            this.notificationService.showError('Failed to delete user');
            console.error('Error deleting user:', error);
          }
        });
      }
    });
  }
}