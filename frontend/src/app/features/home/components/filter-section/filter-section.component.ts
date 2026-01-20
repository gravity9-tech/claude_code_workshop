import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductFilters } from '../../../../core/models/filter.model';

@Component({
  selector: 'app-filter-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="mb-8">
      <div class="bg-white rounded-lg shadow-md p-6">
        <div
          class="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
        >
          <div class="flex flex-col md:flex-row gap-4 flex-1 w-full md:w-auto">
            <!-- Category Filter -->
            <div class="flex-1 min-w-[200px]">
              <label
                for="categoryFilter"
                class="block text-sm font-semibold text-gray-700 mb-2"
                >Tea Type</label
              >
              <select
                id="categoryFilter"
                [ngModel]="filters.category || 'all'"
                (ngModelChange)="onCategoryChange($event)"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent bg-white"
              >
                <option value="all">All Types</option>
                <option value="black">Black Tea</option>
                <option value="green">Green Tea</option>
                <option value="oolong">Oolong Tea</option>
                <option value="herbal">Herbal Tea</option>
              </select>
            </div>

            <!-- Price Filter -->
            <div class="flex-1 min-w-[200px]">
              <label
                for="priceFilter"
                class="block text-sm font-semibold text-gray-700 mb-2"
                >Price Range</label
              >
              <select
                id="priceFilter"
                [ngModel]="filters.priceMax || 'all'"
                (ngModelChange)="onPriceChange($event)"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent bg-white"
              >
                <option value="all">All Prices</option>
                <option value="30">Under $30</option>
                <option value="50">Under $50</option>
                <option value="75">Under $75</option>
                <option value="100">Under $100</option>
              </select>
            </div>

            <!-- Origin Filter -->
            <div class="flex-1 min-w-[200px]">
              <label
                for="materialFilter"
                class="block text-sm font-semibold text-gray-700 mb-2"
                >Origin</label
              >
              <select
                id="materialFilter"
                [ngModel]="filters.material || 'all'"
                (ngModelChange)="onMaterialChange($event)"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent bg-white"
              >
                <option value="all">All Origins</option>
                <option value="China">China</option>
                <option value="Japan">Japan</option>
                <option value="India">India</option>
                <option value="Taiwan">Taiwan</option>
              </select>
            </div>
          </div>

          <!-- Clear Filters Button -->
          <div class="flex flex-col justify-end w-full md:w-auto mt-2 md:mt-0">
            <span
              class="block text-sm font-semibold text-gray-700 mb-2 invisible hidden md:block"
              aria-hidden="true"
              >Actions</span
            >
            <button
              (click)="clearFilters.emit()"
              class="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors whitespace-nowrap"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        <!-- Results Counter -->
        <div class="mt-4 text-sm text-gray-600 font-medium">
          Showing <span class="font-bold">{{ resultCount }}</span> of
          <span class="font-bold">{{ totalCount }}</span> products
        </div>
      </div>
    </section>
  `,
})
export class FilterSectionComponent {
  @Input() filters: ProductFilters = { category: null, priceMax: null, material: null };
  @Input() resultCount = 0;
  @Input() totalCount = 0;

  @Output() filterChange = new EventEmitter<ProductFilters>();
  @Output() clearFilters = new EventEmitter<void>();

  onCategoryChange(value: string): void {
    this.filterChange.emit({
      ...this.filters,
      category: value === 'all' ? null : value,
    });
  }

  onPriceChange(value: string): void {
    this.filterChange.emit({
      ...this.filters,
      priceMax: value === 'all' ? null : parseInt(value, 10),
    });
  }

  onMaterialChange(value: string): void {
    this.filterChange.emit({
      ...this.filters,
      material: value === 'all' ? null : value,
    });
  }
}
