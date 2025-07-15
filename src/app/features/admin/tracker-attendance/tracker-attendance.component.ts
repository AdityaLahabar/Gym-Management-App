import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { AttendanceService } from '../../../core/services/attendance.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

import { Attendance, UserAttendanceStats } from '../../../core/models/attendance.model';
import { User } from '../../../core/models/user.model';
@Component({
  selector: 'app-tracker-attendance',
  standalone: true,
  imports: [
     CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressBarModule
  ],
  templateUrl: './tracker-attendance.component.html',
  styleUrl: './tracker-attendance.component.css'
})
export class TrackerAttendanceComponent {
 isLoading = true;
  membershipNumber = '';
  allAttendances: Attendance[] = [];
  recentAttendance: Attendance[] = [];

  users: User[] = [];
  userCount = 0;
  adminCount = 0;

  todayAttendanceCount = 0;
  weeklyAttendanceCount = 0;

  adminColumns: string[] = ['name', 'membershipNumber', 'checkInTime', 'checkOutTime', 'status'];

  constructor(
    private authService: AuthService,
    private attendanceService: AttendanceService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;

    this.authService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.userCount = users.length;
        this.adminCount = users.filter(u => u.role === 'admin').length;

        this.loadAttendanceData();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Failed to load users:', error);
        this.notificationService.showError('Failed to load users');
      }
    });
  }

  loadAttendanceData() {
    this.attendanceService.getAllAttendance().subscribe({
      next: (records) => {
        this.allAttendances = records.sort(
          (a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime()
        );

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        oneWeekAgo.setHours(0, 0, 0, 0);

        this.todayAttendanceCount = records.filter(r =>
          new Date(r.checkInTime).setHours(0, 0, 0, 0) === today.getTime()
        ).length;

        this.weeklyAttendanceCount = records.filter(r =>
          new Date(r.checkInTime) >= oneWeekAgo
        ).length;

        this.recentAttendance = records.slice(0, 5);

        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Failed to load attendance:', error);
        this.notificationService.showError('Failed to load attendance records');
      }
    });
  }

  get isCheckedIn(): boolean {
    const active = this.allAttendances.find(
      (a) =>
        a.membershipNumber === this.membershipNumber &&
        !a.checkOutTime &&
        new Date(a.checkInTime).toDateString() === new Date().toDateString()
    );
    return !!active;
  }

  recordAttendance() {
    if (!this.membershipNumber) {
      this.notificationService.showError('Please enter a membership number');
      return;
    }

    this.isLoading = true;

    const action = this.isCheckedIn
      ? this.attendanceService.checkOut(this.membershipNumber)
      : this.attendanceService.checkIn(this.membershipNumber);

    action.subscribe({
      next: () => {
        this.notificationService.showSuccess('Attendance recorded successfully');
        this.membershipNumber = '';
        this.loadAttendanceData();
      },
      error: (err) => {
        this.isLoading = false;
        this.notificationService.showError('Error: ' + (err.message || 'Unknown'));
      }
    });
  }
}
