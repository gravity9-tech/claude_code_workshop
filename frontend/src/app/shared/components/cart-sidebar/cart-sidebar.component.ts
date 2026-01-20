import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';
import { CartItem } from '../../../core/models/cart-item.model';

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Cart Overlay -->
    @if (cartService.isOpen$ | async) {
      <div
        class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        (click)="cartService.closeCart()"
        (keydown.enter)="cartService.closeCart()"
        (keydown.escape)="cartService.closeCart()"
        tabindex="0"
        role="button"
        aria-label="Close cart"
      ></div>
    }

    <!-- Cart Sidebar -->
    <div
      class="fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl transform transition-transform duration-300 z-50"
      [class.translate-x-full]="(cartService.isOpen$ | async) === false"
      [class.translate-x-0]="cartService.isOpen$ | async"
    >
      <div class="h-full flex flex-col">
        <!-- Cart Header -->
        <div class="bg-luxury text-white p-6 flex justify-between items-center">
          <h3 class="text-xl font-bold">Shopping Cart</h3>
          <button (click)="cartService.closeCart()" class="text-white hover:text-gold">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <!-- Cart Items -->
        <div class="flex-1 overflow-y-auto p-6 cart-scrollbar">
          @if ((cartService.items$ | async)?.length === 0) {
            <p class="text-gray-500 text-center">Your cart is empty</p>
          } @else {
            @for (item of cartService.items$ | async; track item.id) {
              <div class="cart-item bg-white rounded-lg shadow p-4 mb-4">
                @if (item.isCustomized) {
                  <div
                    class="inline-block bg-gold text-white text-xs px-2 py-1 rounded mb-2"
                  >
                    Customized
                  </div>
                }
                <div class="flex gap-4">
                  <img
                    [src]="item.image"
                    [alt]="item.name"
                    class="w-20 h-20 object-cover rounded"
                  />
                  <div class="flex-1">
                    <h4 class="font-semibold text-sm mb-1">{{ item.name }}</h4>
                    @if (item.isCustomized && item.customizationSummary) {
                      <div class="text-xs text-gray-600 mb-1">
                        {{ formatCustomizationSummary(item) }}
                      </div>
                    }
                    <p class="text-gold font-bold mb-2">
                      \${{ item.price.toFixed(2) }}
                    </p>
                    <div class="flex items-center gap-2">
                      @if (!item.isCustomized) {
                        <button
                          (click)="
                            cartService.updateQuantity(item.id, item.quantity - 1)
                          "
                          class="bg-gray-200 hover:bg-gray-300 w-7 h-7 rounded flex items-center justify-center"
                        >
                          <span class="text-lg font-bold">-</span>
                        </button>
                        <span class="w-8 text-center font-semibold">{{
                          item.quantity
                        }}</span>
                        <button
                          (click)="
                            cartService.updateQuantity(item.id, item.quantity + 1)
                          "
                          class="bg-gray-200 hover:bg-gray-300 w-7 h-7 rounded flex items-center justify-center"
                        >
                          <span class="text-lg font-bold">+</span>
                        </button>
                      } @else {
                        <span class="text-sm text-gray-600"
                          >Qty: {{ item.quantity }}</span
                        >
                      }
                      <button
                        (click)="cartService.removeItem(item.id)"
                        class="ml-auto text-red-500 hover:text-red-700"
                      >
                        <svg
                          class="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            }
          }
        </div>

        <!-- Cart Footer -->
        <div class="border-t p-6 bg-gray-50">
          <div class="flex justify-between items-center mb-4">
            <span class="text-lg font-semibold">Total:</span>
            <span class="text-2xl font-bold text-gold"
              >\${{ cartService.getTotal().toFixed(2) }}</span
            >
          </div>
          <button
            class="w-full bg-gold hover:bg-dark-gold text-white font-bold py-3 rounded-lg transition-colors"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  `,
})
export class CartSidebarComponent {
  cartService = inject(CartService);

  formatCustomizationSummary(item: CartItem): string {
    if (!item.customizationSummary) return '';
    return item.customizationSummary.map((c) => `${c.label}: ${c.value}`).join(' • ');
  }
}
