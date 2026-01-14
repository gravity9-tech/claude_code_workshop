import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';
import { NotificationService } from './notification.service';

const CART_STORAGE_KEY = 'pandora_cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private notificationService = inject(NotificationService);

  private itemsSubject = new BehaviorSubject<CartItem[]>(this.loadCart());
  items$ = this.itemsSubject.asObservable();

  private isOpenSubject = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpenSubject.asObservable();

  private loadCart(): CartItem[] {
    if (typeof localStorage === 'undefined') return [];
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  private saveCart(): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.itemsSubject.value));
  }

  addItem(product: Product | CartItem): void {
    const items = [...this.itemsSubject.value];

    // For customized items, treat each as unique
    if ('isCustomized' in product && product.isCustomized) {
      items.push({
        ...product,
        quantity: 1
      } as CartItem);
    } else {
      const existingItem = items.find(item => item.id === product.id && !item.isCustomized);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        items.push({
          ...product,
          quantity: 1
        } as CartItem);
      }
    }

    this.itemsSubject.next(items);
    this.saveCart();
    this.notificationService.show(`${product.name} added to cart`);
  }

  removeItem(productId: number | string): void {
    const items = this.itemsSubject.value.filter(item => item.id !== productId);
    this.itemsSubject.next(items);
    this.saveCart();
  }

  updateQuantity(productId: number | string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    const items = this.itemsSubject.value.map(item => {
      if (item.id === productId) {
        return { ...item, quantity };
      }
      return item;
    });

    this.itemsSubject.next(items);
    this.saveCart();
  }

  getTotal(): number {
    return this.itemsSubject.value.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  getItemCount(): number {
    return this.itemsSubject.value.reduce(
      (count, item) => count + item.quantity,
      0
    );
  }

  openCart(): void {
    this.isOpenSubject.next(true);
  }

  closeCart(): void {
    this.isOpenSubject.next(false);
  }

  toggleCart(): void {
    this.isOpenSubject.next(!this.isOpenSubject.value);
  }

  clearCart(): void {
    this.itemsSubject.next([]);
    this.saveCart();
  }
}
