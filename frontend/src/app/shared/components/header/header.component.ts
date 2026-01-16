import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="bg-luxury text-white sticky top-0 z-50 shadow-lg">
      <div class="container mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl md:text-3xl font-bold tracking-wider">
            <a routerLink="/" class="hover:text-gold transition-colors">
              <span class="text-gold">STEEP HOUSE</span>
            </a>
          </h1>

          <div class="flex items-center gap-4">
            <!-- Desktop Menu -->
            <nav class="hidden md:flex gap-6 mr-4">
              <button (click)="filterCategory.emit('all')" class="text-white hover:text-gold transition-colors">All</button>
              <button (click)="filterCategory.emit('black')" class="text-white hover:text-gold transition-colors">Black</button>
              <button (click)="filterCategory.emit('green')" class="text-white hover:text-gold transition-colors">Green</button>
              <button (click)="filterCategory.emit('oolong')" class="text-white hover:text-gold transition-colors">Oolong</button>
              <button (click)="filterCategory.emit('herbal')" class="text-white hover:text-gold transition-colors">Herbal</button>
            </nav>

            <!-- Wishlist Button -->
            <a routerLink="/wishlist" class="relative text-white hover:text-gold transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              <span class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs font-semibold min-w-[20px] text-center">
                {{ wishlistService.getItemCount() }}
              </span>
            </a>

            <!-- Dark Mode Toggle -->
            <button
              (click)="themeService.toggleTheme()"
              class="text-white hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-luxury rounded-lg p-1"
              aria-label="Toggle dark mode">
              @if ((themeService.theme$ | async) === 'dark') {
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              } @else {
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                </svg>
              }
            </button>

            <!-- Cart Button -->
            <button
              (click)="cartService.openCart()"
              class="relative bg-gold hover:bg-dark-gold px-4 py-2 rounded-lg transition-colors font-semibold">
              <span class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
                <span class="bg-black text-white rounded-full px-2 py-0.5 text-xs">
                  {{ cartService.getItemCount() }}
                </span>
              </span>
            </button>

            <!-- Mobile Menu Button -->
            <button (click)="mobileMenuOpen = !mobileMenuOpen" class="md:hidden text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile Menu -->
    @if (mobileMenuOpen) {
      <div class="md:hidden bg-luxury text-white">
        <nav class="container mx-auto px-4 py-4 flex flex-col gap-3">
          <button (click)="onMobileFilter('all')" class="text-left hover:text-gold transition-colors py-2">All Teas</button>
          <button (click)="onMobileFilter('black')" class="text-left hover:text-gold transition-colors py-2">Black Tea</button>
          <button (click)="onMobileFilter('green')" class="text-left hover:text-gold transition-colors py-2">Green Tea</button>
          <button (click)="onMobileFilter('oolong')" class="text-left hover:text-gold transition-colors py-2">Oolong Tea</button>
          <button (click)="onMobileFilter('herbal')" class="text-left hover:text-gold transition-colors py-2">Herbal Tea</button>
        </nav>
      </div>
    }
  `
})
export class HeaderComponent {
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  themeService = inject(ThemeService);

  @Output() filterCategory = new EventEmitter<string>();

  mobileMenuOpen = false;

  onMobileFilter(category: string): void {
    this.filterCategory.emit(category);
    this.mobileMenuOpen = false;
  }
}
