import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AttendanceService } from '../../../core/services/attendance.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Attendance } from '../../../core/models/attendance.model';

@Component({
  selector: 'app-attendance-logs',
  standalone: true,
  imports: [
      CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './attendance-logs.component.html',
  styleUrl: './attendance-logs.component.css'
})
export class AttendanceLogsComponent implements OnInit {
  allAttendanceLogs: Attendance[] = [];
  filteredAttendanceLogs: Attendance[] = [];
  paginatedAttendanceLogs: Attendance[] = [];
  isLoading = true;
  
  // Filters
  searchTerm = '';
  fromDate: Date | null = null;
  toDate: Date | null = null;
  
  // Pagination
  pageSize = 10;
  pageIndex = 0;
  
  // Table columns
  displayedColumns: string[] = ['name', 'membershipNumber', 'checkIn', 'checkOut', 'duration'];
  
  constructor(
    private attendanceService: AttendanceService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}
  
  ngOnInit() {
    this.loadAttendanceLogs();
  }
  
  loadAttendanceLogs() {
    this.isLoading = true;
    
    this.attendanceService.getAllAttendance().subscribe({
      next: (logs) => {
        this.allAttendanceLogs = logs;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.showError('Failed to load attendance logs');
        console.error('Error loading attendance logs:', error);
      }
    });
  }
  
  applyFilter() {
    let filteredLogs = [...this.allAttendanceLogs];
    
    // Apply search filter
    if (this.searchTerm) {
      const searchTermLower = this.searchTerm.toLowerCase();
      filteredLogs = filteredLogs.filter(log => 
        log.userName.toLowerCase().includes(searchTermLower) ||
        log.membershipNumber.toLowerCase().includes(searchTermLower)
      );
    }
    
    // Apply date filters
    if (this.fromDate) {
      // Set time to beginning of day
      const fromDateTime = new Date(this.fromDate);
      fromDateTime.setHours(0, 0, 0, 0);
      
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.checkInTime) >= fromDateTime
      );
    }
    
    if (this.toDate) {
      // Set time to end of day
      const toDateTime = new Date(this.toDate);
      toDateTime.setHours(23, 59, 59, 999);
      
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.checkInTime) <= toDateTime
      );
    }
    
    this.filteredAttendanceLogs = filteredLogs;
    this.updatePaginatedLogs();
  }
  
  updatePaginatedLogs() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedAttendanceLogs = this.filteredAttendanceLogs.slice(startIndex, endIndex);
  }
  
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedLogs();
  }
  
  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      return;
    }
    
    this.filteredAttendanceLogs = this.filteredAttendanceLogs.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return this.compare(a.userName, b.userName, isAsc);
        case 'checkIn': return this.compare(new Date(a.checkInTime), new Date(b.checkInTime), isAsc);
        case 'checkOut': 
          if (!a.checkOutTime) return isAsc ? 1 : -1;
          if (!b.checkOutTime) return isAsc ? -1 : 1;
          return this.compare(new Date(a.checkOutTime), new Date(b.checkOutTime), isAsc);
        default: return 0;
      }
    });
    
    this.updatePaginatedLogs();
  }
  
  compare(a: any, b: any, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  
  resetFilters() {
    this.searchTerm = '';
    this.fromDate = null;
    this.toDate = null;
    this.applyFilter();
  }
  
  calculateDuration(log: Attendance): string {
    if (!log.checkOutTime) {
      return 'Active';
    }
    
    const checkIn = new Date(log.checkInTime).getTime();
    const checkOut = new Date(log.checkOutTime).getTime();
    const durationMs = checkOut - checkIn;
    
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    
    return `${minutes}m`;
  }
}