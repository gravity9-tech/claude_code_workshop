import { Product } from './product.model';
import { CustomizationSummaryItem } from './customization.model';

export interface CartItem extends Product {
  quantity: number;
  isCustomized?: boolean;
  customizationSummary?: CustomizationSummaryItem[];
  basePrice?: number;
  customizationCost?: number;
  customizations?: Record<string, CustomizationSelection>;
}

export interface CustomizationSelection {
  value: string | string[];
  price?: number;
}
