// Customization Data Utilities and Helper Functions

// Configuration cache (in-memory for session)
const configCache = {};

/**
 * Fetch customization configuration from API with caching
 * @param {string} category - Product category
 * @returns {Promise<Object>} Customization configuration
 */
async function fetchCustomizationConfig(category) {
    if (configCache[category]) {
        return configCache[category];
    }

    try {
        const response = await fetch(`/api/customization-config/${category}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch configuration for ${category}`);
        }
        const config = await response.json();
        configCache[category] = config;
        return config;
    } catch (error) {
        console.error('Error fetching customization config:', error);
        throw error;
    }
}

/**
 * Format price for display
 * @param {number} amount - Price amount
 * @returns {string} Formatted price string
 */
function formatPrice(amount) {
    return `$${amount.toFixed(2)}`;
}

/**
 * Format price modifier for display (with + sign for positive values)
 * @param {number} amount - Price modifier amount
 * @returns {string} Formatted price modifier
 */
function formatPriceModifier(amount) {
    if (amount === 0) {
        return 'Free';
    }
    return `+${formatPrice(amount)}`;
}

/**
 * Calculate total price from customizations
 * @param {number} basePrice - Base product price
 * @param {Object} customizations - Selected customizations
 * @param {Object} config - Customization configuration
 * @returns {Object} Price breakdown
 */
function calculateCustomizationPrice(basePrice, customizations, config) {
    const breakdown = [
        { label: 'Base Price', amount: basePrice }
    ];

    let customizationCost = 0;

    for (const [optionId, selection] of Object.entries(customizations)) {
        const option = config.options.find(opt => opt.option_id === optionId);
        if (!option) continue;

        if (option.option_type === 'text') {
            // Text input (engraving)
            if (selection.value && option.validation_rules && option.validation_rules.price) {
                const price = option.validation_rules.price;
                customizationCost += price;
                breakdown.push({
                    label: option.display_name,
                    amount: price
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
                        amount: totalPrice
                    });
                }
            }
        } else {
            // Single select
            const optionValue = option.values.find(v => v.value === selection.value);
            if (optionValue && optionValue.price_modifier > 0) {
                customizationCost += optionValue.price_modifier;
                breakdown.push({
                    label: optionValue.display_name,
                    amount: optionValue.price_modifier
                });
            }
        }
    }

    return {
        basePrice,
        customizationCost,
        totalPrice: basePrice + customizationCost,
        breakdown
    };
}

/**
 * Validate engraving text
 * @param {string} text - Text to validate
 * @param {number} maxLength - Maximum allowed length
 * @param {string} pattern - Regex pattern (optional)
 * @returns {Object} Validation result
 */
function validateEngraving(text, maxLength, pattern = null) {
    const errors = [];

    if (text.length > maxLength) {
        errors.push(`Text exceeds maximum length of ${maxLength} characters`);
    }

    if (pattern) {
        const regex = new RegExp(pattern);
        if (!regex.test(text)) {
            errors.push('Text contains invalid characters');
        }
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Validate customization step
 * @param {number} stepNumber - Current step number
 * @param {Object} customizations - Current customizations
 * @param {Object} config - Customization configuration
 * @returns {Object} Validation result
 */
function validateStep(stepNumber, customizations, config) {
    const errors = [];

    // Get options for current step
    const stepOptions = config.options.filter(opt => {
        // Map options to steps (this is simplified)
        if (stepNumber === 1) return opt.option_id === 'metal_type';
        if (stepNumber === 2) return ['ring_size', 'gemstone', 'chain_length', 'pendant_option', 'clasp_type', 'bracelet_size', 'charms'].includes(opt.option_id);
        if (stepNumber === 3) return opt.option_id === 'engraving';
        return false;
    });

    for (const option of stepOptions) {
        if (option.required) {
            const selection = customizations[option.option_id];
            if (!selection || !selection.value || (Array.isArray(selection.value) && selection.value.length === 0)) {
                errors.push(`${option.display_name} is required`);
            }
        }

        // Validate text inputs
        if (option.option_type === 'text' && customizations[option.option_id]?.value) {
            const text = customizations[option.option_id].value;
            const rules = option.validation_rules;
            if (rules) {
                const validation = validateEngraving(text, rules.max_length, rules.pattern);
                if (!validation.valid) {
                    errors.push(...validation.errors);
                }
            }
        }

        // Validate multi-select limits
        if (option.option_type === 'multi_select' && customizations[option.option_id]?.value) {
            const selections = customizations[option.option_id].value;
            const maxSelections = option.validation_rules?.max_selections;
            if (maxSelections && selections.length > maxSelections) {
                errors.push(`${option.display_name}: Maximum ${maxSelections} selections allowed`);
            }
        }
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Generate unique ID for customized product
 * @param {number} productId - Base product ID
 * @param {Object} customizations - Customizations object
 * @returns {string} Unique ID
 */
function generateCustomizationId(productId, customizations) {
    const timestamp = Date.now();
    return `custom_${productId}_${timestamp}`;
}

/**
 * Format customization summary for display
 * @param {Object} customizations - Customizations object
 * @param {Object} config - Customization configuration
 * @returns {Array} Array of summary items
 */
function formatCustomizationSummary(customizations, config) {
    const summary = [];

    for (const [optionId, selection] of Object.entries(customizations)) {
        const option = config.options.find(opt => opt.option_id === optionId);
        if (!option || !selection.value) continue;

        if (option.option_type === 'text') {
            if (selection.value) {
                summary.push({
                    label: option.display_name,
                    value: `"${selection.value}"`,
                    price: option.validation_rules?.price || 0
                });
            }
        } else if (option.option_type === 'multi_select') {
            if (Array.isArray(selection.value) && selection.value.length > 0) {
                const displayNames = selection.value.map(val => {
                    const optVal = option.values.find(v => v.value === val);
                    return optVal ? optVal.display_name : val;
                });
                summary.push({
                    label: option.display_name,
                    value: displayNames.join(', '),
                    price: selection.price || 0
                });
            }
        } else {
            const optionValue = option.values.find(v => v.value === selection.value);
            if (optionValue) {
                summary.push({
                    label: option.display_name,
                    value: optionValue.display_name,
                    price: optionValue.price_modifier
                });
            }
        }
    }

    return summary;
}

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Save customization to localStorage
 * @param {string} key - Storage key
 * @param {Object} data - Data to save
 */
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        if (error.name === 'QuotaExceededError') {
            console.error('localStorage quota exceeded');
            // Could implement cleanup logic here
        } else {
            console.error('Error saving to localStorage:', error);
        }
    }
}

/**
 * Load data from localStorage
 * @param {string} key - Storage key
 * @returns {Object|null} Loaded data or null
 */
function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return null;
    }
}

/**
 * Show notification message
 * @param {string} message - Message to display
 * @param {string} type - Notification type (success, error, info)
 */
function showCustomizationNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in ${
        type === 'error' ? 'bg-red-500' :
        type === 'info' ? 'bg-blue-500' :
        'bg-gold'
    } text-white`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('animate-fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
