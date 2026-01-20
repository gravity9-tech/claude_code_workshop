import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  private counter = 0;

  show(message: string, type: 'success' | 'error' | 'info' = 'success'): void {
    const id = ++this.counter;
    const notification: Notification = { id, message, type };

    const notifications = [...this.notificationsSubject.value, notification];
    this.notificationsSubject.next(notifications);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      this.remove(id);
    }, 3000);
  }

  remove(id: number): void {
    const notifications = this.notificationsSubject.value.filter((n) => n.id !== id);
    this.notificationsSubject.next(notifications);
  }

  clear(): void {
    this.notificationsSubject.next([]);
  }
}
