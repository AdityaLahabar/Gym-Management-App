import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

import { User, UserRole, UserCredentials, RegisterUser, AuthResponse } from '../models/user.model';
import { NotificationService } from './notification.service';

// Mock users for demo purposes - in a real app these would come from a database
const MOCK_USERS = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@powerfit.com',
    password: 'admin123',
    role: UserRole.ADMIN,
    membershipNumber: 'A001',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Regular Member',
    email: 'member@powerfit.com',
    password: 'member123',
    role: UserRole.MEMBER,
    membershipNumber: 'M001',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  }
];

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_KEY = 'access_token';
  private readonly USER_KEY = 'user_data';
  
  private mockUsers = [...MOCK_USERS];
  private currentUserSignal = signal<User | null>(null);
  
  user = computed(() => this.currentUserSignal());
  
  isLoggedIn = computed(() => !!this.user());
  isAdmin = computed(() => this.user()?.role === UserRole.ROLE_ADMIN);

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private notificationService: NotificationService
  ) {}

  checkAuthState() {
    const token = localStorage.getItem(this.AUTH_KEY);
    const userData = localStorage.getItem(this.USER_KEY);
    
    if (token && userData && !this.jwtHelper.isTokenExpired(token)) {
      try {
        this.currentUserSignal.set(JSON.parse(userData));
      } catch (e) {
        this.logout();
      }
    } else if (token) {
      // Token expired
      this.logout();
    }
  }

  login(credentials: UserCredentials): Observable<AuthResponse> {
    // This is a mock implementation - in a real app, you'd call your backend API
    const user = this.mockUsers.find(u => 
      u.email === credentials.email && u.password === credentials.password);
    
    if (!user) {
      return throwError(() => new Error('Invalid email or password'));
    }
    
    // Remove password before storing/returning user
    const { password, ...userWithoutPassword } = user;
    
    // Create a mock JWT token - in a real app this would come from the server
    const token = this.createMockJwt(userWithoutPassword);
    const response: AuthResponse = {
      user: userWithoutPassword,
      token
    };
    
    // Save to storage and update state
    localStorage.setItem(this.AUTH_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(userWithoutPassword));
    this.currentUserSignal.set(userWithoutPassword);

    this.notificationService.showSuccess('Login successful!');
    
    return of(response);
  }

  register(userData: RegisterUser): Observable<AuthResponse> {
    // Check if email already exists
    if (this.mockUsers.some(u => u.email === userData.email)) {
      return throwError(() => new Error('Email already registered'));
    }
    
    // Create new user
    const newUser = {
      id: (this.mockUsers.length + 1).toString(),
      name: userData.name,
      email: userData.email,
      password: userData.password, // In a real app, this would be hashed
      role: UserRole.MEMBER, // Default role for new users
      membershipNumber: `M${(this.mockUsers.length + 1).toString().padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString() // or any valid string

    };
    
    this.mockUsers.push(newUser);
    
    // Remove password before returning
    const { password, ...userWithoutPassword } = newUser;
    
    // Create mock JWT
    const token = this.createMockJwt(userWithoutPassword);
    const response: AuthResponse = {
      user: userWithoutPassword,
      token
    };
    
    // Save to storage and update state
    localStorage.setItem(this.AUTH_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(userWithoutPassword));
    this.currentUserSignal.set(userWithoutPassword);

    this.notificationService.showSuccess('Registration successful!');
    
    return of(response);
  }

  logout(): void {
    localStorage.removeItem(this.AUTH_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
    this.notificationService.showInfo('You have been logged out');
  }

  getAllUsers(): Observable<User[]> {
    // Return all users without passwords
    return of(this.mockUsers.map(({ password, ...user }) => user));
  }

  updateUserRole(userId: string, role: UserRole): Observable<User> {
    const userIndex = this.mockUsers.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return throwError(() => new Error('User not found'));
    }
    
    // Update user role
    this.mockUsers[userIndex].role = role;
    
    // If this is the current user, update current user state
    if (this.user()?.id === userId) {
      const updatedUser = { ...this.mockUsers[userIndex] };
      delete (updatedUser as any).password;
      this.currentUserSignal.set(updatedUser);
      localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
    }
    
    const { password, ...updatedUser } = this.mockUsers[userIndex];
    
    return of(updatedUser);
  }

  deleteUser(userId: string): Observable<boolean> {
    const initialLength = this.mockUsers.length;
    this.mockUsers = this.mockUsers.filter(u => u.id !== userId);
    
    // If this is the current user, log them out
    if (this.user()?.id === userId) {
      this.logout();
    }
    
    return of(this.mockUsers.length < initialLength);
  }

  // Helper to create a mock JWT token
  private createMockJwt(user: Partial<User>): string {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };
    
    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour expiration
    };
    
    const base64Header = btoa(JSON.stringify(header));
    const base64Payload = btoa(JSON.stringify(payload));
    
    // In a real implementation, this would be signed with a secret key
    return `${base64Header}.${base64Payload}.mocksignature`;
  }
}