import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../core/models/product.model';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  template: `
    @if (products.length === 0) {
      <div class="text-center py-12">
        <p class="text-gray-600 text-lg">No products found in this category.</p>
      </div>
    } @else {
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        @for (product of products; track product.id) {
          <app-product-card
            [product]="product"
            (addToCart)="addToCart.emit($event)"
            (customize)="customize.emit($event)"
            (wishlistToggle)="wishlistToggle.emit($event)">
          </app-product-card>
        }
      </div>
    }
  `
})
export class ProductGridComponent {
  @Input() products: Product[] = [];

  @Output() addToCart = new EventEmitter<Product>();
  @Output() customize = new EventEmitter<Product>();
  @Output() wishlistToggle = new EventEmitter<Product>();
}
