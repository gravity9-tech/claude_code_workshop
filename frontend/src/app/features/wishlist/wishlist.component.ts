import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <main class="container mx-auto px-4 py-8">
      <!-- Page Title -->
      <section class="mb-8">
        <div class="flex items-center gap-3 mb-4">
          <svg class="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <h2 class="text-3xl md:text-4xl font-bold text-luxury">My Wishlist</h2>
        </div>
        <p class="text-gray-600">Your favorite premium teas, saved for later</p>
      </section>

      @if ((wishlistService.items$ | async)?.length === 0) {
        <!-- Empty State -->
        <div class="text-center py-16">
          <svg class="w-24 h-24 mx-auto text-gray-300 mb-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <h3 class="text-2xl font-bold text-gray-700 mb-3">Your wishlist is empty</h3>
          <p class="text-gray-600 mb-6">Start adding items you love to your wishlist!</p>
          <a routerLink="/" class="inline-block bg-gold hover:bg-dark-gold text-white font-semibold px-8 py-3 rounded-lg transition-colors">
            Browse Teas
          </a>
        </div>
      } @else {
        <!-- Wishlist Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          @for (product of wishlistService.items$ | async; track product.id) {
            <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div class="relative overflow-hidden group">
                <img
                  [src]="product.image"
                  [alt]="product.name"
                  class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  (error)="onImageError($event)">
                <div class="absolute top-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded uppercase">
                  {{ getCategoryLabel(product.category) }}
                </div>
                <button
                  (click)="removeFromWishlist(product.id)"
                  class="absolute top-2 left-2 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors">
                  <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <div class="p-5">
                <div class="mb-3">
                  <h3 class="font-bold text-lg text-luxury mb-1 line-clamp-2">{{ product.name }}</h3>
                  <p class="text-gray-600 text-sm line-clamp-2">{{ product.description }}</p>
                </div>
                <div class="flex items-center justify-between mb-4">
                  <span class="text-2xl font-bold text-gold">\${{ product.price.toFixed(2) }}</span>
                  <span class="text-xs text-gray-500 uppercase tracking-wider">{{ product.material }}</span>
                </div>
                <div class="flex gap-2">
                  <button
                    (click)="moveToCart(product.id)"
                    class="flex-1 bg-gold hover:bg-dark-gold text-white font-semibold py-3 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                    </svg>
                    Move to Cart
                  </button>
                  <button
                    (click)="removeFromWishlist(product.id)"
                    class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-3 rounded-lg transition-colors duration-300">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </main>
  `
})
export class WishlistComponent {
  wishlistService = inject(WishlistService);
  private cartService = inject(CartService);

  getCategoryLabel(category: string): string {
    return category.replace(/s$/, '');
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/500x500/D4AF37/FFFFFF?text=Tea';
  }

  removeFromWishlist(productId: number): void {
    this.wishlistService.removeItem(productId);
  }

  moveToCart(productId: number): void {
    this.wishlistService.moveToCart(productId);
  }
}
