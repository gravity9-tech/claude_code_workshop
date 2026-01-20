import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';
import { CartService } from './cart.service';
import { NotificationService } from './notification.service';

const WISHLIST_STORAGE_KEY = 'pandora_wishlist';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private cartService = inject(CartService);
  private notificationService = inject(NotificationService);

  private itemsSubject = new BehaviorSubject<Product[]>(this.loadWishlist());
  items$ = this.itemsSubject.asObservable();

  private loadWishlist(): Product[] {
    if (typeof localStorage === 'undefined') return [];
    const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  private saveWishlist(): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(this.itemsSubject.value));
  }

  isInWishlist(productId: number): boolean {
    return this.itemsSubject.value.some((item) => item.id === productId);
  }

  addItem(product: Product): boolean {
    if (!this.isInWishlist(product.id)) {
      const items = [...this.itemsSubject.value, product];
      this.itemsSubject.next(items);
      this.saveWishlist();
      this.notificationService.show(`${product.name} added to wishlist`);
      return true;
    }
    return false;
  }

  removeItem(productId: number): void {
    const items = this.itemsSubject.value.filter((item) => item.id !== productId);
    this.itemsSubject.next(items);
    this.saveWishlist();
  }

  toggleItem(product: Product): boolean {
    if (this.isInWishlist(product.id)) {
      this.removeItem(product.id);
      return false;
    } else {
      this.addItem(product);
      return true;
    }
  }

  moveToCart(productId: number): void {
    const product = this.itemsSubject.value.find((item) => item.id === productId);
    if (product) {
      this.cartService.addItem(product);
      this.removeItem(productId);
      this.notificationService.show(`${product.name} moved to cart`);
    }
  }

  getItemCount(): number {
    return this.itemsSubject.value.length;
  }
}
