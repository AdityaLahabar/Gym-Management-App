import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
    {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(c => c.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(c => c.RegisterComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/profile/profile.component').then(c => c.ProfileComponent)
  },
  {
    path: 'attendance',
    canActivate: [authGuard],
    loadComponent: () => import('./features/attendance/attendance.component').then(c => c.AttendanceComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(c => c.DashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/admin/users/users.component').then(c => c.UsersComponent)
      },
      {
        path: 'attendance',
        loadComponent: () => import('./features/admin/attendance-logs/attendance-logs.component').then(c => c.AttendanceLogsComponent)
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then(c => c.NotFoundComponent)
  }
];
