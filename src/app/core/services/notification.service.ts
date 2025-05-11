import { Injectable, signal } from '@angular/core';

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning'
}

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
  duration: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private nextId = 0;
  notifications = signal<Notification[]>([]);
  
  showNotification(message: string, type: NotificationType, duration = 3000): void {
    const id = this.nextId++;
    
    // Add notification to array
    this.notifications.update(notifications => [
      ...notifications,
      { id, message, type, duration }
    ]);
    
    // Remove notification after duration
    setTimeout(() => {
      this.removeNotification(id);
    }, duration);
  }
  
  removeNotification(id: number): void {
    this.notifications.update(notifications => 
      notifications.filter(notification => notification.id !== id)
    );
  }
  
  showSuccess(message: string): void {
    this.showNotification(message, NotificationType.SUCCESS);
  }
  
  showError(message: string): void {
    this.showNotification(message, NotificationType.ERROR, 5000);
  }
  
  showInfo(message: string): void {
    this.showNotification(message, NotificationType.INFO);
  }
  
  showWarning(message: string): void {
    this.showNotification(message, NotificationType.WARNING, 4000);
  }
}