import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { NotificationService, Notification, NotificationType } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  NotificationType = NotificationType;
  
  constructor(public notificationService: NotificationService) {}
  
  notifications = computed(() => this.notificationService.notifications());
  
  getNotificationClass(notification: Notification): string {
    switch (notification.type) {
      case NotificationType.SUCCESS:
        return 'notification-success';
      case NotificationType.ERROR:
        return 'notification-error';
      case NotificationType.WARNING:
        return 'notification-warning';
      case NotificationType.INFO:
        return 'notification-info';
      default:
        return '';
    }
  }
}
