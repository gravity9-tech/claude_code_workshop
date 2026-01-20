import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductFilters } from '../models/filter.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  private allProductsSubject = new BehaviorSubject<Product[]>([]);
  allProducts$ = this.allProductsSubject.asObservable();

  getProducts(filters?: ProductFilters): Observable<Product[]> {
    let params = new HttpParams();

    if (filters?.category && filters.category !== 'all') {
      params = params.set('category', filters.category);
    }
    if (filters?.priceMax) {
      params = params.set('price_max', filters.priceMax.toString());
    }
    if (filters?.material && filters.material !== 'all') {
      params = params.set('material', filters.material);
    }

    return this.http.get<Product[]>(`${this.apiUrl}/products`, { params });
  }

  getAllProducts(): Observable<Product[]> {
    return this.http
      .get<Product[]>(`${this.apiUrl}/products`)
      .pipe(tap((products) => this.allProductsSubject.next(products)));
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/category/${category}`);
  }

  getProductFromCache(id: number): Product | undefined {
    return this.allProductsSubject.value.find((p) => p.id === id);
  }
}
