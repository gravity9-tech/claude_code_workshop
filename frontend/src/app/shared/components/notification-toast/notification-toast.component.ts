import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-[9999] space-y-2">
      @for (notification of notificationService.notifications$ | async; track notification.id) {
        <div
          class="px-6 py-4 rounded-lg shadow-2xl font-medium animate-fade-in min-w-[280px] text-white"
          [style.background-color]="notification.type === 'error' ? '#b91c1c' : '#16a34a'">
          {{ notification.message }}
        </div>
      }
    </div>
  `
})
export class NotificationToastComponent {
  notificationService = inject(NotificationService);
}
