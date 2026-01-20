import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../core/models/product.model';
import {
  CustomizationConfig,
  CustomizationSelection,
  CustomizationOptionValue,
  PriceBreakdown,
  CustomizationSummaryItem,
} from '../../core/models/customization.model';
import { CustomizationService } from '../../core/services/customization.service';
import { CartItem } from '../../core/models/cart-item.model';

@Component({
  selector: 'app-customization-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen && product) {
      <!-- Overlay -->
      <div
        class="customization-overlay"
        (click)="onClose()"
        (keydown.enter)="onClose()"
        (keydown.escape)="onClose()"
        tabindex="0"
        role="button"
        aria-label="Close modal"
      ></div>

      <!-- Modal -->
      <div class="customization-modal">
        <div class="customization-modal-content">
          <!-- Header -->
          <div class="customization-header">
            <h2>Customize Your Tea</h2>
            <button class="close-customization" (click)="onClose()" aria-label="Close">
              &times;
            </button>
          </div>

          <!-- Progress Stepper -->
          <div class="stepper-container">
            <div class="stepper-horizontal">
              @for (step of steps; track step.number; let i = $index) {
                <div
                  class="stepper-step"
                  [class.active]="currentStep === step.number"
                  [class.completed]="currentStep > step.number"
                >
                  <div class="step-circle">
                    @if (currentStep > step.number) {
                      ✓
                    } @else {
                      {{ step.number }}
                    }
                  </div>
                  <div class="step-label">{{ step.label }}</div>
                  @if (i < steps.length - 1) {
                    <div class="step-connector"></div>
                  }
                </div>
              }
            </div>
          </div>

          <!-- Modal Body -->
          <div class="customization-body overflow-y-auto flex-1 p-8">
            <!-- Error Messages -->
            @if (errors.length > 0) {
              <div class="error-summary">
                <h4>Please correct the following:</h4>
                <ul>
                  @for (error of errors; track error) {
                    <li>{{ error }}</li>
                  }
                </ul>
              </div>
            }

            <!-- Step 1: Package Size -->
            @if (currentStep === 1 && config) {
              <div class="slide-in">
                <h3 class="text-2xl font-bold text-gray-800 mb-2">
                  Select Package Size
                </h3>
                <p class="text-gray-600 mb-6">Choose your preferred quantity</p>
                <div
                  class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                  role="radiogroup"
                  aria-label="Package size options"
                >
                  @for (value of getOptionValues('package_size'); track value.value) {
                    <div
                      class="option-card"
                      [class.selected]="
                        customizations['package_size'].value === value.value
                      "
                      (click)="
                        selectOption('package_size', value.value, value.price_modifier)
                      "
                      (keydown.enter)="
                        selectOption('package_size', value.value, value.price_modifier)
                      "
                      (keydown.space)="
                        selectOption('package_size', value.value, value.price_modifier);
                        $event.preventDefault()
                      "
                      tabindex="0"
                      role="radio"
                      [attr.aria-checked]="
                        customizations['package_size'].value === value.value
                      "
                    >
                      <div class="option-card-header">
                        <span class="option-name">{{ value.display_name }}</span>
                        <span
                          class="option-price"
                          [class.free]="value.price_modifier === 0"
                        >
                          {{
                            customizationService.formatPriceModifier(
                              value.price_modifier
                            )
                          }}
                        </span>
                      </div>
                      @if (value.description) {
                        <p class="option-description">{{ value.description }}</p>
                      }
                      <div class="selected-indicator">✓</div>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Step 2: Details (varies by category) -->
            @if (currentStep === 2 && config) {
              <div class="slide-in">
                @if (product.category === 'black') {
                  <h3 class="text-2xl font-bold text-gray-800 mb-2">
                    Brew Preferences
                  </h3>
                  <p class="text-gray-600 mb-6">Select your strength and add-ons</p>

                  <!-- Brew Strength -->
                  <div class="form-group">
                    <label class="form-label" for="brew-strength-select"
                      >Brew Strength *</label
                    >
                    <select
                      id="brew-strength-select"
                      class="form-select"
                      [ngModel]="customizations['brew_strength'].value || ''"
                      (ngModelChange)="selectOption('brew_strength', $event, 0)"
                    >
                      <option value="">Select strength...</option>
                      @for (
                        value of getOptionValues('brew_strength');
                        track value.value
                      ) {
                        <option [value]="value.value">{{ value.display_name }}</option>
                      }
                    </select>
                  </div>

                  <!-- Add-ons -->
                  <div class="form-group">
                    <span class="form-label" id="add-ons-label">Add-ons</span>
                    <div
                      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4"
                      role="radiogroup"
                      aria-labelledby="add-ons-label"
                    >
                      @for (value of getOptionValues('add_ons'); track value.value) {
                        <div
                          class="option-card"
                          [class.selected]="
                            customizations['add_ons'].value === value.value
                          "
                          (click)="
                            selectOption('add_ons', value.value, value.price_modifier)
                          "
                          (keydown.enter)="
                            selectOption('add_ons', value.value, value.price_modifier)
                          "
                          (keydown.space)="
                            selectOption('add_ons', value.value, value.price_modifier);
                            $event.preventDefault()
                          "
                          tabindex="0"
                          role="radio"
                          [attr.aria-checked]="
                            customizations['add_ons'].value === value.value
                          "
                        >
                          <div class="option-card-header">
                            <span class="option-name">{{ value.display_name }}</span>
                            <span
                              class="option-price"
                              [class.free]="value.price_modifier === 0"
                            >
                              {{
                                customizationService.formatPriceModifier(
                                  value.price_modifier
                                )
                              }}
                            </span>
                          </div>
                          @if (value.description) {
                            <p class="option-description">{{ value.description }}</p>
                          }
                          <div class="selected-indicator">✓</div>
                        </div>
                      }
                    </div>
                  </div>
                }

                @if (product.category === 'green') {
                  <h3 class="text-2xl font-bold text-gray-800 mb-2">
                    Leaf Style & Accessories
                  </h3>
                  <p class="text-gray-600 mb-6">Customize your green tea experience</p>

                  <div class="form-group">
                    <label class="form-label" for="leaf-style-select"
                      >Leaf Style *</label
                    >
                    <select
                      id="leaf-style-select"
                      class="form-select"
                      [ngModel]="customizations['leaf_style'].value || ''"
                      (ngModelChange)="selectLeafStyle($event)"
                    >
                      <option value="">Select style...</option>
                      @for (value of getOptionValues('leaf_style'); track value.value) {
                        <option [value]="value.value">
                          {{ value.display_name }}
                          {{
                            value.price_modifier > 0
                              ? '(+$' + value.price_modifier + ')'
                              : ''
                          }}
                        </option>
                      }
                    </select>
                  </div>

                  <div class="form-group">
                    <span class="form-label" id="accessories-label">Accessories</span>
                    <div
                      class="grid grid-cols-1 md:grid-cols-2 gap-4"
                      role="radiogroup"
                      aria-labelledby="accessories-label"
                    >
                      @for (
                        value of getOptionValues('accessories');
                        track value.value
                      ) {
                        <div
                          class="option-card"
                          [class.selected]="
                            customizations['accessories'].value === value.value
                          "
                          (click)="
                            selectOption(
                              'accessories',
                              value.value,
                              value.price_modifier
                            )
                          "
                          (keydown.enter)="
                            selectOption(
                              'accessories',
                              value.value,
                              value.price_modifier
                            )
                          "
                          (keydown.space)="
                            selectOption(
                              'accessories',
                              value.value,
                              value.price_modifier
                            );
                            $event.preventDefault()
                          "
                          tabindex="0"
                          role="radio"
                          [attr.aria-checked]="
                            customizations['accessories'].value === value.value
                          "
                        >
                          <div class="option-card-header">
                            <span class="option-name">{{ value.display_name }}</span>
                            <span
                              class="option-price"
                              [class.free]="value.price_modifier === 0"
                            >
                              {{
                                customizationService.formatPriceModifier(
                                  value.price_modifier
                                )
                              }}
                            </span>
                          </div>
                          <div class="selected-indicator">✓</div>
                        </div>
                      }
                    </div>
                  </div>
                }

                @if (product.category === 'oolong') {
                  <h3 class="text-2xl font-bold text-gray-800 mb-2">
                    Roast Level & Brewing
                  </h3>
                  <p class="text-gray-600 mb-6">
                    Select roast and optional brewing vessel
                  </p>

                  <div class="form-group">
                    <label class="form-label" for="roast-level-select"
                      >Roast Level *</label
                    >
                    <select
                      id="roast-level-select"
                      class="form-select"
                      [ngModel]="customizations['roast_level'].value || ''"
                      (ngModelChange)="selectOption('roast_level', $event, 0)"
                    >
                      <option value="">Select roast...</option>
                      @for (
                        value of getOptionValues('roast_level');
                        track value.value
                      ) {
                        <option [value]="value.value">{{ value.display_name }}</option>
                      }
                    </select>
                  </div>

                  <div class="form-group">
                    <span class="form-label" id="brewing-vessel-label"
                      >Brewing Vessel</span
                    >
                    <div
                      class="grid grid-cols-1 md:grid-cols-3 gap-4"
                      role="radiogroup"
                      aria-labelledby="brewing-vessel-label"
                    >
                      @for (
                        value of getOptionValues('brewing_vessel');
                        track value.value
                      ) {
                        <div
                          class="option-card"
                          [class.selected]="
                            customizations['brewing_vessel'].value === value.value
                          "
                          (click)="
                            selectOption(
                              'brewing_vessel',
                              value.value,
                              value.price_modifier
                            )
                          "
                          (keydown.enter)="
                            selectOption(
                              'brewing_vessel',
                              value.value,
                              value.price_modifier
                            )
                          "
                          (keydown.space)="
                            selectOption(
                              'brewing_vessel',
                              value.value,
                              value.price_modifier
                            );
                            $event.preventDefault()
                          "
                          tabindex="0"
                          role="radio"
                          [attr.aria-checked]="
                            customizations['brewing_vessel'].value === value.value
                          "
                        >
                          <div class="option-card-header">
                            <span class="option-name">{{ value.display_name }}</span>
                            <span
                              class="option-price"
                              [class.free]="value.price_modifier === 0"
                            >
                              {{
                                customizationService.formatPriceModifier(
                                  value.price_modifier
                                )
                              }}
                            </span>
                          </div>
                          @if (value.description) {
                            <p class="option-description">{{ value.description }}</p>
                          }
                          <div class="selected-indicator">✓</div>
                        </div>
                      }
                    </div>
                  </div>
                }

                @if (product.category === 'herbal') {
                  <h3 class="text-2xl font-bold text-gray-800 mb-2">Blend & Extras</h3>
                  <p class="text-gray-600 mb-6">
                    Select blend and add extras (up to 3)
                  </p>

                  <div class="form-group">
                    <label class="form-label" for="blend-type-select"
                      >Blend Preference *</label
                    >
                    <select
                      id="blend-type-select"
                      class="form-select"
                      [ngModel]="customizations['blend_type'].value || ''"
                      (ngModelChange)="selectBlendType($event)"
                    >
                      <option value="">Select blend...</option>
                      @for (value of getOptionValues('blend_type'); track value.value) {
                        <option [value]="value.value">{{ value.display_name }}</option>
                      }
                    </select>
                  </div>

                  <div class="form-group">
                    <span class="form-label" id="extras-label"
                      >Extras ({{ getSelectedExtras().length }}/3)</span
                    >
                    <div
                      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4"
                      role="group"
                      aria-labelledby="extras-label"
                    >
                      @for (value of getOptionValues('extras'); track value.value) {
                        <div
                          class="option-card"
                          [class.selected]="isExtraSelected(value.value)"
                          [class.opacity-50]="
                            !isExtraSelected(value.value) &&
                            getSelectedExtras().length >= 3
                          "
                          (click)="toggleExtra(value.value, value.price_modifier)"
                          (keydown.enter)="
                            toggleExtra(value.value, value.price_modifier)
                          "
                          (keydown.space)="
                            toggleExtra(value.value, value.price_modifier);
                            $event.preventDefault()
                          "
                          tabindex="0"
                          role="checkbox"
                          [attr.aria-checked]="isExtraSelected(value.value)"
                        >
                          <div class="option-card-header">
                            <span class="option-name">{{ value.display_name }}</span>
                            <span class="option-price">{{
                              customizationService.formatPriceModifier(
                                value.price_modifier
                              )
                            }}</span>
                          </div>
                          <div class="selected-indicator">✓</div>
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>
            }

            <!-- Step 3: Gift Note -->
            @if (currentStep === 3 && config) {
              <div class="slide-in">
                <h3 class="text-2xl font-bold text-gray-800 mb-2">Gift Note</h3>
                <p class="text-gray-600 mb-2">Add a personal message to your order</p>
                <p class="text-sm text-gray-500 mb-6">Free with your order</p>

                <div class="form-group">
                  <label class="form-label" for="gift-message-textarea"
                    >Gift Message (Optional)</label
                  >
                  <textarea
                    id="gift-message-textarea"
                    class="form-input"
                    rows="4"
                    [maxLength]="getMaxGiftNoteLength()"
                    [ngModel]="customizations['gift_note'].value || ''"
                    (ngModelChange)="updateGiftNote($event)"
                    placeholder="Enter your message..."
                  ></textarea>
                  <div class="flex justify-between mt-2">
                    <p class="form-help">
                      Letters, numbers, and basic punctuation only
                    </p>
                    <span class="text-sm text-gray-500">
                      {{ customizations['gift_note'].value.length || 0 }}/{{
                        getMaxGiftNoteLength()
                      }}
                    </span>
                  </div>
                </div>

                @if (customizations['gift_note'].value) {
                  <div class="mt-6 p-4 bg-gray-100 rounded-lg text-center">
                    <p class="text-sm text-gray-500 mb-2">Preview</p>
                    <p class="text-lg italic text-gold">
                      "{{ customizations['gift_note'].value }}"
                    </p>
                  </div>
                }
              </div>
            }

            <!-- Step 4: Summary -->
            @if (currentStep === 4 && config) {
              <div class="slide-in">
                <h3 class="text-2xl font-bold text-gray-800 mb-2">Review Your Order</h3>
                <p class="text-gray-600 mb-6">
                  Please review your selections before adding to cart
                </p>

                <div class="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6">
                  <h4 class="font-bold text-lg mb-4">{{ product.name }}</h4>
                  @if (summary.length > 0) {
                    <div class="space-y-3">
                      @for (item of summary; track item.label) {
                        <div
                          class="flex justify-between items-center py-2 border-b border-gray-100"
                        >
                          <div>
                            <span class="font-semibold text-gray-700"
                              >{{ item.label }}:</span
                            >
                            <span class="text-gray-600 ml-2">{{ item.value }}</span>
                          </div>
                          @if (item.price > 0) {
                            <span class="text-gold font-semibold">{{
                              customizationService.formatPriceModifier(item.price)
                            }}</span>
                          }
                        </div>
                      }
                    </div>
                  } @else {
                    <p class="text-gray-500">No customizations selected</p>
                  }
                </div>

                <!-- Price Breakdown -->
                <div class="price-summary">
                  <h4 class="font-bold text-lg mb-4">Price Breakdown</h4>
                  @for (item of priceInfo?.breakdown || []; track item.label) {
                    <div class="price-breakdown-row">
                      <span>{{ item.label }}</span>
                      <span>{{ customizationService.formatPrice(item.amount) }}</span>
                    </div>
                  }
                  @if (priceInfo && priceInfo.customizationCost > 0) {
                    <div class="price-breakdown-row total">
                      <span>Total</span>
                      <span>{{
                        customizationService.formatPrice(priceInfo.totalPrice)
                      }}</span>
                    </div>
                  }
                </div>
              </div>
            }
          </div>

          <!-- Footer -->
          <div class="customization-footer">
            <div class="footer-left">
              @if (priceInfo) {
                <div class="text-right">
                  <div class="text-sm text-gray-600">Total Price</div>
                  <div class="text-2xl font-bold text-gold">
                    {{ customizationService.formatPrice(priceInfo.totalPrice) }}
                  </div>
                </div>
              }
            </div>
            <div class="footer-right flex gap-4">
              <button
                class="btn btn-secondary"
                [disabled]="currentStep === 1"
                (click)="previousStep()"
              >
                Previous
              </button>
              <button class="btn btn-primary" (click)="nextStep()">
                {{ currentStep === 4 ? 'Add to Cart' : 'Next' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class CustomizationModalComponent implements OnChanges {
  customizationService = inject(CustomizationService);

  @Input() product: Product | null = null;
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() addToCart = new EventEmitter<CartItem>();

  config: CustomizationConfig | null = null;
  currentStep = 1;
  customizations: Record<string, CustomizationSelection> = {};
  priceInfo: PriceBreakdown | null = null;
  summary: CustomizationSummaryItem[] = [];
  errors: string[] = [];

  steps = [
    { number: 1, label: 'Size' },
    { number: 2, label: 'Options' },
    { number: 3, label: 'Gift Note' },
    { number: 4, label: 'Summary' },
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen && this.product) {
      this.loadConfig();
    }
    if (changes['isOpen'] && !this.isOpen) {
      this.reset();
    }
  }

  private loadConfig(): void {
    if (!this.product) return;

    this.customizationService.getConfig(this.product.category).subscribe({
      next: (config) => {
        this.config = config;
        this.updatePrice();
      },
      error: (error) => {
        console.error('Error loading config:', error);
      },
    });
  }

  private reset(): void {
    this.currentStep = 1;
    this.customizations = {};
    this.priceInfo = null;
    this.summary = [];
    this.errors = [];
    this.config = null;
  }

  getOptionValues(optionId: string): CustomizationOptionValue[] {
    const option = this.config?.options.find((o) => o.option_id === optionId);
    return option?.values || [];
  }

  selectOption(optionId: string, value: string, priceModifier: number): void {
    this.customizations[optionId] = { value, price: priceModifier };
    this.updatePrice();
  }

  selectLeafStyle(value: string): void {
    const option = this.config?.options.find((o) => o.option_id === 'leaf_style');
    const optionValue = option?.values.find((v) => v.value === value);
    this.customizations['leaf_style'] = {
      value,
      price: optionValue?.price_modifier || 0,
    };
    this.updatePrice();
  }

  selectBlendType(value: string): void {
    const option = this.config?.options.find((o) => o.option_id === 'blend_type');
    const optionValue = option?.values.find((v) => v.value === value);
    this.customizations['blend_type'] = {
      value,
      price: optionValue?.price_modifier || 0,
    };
    this.updatePrice();
  }

  getSelectedExtras(): string[] {
    const extras = this.customizations['extras']?.value;
    return Array.isArray(extras) ? extras : [];
  }

  isExtraSelected(value: string): boolean {
    return this.getSelectedExtras().includes(value);
  }

  toggleExtra(value: string, priceModifier: number): void {
    const selected = this.getSelectedExtras();

    if (selected.includes(value)) {
      const newSelected = selected.filter((v) => v !== value);
      this.customizations['extras'] = {
        value: newSelected,
        price: newSelected.length * priceModifier,
      };
    } else if (selected.length < 3) {
      const newSelected = [...selected, value];
      this.customizations['extras'] = {
        value: newSelected,
        price: newSelected.length * priceModifier,
      };
    }

    this.updatePrice();
  }

  getGiftNotePrice(): number {
    const option = this.config?.options.find((o) => o.option_id === 'gift_note');
    return option?.validation_rules?.price || 0;
  }

  getMaxGiftNoteLength(): number {
    const option = this.config?.options.find((o) => o.option_id === 'gift_note');
    return option?.validation_rules?.max_length || 100;
  }

  updateGiftNote(text: string): void {
    if (text) {
      this.customizations['gift_note'] = {
        value: text,
        price: this.getGiftNotePrice(),
      };
    } else {
      delete this.customizations['gift_note'];
    }
    this.updatePrice();
  }

  private updatePrice(): void {
    if (!this.product || !this.config) return;

    this.priceInfo = this.customizationService.calculatePrice(
      this.product.price,
      this.customizations,
      this.config
    );

    this.summary = this.customizationService.formatSummary(
      this.customizations,
      this.config
    );
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.errors = [];
    }
  }

  nextStep(): void {
    if (!this.config) return;

    const validation = this.customizationService.validateStep(
      this.currentStep,
      this.customizations,
      this.config
    );

    if (!validation.valid) {
      this.errors = validation.errors;
      return;
    }

    this.errors = [];

    if (this.currentStep < 4) {
      this.currentStep++;
    } else {
      this.completeCustomization();
    }
  }

  private completeCustomization(): void {
    if (!this.product || !this.priceInfo || !this.config) return;

    const customizedItem: CartItem = {
      ...this.product,
      id: this.customizationService.generateCustomizationId(this.product.id),
      isCustomized: true,
      price: this.priceInfo.totalPrice,
      basePrice: this.product.price,
      customizationCost: this.priceInfo.customizationCost,
      customizations: this.customizations,
      customizationSummary: this.summary,
      quantity: 1,
    };

    this.addToCart.emit(customizedItem);
  }

  onClose(): void {
    if (Object.keys(this.customizations).length > 0) {
      if (confirm('You have unsaved customizations. Are you sure you want to close?')) {
        this.closeModal.emit();
      }
    } else {
      this.closeModal.emit();
    }
  }
}
