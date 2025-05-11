import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../../core/services/auth.service';
import { AttendanceService } from '../../../core/services/attendance.service';
import { User } from '../../../core/models/user.model';
import { Attendance, UserAttendanceStats } from '../../../core/models/attendance.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
      CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  isLoading = true;
  users: User[] = [];
  userCount = 0;
  adminCount = 0;
  todayAttendanceCount = 0;
  weeklyAttendanceCount = 0;
  recentAttendance: Attendance[] = [];
  topUsers: UserAttendanceStats[] = [];
  maxCheckins = 0;
  displayedColumns: string[] = ['name', 'membership', 'checkIn', 'status'];
  
  constructor(
    private authService: AuthService,
    private attendanceService: AttendanceService
  ) {}
  
  ngOnInit() {
    this.loadDashboardData();
  }
  
  loadDashboardData() {
    this.isLoading = true;
    
    // Get all users
    this.authService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.userCount = users.length;
        this.adminCount = users.filter(u => u.role === 'admin').length;
        
        // Get attendance data
        this.loadAttendanceData();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading users:', error);
      }
    });
  }
  
  loadAttendanceData() {
    this.attendanceService.getAllAttendance().subscribe({
      next: (records) => {
        // Calculate attendance stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        oneWeekAgo.setHours(0, 0, 0, 0);
        
        this.todayAttendanceCount = records.filter(
          r => new Date(r.checkInTime).setHours(0, 0, 0, 0) === today.getTime()
        ).length;
        
        this.weeklyAttendanceCount = records.filter(
          r => new Date(r.checkInTime) >= oneWeekAgo
        ).length;
        
        // Get recent attendance (last 5)
        this.recentAttendance = records.slice(0, 5);
        
        // Get top users
        this.loadTopUsers();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading attendance:', error);
      }
    });
  }
  
  loadTopUsers() {
    this.attendanceService.getAllUserStats().subscribe({
      next: (stats) => {
        // Sort by total check-ins (descending)
        this.topUsers = stats
          .sort((a, b) => b.totalCheckins - a.totalCheckins)
          .slice(0, 5);
        
        // Find the maximum number of check-ins for the progress bar
        this.maxCheckins = this.topUsers.length > 0 ? this.topUsers[0].totalCheckins : 0;
        
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading user stats:', error);
      }
    });
  }
}