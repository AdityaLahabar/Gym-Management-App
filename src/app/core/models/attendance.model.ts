export interface Attendance {
  id: string;
  userId: string;
  userName: string;
  membershipNumber: string;
  checkInTime: string;
  checkOutTime?: string;
}

export interface AttendanceStats {
  totalCheckins: number;
  weeklyCheckins: number;
  monthlyCheckins: number;
  averageStayDuration: number;
}

export interface UserAttendanceStats extends AttendanceStats {
  userId: string;
  userName: string;
}