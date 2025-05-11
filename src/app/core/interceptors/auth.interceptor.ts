import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');
  const router = inject(Router);
  const notificationService = inject(NotificationService);
  
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    
    return next(authReq).pipe(
      catchError(error => {
        if (error.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('access_token');
          localStorage.removeItem('user_data');
          notificationService.showError('Your session has expired. Please login again.');
          router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
  
  return next(req);
};

export const AuthInterceptorProvider = {
  provide: 'HTTP_INTERCEPTORS',
  useValue: authInterceptor,
  multi: true
};