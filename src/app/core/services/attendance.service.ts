import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Attendance, AttendanceStats, UserAttendanceStats } from '../models/attendance.model';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private attendanceRecords: Attendance[] = [
    {
      id: '1',
      userId: '1',
      userName: 'Admin User',
      membershipNumber: 'A001',
      checkInTime: new Date(Date.now() - 86400000).toISOString(),
      checkOutTime: new Date(Date.now() - 86400000 + 3600000).toISOString()
    },
    {
      id: '2',
      userId: '2',
      userName: 'Regular Member',
      membershipNumber: 'M001',
      checkInTime: new Date(Date.now() - 43200000).toISOString(),
      checkOutTime: new Date(Date.now() - 43200000 + 5400000).toISOString()
    },
    {
      id: '3',
      userId: '3',
      userName: 'Aditya',
      membershipNumber: 'A002',
      checkInTime: new Date(Date.now() - 86400000).toISOString(),
      checkOutTime: new Date(Date.now() - 86400000 + 3600000).toISOString()
    },
    {
      id: '4',
      userId: '4',
      userName: 'Veer',
      membershipNumber: 'M002',
      checkInTime: new Date(Date.now() - 43200000).toISOString(),
      checkOutTime: new Date(Date.now() - 43200000 + 5400000).toISOString()
    }
  ];

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  // Record attendance for a user (check in)
  checkIn(membershipNumber: string): Observable<Attendance> {
    // Get all users from auth service
    return this.authService.getAllUsers().pipe(
      map(users => {
        const user = users.find(u => u.membershipNumber === membershipNumber);
        
        if (!user) {
          this.notificationService.showError('Invalid membership number');
          throw new Error('Invalid membership number');
        }
        
        // Check if user is already checked in
        const existingCheckIn = this.attendanceRecords.find(
          a => a.userId === user.id && !a.checkOutTime && 
          new Date(a.checkInTime).setHours(0,0,0,0) === new Date().setHours(0,0,0,0)
        );
        
        if (existingCheckIn) {
          this.notificationService.showWarning('User is already checked in');
          throw new Error('User is already checked in');
        }
        
        // Create new attendance record
        const newAttendance: Attendance = {
          id: (this.attendanceRecords.length + 1).toString(),
          userId: user.id,
          userName: user.name,
          membershipNumber: user.membershipNumber!,
          checkInTime: new Date().toISOString()
        };
        
        this.attendanceRecords.push(newAttendance);
        this.notificationService.showSuccess('Check-in successful');
        
        return newAttendance;
      })
    );
  }
  
  // Check out a user
  checkOut(membershipNumber: string): Observable<Attendance> {
    return this.authService.getAllUsers().pipe(
      map(users => {
        const user = users.find(u => u.membershipNumber === membershipNumber);
        
        if (!user) {
          this.notificationService.showError('Invalid membership number');
          throw new Error('Invalid membership number');
        }
        
        // Find the most recent check-in without checkout
        const attendanceIndex = this.attendanceRecords.findIndex(
          a => a.userId === user.id && !a.checkOutTime
        );
        
        if (attendanceIndex === -1) {
          this.notificationService.showWarning('No active check-in found');
          throw new Error('No active check-in found');
        }
        
        // Update attendance record
        this.attendanceRecords[attendanceIndex].checkOutTime = new Date().toISOString();
        this.notificationService.showSuccess('Check-out successful');
        
        return this.attendanceRecords[attendanceIndex];
      })
    );
  }
  
  // Get user's attendance records
  getUserAttendance(userId: string): Observable<Attendance[]> {
    const records = this.attendanceRecords.filter(a => a.userId === userId);
    return of(records);
  }
  
  // Get all attendance records (for admin)
  getAllAttendance(): Observable<Attendance[]> {
    return of([...this.attendanceRecords].sort(
      (a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime()
    ));
  }
  
  // Get attendance statistics for a specific user
  getUserStats(userId: string): Observable<AttendanceStats> {
    const userRecords = this.attendanceRecords.filter(a => a.userId === userId);
    
    if (!userRecords.length) {
      return of({
        totalCheckins: 0,
        weeklyCheckins: 0,
        monthlyCheckins: 0,
        averageStayDuration: 0
      });
    }
    
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const weeklyCheckins = userRecords.filter(
      a => new Date(a.checkInTime) >= oneWeekAgo
    ).length;
    
    const monthlyCheckins = userRecords.filter(
      a => new Date(a.checkInTime) >= oneMonthAgo
    ).length;
    
    // Calculate average stay duration for completed check-ins
    const completedRecords = userRecords.filter(a => a.checkOutTime);
    const totalDuration = completedRecords.reduce((total, record) => {
      const duration = new Date(record.checkOutTime!).getTime() - new Date(record.checkInTime).getTime();
      return total + duration;
    }, 0);
    
    const averageMinutes = completedRecords.length 
      ? Math.round(totalDuration / completedRecords.length / 60000)
      : 0;
    
    return of({
      totalCheckins: userRecords.length,
      weeklyCheckins,
      monthlyCheckins,
      averageStayDuration: averageMinutes
    });
  }
  
  // Get attendance stats for all users (admin)
  getAllUserStats(): Observable<UserAttendanceStats[]> {
    return this.authService.getAllUsers().pipe(
      map(users => {
        return users.map(user => {
          const userRecords = this.attendanceRecords.filter(a => a.userId === user.id);
          
          const now = new Date();
          const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          
          const weeklyCheckins = userRecords.filter(
            a => new Date(a.checkInTime) >= oneWeekAgo
          ).length;
          
          const monthlyCheckins = userRecords.filter(
            a => new Date(a.checkInTime) >= oneMonthAgo
          ).length;
          
          // Calculate average stay duration
          const completedRecords = userRecords.filter(a => a.checkOutTime);
          const totalDuration = completedRecords.reduce((total, record) => {
            const duration = new Date(record.checkOutTime!).getTime() - new Date(record.checkInTime).getTime();
            return total + duration;
          }, 0);
          
          const averageMinutes = completedRecords.length 
            ? Math.round(totalDuration / completedRecords.length / 60000)
            : 0;
          
          return {
            userId: user.id,
            userName: user.name,
            totalCheckins: userRecords.length,
            weeklyCheckins,
            monthlyCheckins,
            averageStayDuration: averageMinutes
          };
        });
      })
    );
  }
}