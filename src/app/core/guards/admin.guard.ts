import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { UserRole } from '../models/user.model';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);
  
  if (authService.isLoggedIn() && authService.user()?.role === UserRole.ADMIN) {
    return true;
  } else {
    notificationService.showError('You must be an admin to access this area');
    router.navigate(['/']);
    return false;
  }
};