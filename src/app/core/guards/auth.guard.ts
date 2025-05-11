import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);
  
  if (authService.isLoggedIn()) {
    return true;
  } else {
    notificationService.showWarning('You need to login to access this page');
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
};  