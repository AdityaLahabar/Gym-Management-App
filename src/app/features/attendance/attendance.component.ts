import { Component, computed, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';

import { AttendanceService } from '../../core/services/attendance.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { Attendance, AttendanceStats } from '../../core/models/attendance.model';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
     CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatProgressBarModule,
    MatDividerModule
  ],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css',
   schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AttendanceComponent {
  membershipNumber = '';
  isLoading = false;
  userAttendance: Attendance[] = [];
  stats: AttendanceStats | null = null;
  displayedColumns: string[] = ['date', 'checkInTime', 'checkOutTime', 'duration'];
  
  constructor(
    private attendanceService: AttendanceService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}
  
  ngOnInit() {
    this.loadUserAttendance();
  }
  
  user = computed(() => this.authService.user());
  
  get isCheckedIn(): boolean {
    if (!this.userAttendance.length) return false;
    
    // Check if user has an active check-in (no check-out time)
    const activeSession = this.userAttendance.find(a => 
      a.userId === this.user()?.id && 
      !a.checkOutTime && 
      new Date(a.checkInTime).setHours(0,0,0,0) === new Date().setHours(0,0,0,0)
    );
    
    return !!activeSession;
  }
  
  setCurrentUserMembershipNumber() {
    if (this.user()?.membershipNumber) {
      this.membershipNumber = this.user()?.membershipNumber || '';
    }
  }
  
  recordAttendance() {
    if (!this.membershipNumber) {
      this.notificationService.showError('Please enter a membership number');
      return;
    }
    
    this.isLoading = true;
    
    if (this.isCheckedIn) {
      this.attendanceService.checkOut(this.membershipNumber).subscribe({
        next: (record) => {
          this.isLoading = false;
          this.loadUserAttendance();
        },
        error: (error) => {
          this.isLoading = false;
          this.notificationService.showError(error.message || 'Failed to check out');
        }
      });
    } else {
      this.attendanceService.checkIn(this.membershipNumber).subscribe({
        next: (record) => {
          this.isLoading = false;
          this.loadUserAttendance();
        },
        error: (error) => {
          this.isLoading = false;
          this.notificationService.showError(error.message || 'Failed to check in');
        }
      });
    }
  }
  
  loadUserAttendance() {
    if (!this.user()) return;
    
    this.isLoading = true;
    
    // Load attendance records for this user
    this.attendanceService.getUserAttendance(this.user()!.id).subscribe({
      next: (records) => {
        this.userAttendance = records.sort(
          (a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime()
        );
        this.isLoading = false;
        
        // Load user stats
        this.loadUserStats();
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.showError('Failed to load attendance history');
      }
    });
  }
  
  loadUserStats() {
    if (!this.user()) return;
    
    this.attendanceService.getUserStats(this.user()!.id).subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        this.notificationService.showError('Failed to load attendance statistics');
      }
    });
  }
  
  calculateDuration(record: Attendance): string {
    if (!record.checkOutTime) {
      return 'Active';
    }
    
    const checkIn = new Date(record.checkInTime).getTime();
    const checkOut = new Date(record.checkOutTime).getTime();
    const durationMs = checkOut - checkIn;
    
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    
    return `${minutes}m`;
  }
}