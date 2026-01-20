import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  CustomizationConfig,
  CustomizationSelection,
  PriceBreakdown,
  CustomizationSummaryItem,
} from '../models/customization.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomizationService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  private configCache: Record<string, CustomizationConfig> = {};

  getConfig(category: string): Observable<CustomizationConfig> {
    if (this.configCache[category]) {
      return of(this.configCache[category]);
    }

    return this.http
      .get<CustomizationConfig>(`${this.apiUrl}/customization-config/${category}`)
      .pipe(tap((config) => (this.configCache[category] = config)));
  }

  calculatePrice(
    basePrice: number,
    customizations: Record<string, CustomizationSelection>,
    config: CustomizationConfig
  ): PriceBreakdown {
    const breakdown: { label: string; amount: number }[] = [
      { label: 'Base Price', amount: basePrice },
    ];

    let customizationCost = 0;

    for (const [optionId, selection] of Object.entries(customizations)) {
      const option = config.options.find((opt) => opt.option_id === optionId);
      if (!option) continue;

      if (option.option_type === 'text') {
        // Text input (engraving)
        if (selection.value && option.validation_rules?.price) {
          const price = option.validation_rules.price;
          customizationCost += price;
          breakdown.push({
            label: option.display_name,
            amount: price,
          });
        }
      } else if (option.option_type === 'multi_select') {
        // Multi-select (like charms)
        if (Array.isArray(selection.value)) {
          const pricePerItem = option.validation_rules?.price_per_item || 0;
          const totalPrice = selection.value.length * pricePerItem;
          if (totalPrice > 0) {
            customizationCost += totalPrice;
            breakdown.push({
              label: `${option.display_name} (${selection.value.length})`,
              amount: totalPrice,
            });
          }
        }
      } else {
        // Single select
        const optionValue = option.values.find((v) => v.value === selection.value);
        if (optionValue && optionValue.price_modifier > 0) {
          customizationCost += optionValue.price_modifier;
          breakdown.push({
            label: optionValue.display_name,
            amount: optionValue.price_modifier,
          });
        }
      }
    }

    return {
      basePrice,
      customizationCost,
      totalPrice: basePrice + customizationCost,
      breakdown,
    };
  }

  validateStep(
    stepNumber: number,
    customizations: Record<string, CustomizationSelection>,
    config: CustomizationConfig
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Get options for current step
    const stepOptions = config.options.filter((opt) => {
      if (stepNumber === 1) return opt.option_id === 'package_size';
      if (stepNumber === 2)
        return [
          'brew_strength',
          'add_ons',
          'leaf_style',
          'accessories',
          'roast_level',
          'brewing_vessel',
          'blend_type',
          'extras',
        ].includes(opt.option_id);
      if (stepNumber === 3) return opt.option_id === 'gift_note';
      return false;
    });

    for (const option of stepOptions) {
      if (option.required) {
        const selection = customizations[option.option_id];
        if (
          !selection ||
          !selection.value ||
          (Array.isArray(selection.value) && selection.value.length === 0)
        ) {
          errors.push(`${option.display_name} is required`);
        }
      }

      // Validate text inputs
      if (option.option_type === 'text' && customizations[option.option_id]?.value) {
        const text = customizations[option.option_id].value as string;
        const rules = option.validation_rules;
        if (rules?.max_length && text.length > rules.max_length) {
          errors.push(`Text exceeds maximum length of ${rules.max_length} characters`);
        }
      }

      // Validate multi-select limits
      if (
        option.option_type === 'multi_select' &&
        customizations[option.option_id]?.value
      ) {
        const selections = customizations[option.option_id].value as string[];
        const maxSelections = option.validation_rules?.max_selections;
        if (maxSelections && selections.length > maxSelections) {
          errors.push(
            `${option.display_name}: Maximum ${maxSelections} selections allowed`
          );
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  formatSummary(
    customizations: Record<string, CustomizationSelection>,
    config: CustomizationConfig
  ): CustomizationSummaryItem[] {
    const summary: CustomizationSummaryItem[] = [];

    for (const [optionId, selection] of Object.entries(customizations)) {
      const option = config.options.find((opt) => opt.option_id === optionId);
      if (!option || !selection.value) continue;

      if (option.option_type === 'text') {
        if (selection.value) {
          summary.push({
            label: option.display_name,
            value: `"${selection.value}"`,
            price: option.validation_rules?.price || 0,
          });
        }
      } else if (option.option_type === 'multi_select') {
        if (Array.isArray(selection.value) && selection.value.length > 0) {
          const displayNames = selection.value.map((val) => {
            const optVal = option.values.find((v) => v.value === val);
            return optVal ? optVal.display_name : val;
          });
          summary.push({
            label: option.display_name,
            value: displayNames.join(', '),
            price: selection.price || 0,
          });
        }
      } else {
        const optionValue = option.values.find((v) => v.value === selection.value);
        if (optionValue) {
          summary.push({
            label: option.display_name,
            value: optionValue.display_name,
            price: optionValue.price_modifier,
          });
        }
      }
    }

    return summary;
  }

  generateCustomizationId(productId: number): string {
    return `custom_${productId}_${Date.now()}`;
  }

  formatPrice(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }

  formatPriceModifier(amount: number): string {
    if (amount === 0) return 'Free';
    return `+$${amount.toFixed(2)}`;
  }
}
