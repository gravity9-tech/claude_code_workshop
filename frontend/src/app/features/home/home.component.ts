import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';
import { ProductFilters } from '../../core/models/filter.model';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { FilterSectionComponent } from './components/filter-section/filter-section.component';
import { ProductGridComponent } from './components/product-grid/product-grid.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { CustomizationModalComponent } from '../customization/customization-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroSectionComponent,
    FilterSectionComponent,
    ProductGridComponent,
    LoadingSpinnerComponent,
    CustomizationModalComponent
  ],
  template: `
    <main class="container mx-auto px-4 py-8">
      <app-hero-section></app-hero-section>

      <app-filter-section
        [filters]="filters"
        [resultCount]="filteredProducts.length"
        [totalCount]="allProducts.length"
        (filterChange)="onFilterChange($event)"
        (clearFilters)="onClearFilters()">
      </app-filter-section>

      @if (loading) {
        <app-loading-spinner></app-loading-spinner>
      } @else {
        <app-product-grid
          [products]="filteredProducts"
          (addToCart)="onAddToCart($event)"
          (customize)="onCustomize($event)">
        </app-product-grid>
      }
    </main>

    <app-customization-modal
      [product]="selectedProduct"
      [isOpen]="customizationOpen"
      (close)="closeCustomization()"
      (addToCart)="onCustomizedAddToCart($event)">
    </app-customization-modal>
  `
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  loading = true;

  filters: ProductFilters = {
    category: null,
    priceMax: null,
    material: null
  };

  selectedProduct: Product | null = null;
  customizationOpen = false;

  ngOnInit(): void {
    this.loadFiltersFromUrl();
    this.loadProducts();
  }

  private loadFiltersFromUrl(): void {
    const params = this.route.snapshot.queryParams;
    if (params['category']) {
      this.filters.category = params['category'];
    }
    if (params['price']) {
      this.filters.priceMax = parseInt(params['price'], 10);
    }
    if (params['material']) {
      this.filters.material = params['material'];
    }
  }

  private updateUrl(): void {
    const queryParams: Record<string, string> = {};
    if (this.filters.category) queryParams['category'] = this.filters.category;
    if (this.filters.priceMax) queryParams['price'] = this.filters.priceMax.toString();
    if (this.filters.material) queryParams['material'] = this.filters.material;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  private loadProducts(): void {
    this.loading = true;

    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.allProducts = products;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  private applyFilters(): void {
    this.productService.getProducts(this.filters).subscribe({
      next: (products) => {
        this.filteredProducts = products;
      },
      error: (error) => {
        console.error('Error filtering products:', error);
      }
    });
  }

  onFilterChange(filters: ProductFilters): void {
    this.filters = filters;
    this.updateUrl();
    this.applyFilters();
  }

  onClearFilters(): void {
    this.filters = { category: null, priceMax: null, material: null };
    this.router.navigate([], { relativeTo: this.route, queryParams: {} });
    this.applyFilters();
  }

  filterByCategory(category: string): void {
    this.filters = {
      ...this.filters,
      category: category === 'all' ? null : category
    };
    this.updateUrl();
    this.applyFilters();
  }

  onAddToCart(product: Product): void {
    this.cartService.addItem(product);
  }

  onCustomize(product: Product): void {
    if (product.customizable) {
      this.selectedProduct = product;
      this.customizationOpen = true;
    }
  }

  closeCustomization(): void {
    this.customizationOpen = false;
    this.selectedProduct = null;
  }

  onCustomizedAddToCart(item: any): void {
    this.cartService.addItem(item);
    this.closeCustomization();
  }
}
