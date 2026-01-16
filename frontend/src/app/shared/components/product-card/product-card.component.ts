import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../core/models/product.model';
import { WishlistService } from '../../../core/services/wishlist.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
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
          (click)="onWishlistToggle()"
          class="absolute top-2 left-2 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-all"
          [class.text-red-500]="isInWishlist"
          [class.text-gray-400]="!isInWishlist">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
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
        <button
          (click)="addToCart.emit(product)"
          class="w-full bg-luxury hover:bg-gold text-white font-semibold py-3 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
          Add to Cart
        </button>
      </div>
    </div>
  `
})
export class ProductCardComponent {
  private wishlistService = inject(WishlistService);

  @Input({ required: true }) product!: Product;
  @Output() addToCart = new EventEmitter<Product>();
  @Output() customize = new EventEmitter<Product>();
  @Output() wishlistToggle = new EventEmitter<Product>();

  get isInWishlist(): boolean {
    return this.wishlistService.isInWishlist(this.product.id);
  }

  getCategoryLabel(category: string): string {
    return category.replace(/s$/, '');
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/500x500/D4AF37/FFFFFF?text=Tea';
  }

  onWishlistToggle(): void {
    this.wishlistService.toggleItem(this.product);
    this.wishlistToggle.emit(this.product);
  }
}
