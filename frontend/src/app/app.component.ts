import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { CartSidebarComponent } from './shared/components/cart-sidebar/cart-sidebar.component';
import { NotificationToastComponent } from './shared/components/notification-toast/notification-toast.component';
import { ProductService } from './core/services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    CartSidebarComponent,
    NotificationToastComponent
  ],
  template: `
    <div class="min-h-screen flex flex-col bg-gray-50 font-sans">
      <app-header (filterCategory)="onFilterCategory($event)"></app-header>

      <div class="flex-1">
        <router-outlet></router-outlet>
      </div>

      <app-footer></app-footer>
    </div>

    <app-cart-sidebar></app-cart-sidebar>
    <app-notification-toast></app-notification-toast>
  `
})
export class AppComponent implements OnInit {
  private productService = inject(ProductService);
  private router = inject(Router);

  ngOnInit(): void {
    // Preload all products for cache
    this.productService.getAllProducts().subscribe();
  }

  onFilterCategory(category: string): void {
    const queryParams = category === 'all' ? {} : { category };
    this.router.navigate(['/'], { queryParams });
  }
}
