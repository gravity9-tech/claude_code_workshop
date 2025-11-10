// Product Customization Builder
// Main class for managing the customization wizard

class CustomizationBuilder {
    constructor(product) {
        this.product = product;
        this.config = null;
        this.currentStep = 1;
        this.totalSteps = 4;
        this.customizations = {};
        this.priceInfo = null;

        // Bind debounced methods
        this.debouncedUpdatePrice = debounce(() => this.updatePrice(), 150);
        this.debouncedSave = debounce(() => this.saveToLocalStorage(), 500);
    }

    async init() {
        try {
            // Fetch configuration
            this.config = await fetchCustomizationConfig(this.product.category);

            // Load any saved progress
            this.loadSavedProgress();

            // Initialize price
            this.priceInfo = calculateCustomizationPrice(
                this.product.price,
                this.customizations,
                this.config
            );

            // Show modal
            this.showModal();

            // Render first step
            this.renderStep();
            this.updateStepperUI();
            this.renderPriceSummary();

        } catch (error) {
            console.error('Failed to initialize customization:', error);
            showCustomizationNotification('Failed to load customization options', 'error');
        }
    }

    showModal() {
        const modal = document.getElementById('customizationModal');
        const overlay = document.getElementById('customizationOverlay');

        modal.classList.remove('hidden');
        overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    close() {
        // Check if there are unsaved changes
        if (Object.keys(this.customizations).length > 0) {
            const confirmClose = confirm('You have unsaved customizations. Are you sure you want to close?');
            if (!confirmClose) return;
        }

        const modal = document.getElementById('customizationModal');
        const overlay = document.getElementById('customizationOverlay');

        modal.classList.add('hidden');
        overlay.classList.add('hidden');
        document.body.style.overflow = 'auto';

        // Clear active session
        localStorage.removeItem('pandora_active_customization');
    }

    renderStep() {
        const container = document.getElementById('customizationStepContent');

        // Hide all steps
        document.querySelectorAll('.customization-step').forEach(step => {
            step.classList.remove('active');
        });

        switch(this.currentStep) {
            case 1:
                this.renderMetalTypeStep(container);
                break;
            case 2:
                this.renderDetailsStep(container);
                break;
            case 3:
                this.renderEngravingStep(container);
                break;
            case 4:
                this.renderSummaryStep(container);
                break;
        }
    }

    renderMetalTypeStep(container) {
        const metalOption = this.config.options.find(opt => opt.option_id === 'metal_type');
        if (!metalOption) return;

        container.innerHTML = `
            <div class="customization-step active">
                <h3 class="step-title">${metalOption.display_name}</h3>
                <p class="step-description">${metalOption.help_text || 'Choose your preferred metal'}</p>

                <div class="option-grid">
                    ${metalOption.values.map(value => `
                        <label class="option-card ${this.customizations.metal_type?.value === value.value ? 'selected' : ''}"
                               data-option-id="metal_type"
                               data-value="${value.value}">
                            <input type="radio"
                                   name="metal_type"
                                   value="${value.value}"
                                   ${this.customizations.metal_type?.value === value.value ? 'checked' : ''}>
                            <div class="option-card-header">
                                <span class="option-name">${value.display_name}</span>
                                <span class="option-price ${value.price_modifier === 0 ? 'free' : ''}">
                                    ${formatPriceModifier(value.price_modifier)}
                                </span>
                            </div>
                            ${value.description ? `<p class="option-description">${value.description}</p>` : ''}
                            <div class="selected-indicator">✓</div>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;

        // Add event listeners
        container.querySelectorAll('.option-card').forEach(card => {
            card.addEventListener('click', () => {
                const optionId = card.dataset.optionId;
                const value = card.dataset.value;
                this.selectOption(optionId, value, metalOption);
            });
        });
    }

    renderDetailsStep(container) {
        if (this.product.category === 'rings') {
            this.renderRingDetailsStep(container);
        } else if (this.product.category === 'necklaces') {
            this.renderNecklaceDetailsStep(container);
        } else if (this.product.category === 'bracelets') {
            this.renderBraceletDetailsStep(container);
        }
    }

    renderRingDetailsStep(container) {
        const sizeOption = this.config.options.find(opt => opt.option_id === 'ring_size');
        const gemstoneOption = this.config.options.find(opt => opt.option_id === 'gemstone');

        container.innerHTML = `
            <div class="customization-step active">
                <h3 class="step-title">Size & Gemstone</h3>
                <p class="step-description">Select your ring size and optional gemstone</p>

                <div class="form-group">
                    <label class="form-label">${sizeOption.display_name} *</label>
                    <select id="ring_size" class="form-select">
                        <option value="">Select size...</option>
                        ${sizeOption.values.map(v => `
                            <option value="${v.value}" ${this.customizations.ring_size?.value === v.value ? 'selected' : ''}>
                                ${v.display_name}
                            </option>
                        `).join('')}
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">${gemstoneOption.display_name}</label>
                    <div class="option-grid">
                        ${gemstoneOption.values.map(value => `
                            <label class="option-card ${this.customizations.gemstone?.value === value.value ? 'selected' : ''}"
                                   data-option-id="gemstone"
                                   data-value="${value.value}">
                                <input type="radio"
                                       name="gemstone"
                                       value="${value.value}"
                                       ${this.customizations.gemstone?.value === value.value ? 'checked' : ''}>
                                <div class="option-card-header">
                                    <span class="option-name">${value.display_name}</span>
                                    <span class="option-price ${value.price_modifier === 0 ? 'free' : ''}">
                                        ${formatPriceModifier(value.price_modifier)}
                                    </span>
                                </div>
                                ${value.description ? `<p class="option-description">${value.description}</p>` : ''}
                                <div class="selected-indicator">✓</div>
                            </label>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // Event listeners
        document.getElementById('ring_size').addEventListener('change', (e) => {
            this.selectOption('ring_size', e.target.value, sizeOption);
        });

        container.querySelectorAll('.option-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectOption(card.dataset.optionId, card.dataset.value, gemstoneOption);
            });
        });
    }

    renderNecklaceDetailsStep(container) {
        const chainOption = this.config.options.find(opt => opt.option_id === 'chain_length');
        const pendantOption = this.config.options.find(opt => opt.option_id === 'pendant_option');
        const claspOption = this.config.options.find(opt => opt.option_id === 'clasp_type');

        container.innerHTML = `
            <div class="customization-step active">
                <h3 class="step-title">Chain & Details</h3>
                <p class="step-description">Customize your necklace details</p>

                <div class="form-group">
                    <label class="form-label">${chainOption.display_name} *</label>
                    <select id="chain_length" class="form-select">
                        <option value="">Select length...</option>
                        ${chainOption.values.map(v => `
                            <option value="${v.value}" ${this.customizations.chain_length?.value === v.value ? 'selected' : ''}>
                                ${v.display_name}
                            </option>
                        `).join('')}
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">${pendantOption.display_name}</label>
                    <select id="pendant_option" class="form-select">
                        ${pendantOption.values.map(v => `
                            <option value="${v.value}" ${this.customizations.pendant_option?.value === v.value ? 'selected' : ''}>
                                ${v.display_name} ${v.price_modifier > 0 ? `(${formatPriceModifier(v.price_modifier)})` : ''}
                            </option>
                        `).join('')}
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">${claspOption.display_name} *</label>
                    <select id="clasp_type" class="form-select">
                        <option value="">Select clasp...</option>
                        ${claspOption.values.map(v => `
                            <option value="${v.value}" ${this.customizations.clasp_type?.value === v.value ? 'selected' : ''}>
                                ${v.display_name}
                            </option>
                        `).join('')}
                    </select>
                </div>
            </div>
        `;

        // Event listeners
        document.getElementById('chain_length').addEventListener('change', (e) => {
            this.selectOption('chain_length', e.target.value, chainOption);
        });
        document.getElementById('pendant_option').addEventListener('change', (e) => {
            this.selectOption('pendant_option', e.target.value, pendantOption);
        });
        document.getElementById('clasp_type').addEventListener('change', (e) => {
            this.selectOption('clasp_type', e.target.value, claspOption);
        });
    }

    renderBraceletDetailsStep(container) {
        const sizeOption = this.config.options.find(opt => opt.option_id === 'bracelet_size');
        const charmsOption = this.config.options.find(opt => opt.option_id === 'charms');

        const selectedCharms = this.customizations.charms?.value || [];

        container.innerHTML = `
            <div class="customization-step active">
                <h3 class="step-title">Size & Charms</h3>
                <p class="step-description">Select size and add charms (up to 3)</p>

                <div class="form-group">
                    <label class="form-label">${sizeOption.display_name} *</label>
                    <select id="bracelet_size" class="form-select">
                        <option value="">Select size...</option>
                        ${sizeOption.values.map(v => `
                            <option value="${v.value}" ${this.customizations.bracelet_size?.value === v.value ? 'selected' : ''}>
                                ${v.display_name}
                            </option>
                        `).join('')}
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">${charmsOption.display_name} (${selectedCharms.length}/3)</label>
                    <div class="option-grid">
                        ${charmsOption.values.map(value => `
                            <label class="option-card ${selectedCharms.includes(value.value) ? 'selected' : ''}"
                                   data-option-id="charms"
                                   data-value="${value.value}">
                                <input type="checkbox"
                                       value="${value.value}"
                                       ${selectedCharms.includes(value.value) ? 'checked' : ''}
                                       ${selectedCharms.length >= 3 && !selectedCharms.includes(value.value) ? 'disabled' : ''}>
                                <div class="option-card-header">
                                    <span class="option-name">${value.display_name}</span>
                                    <span class="option-price">${formatPriceModifier(value.price_modifier)}</span>
                                </div>
                                <div class="selected-indicator">✓</div>
                            </label>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // Event listeners
        document.getElementById('bracelet_size').addEventListener('change', (e) => {
            this.selectOption('bracelet_size', e.target.value, sizeOption);
        });

        container.querySelectorAll('.option-card[data-option-id="charms"]').forEach(card => {
            card.addEventListener('click', () => {
                const value = card.dataset.value;
                const currentSelected = this.customizations.charms?.value || [];

                let newSelected;
                if (currentSelected.includes(value)) {
                    newSelected = currentSelected.filter(v => v !== value);
                } else {
                    if (currentSelected.length < 3) {
                        newSelected = [...currentSelected, value];
                    } else {
                        return; // Max reached
                    }
                }

                this.customizations.charms = {
                    value: newSelected,
                    price: newSelected.length * 50
                };

                this.updatePrice();
                this.renderStep(); // Re-render to update checkbox states
            });
        });
    }

    renderEngravingStep(container) {
        const engravingOption = this.config.options.find(opt => opt.option_id === 'engraving');
        const maxLength = engravingOption.validation_rules.max_length;
        const currentText = this.customizations.engraving?.value || '';

        container.innerHTML = `
            <div class="customization-step active">
                <h3 class="step-title">${engravingOption.display_name}</h3>
                <p class="step-description">${engravingOption.help_text}</p>
                <p class="text-sm text-gray-600 mb-4">Add +${formatPrice(engravingOption.validation_rules.price)}</p>

                <div class="form-group">
                    <label class="form-label">Engraving Text (Optional)</label>
                    <input type="text"
                           id="engraving_text"
                           class="form-input"
                           maxlength="${maxLength}"
                           value="${currentText}"
                           placeholder="Enter your text...">
                    <div class="character-counter">
                        <span id="char_count">${currentText.length}</span>/${maxLength} characters
                    </div>
                    <p class="form-help">Letters, numbers, and basic punctuation only</p>
                </div>

                ${currentText ? `
                    <div class="preview-container mt-6">
                        <img src="${this.product.image}" alt="${this.product.name}" class="preview-image">
                        <div class="preview-engraving">"${currentText}"</div>
                    </div>
                ` : ''}
            </div>
        `;

        // Event listener
        const input = document.getElementById('engraving_text');
        input.addEventListener('input', (e) => {
            const text = e.target.value;
            document.getElementById('char_count').textContent = text.length;

            if (text) {
                this.customizations.engraving = {
                    value: text,
                    price: engravingOption.validation_rules.price
                };
            } else {
                delete this.customizations.engraving;
            }

            this.debouncedUpdatePrice();
            this.debouncedSave();
        });
    }

    renderSummaryStep(container) {
        const summary = formatCustomizationSummary(this.customizations, this.config);

        container.innerHTML = `
            <div class="customization-step active">
                <h3 class="step-title">Review Your Customization</h3>
                <p class="step-description">Please review your selections before adding to cart</p>

                <div class="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6">
                    <h4 class="font-bold text-lg mb-4">${this.product.name}</h4>
                    ${summary.length > 0 ? `
                        <div class="space-y-3">
                            ${summary.map(item => `
                                <div class="flex justify-between items-center py-2 border-b border-gray-100">
                                    <div>
                                        <span class="font-semibold text-gray-700">${item.label}:</span>
                                        <span class="text-gray-600 ml-2">${item.value}</span>
                                    </div>
                                    ${item.price > 0 ? `<span class="text-gold font-semibold">${formatPriceModifier(item.price)}</span>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    ` : '<p class="text-gray-500">No customizations selected</p>'}
                </div>

                ${this.renderPriceBreakdown()}
            </div>
        `;
    }

    renderPriceBreakdown() {
        if (!this.priceInfo) return '';

        return `
            <div class="price-summary">
                <h4 class="font-bold text-lg mb-4">Price Breakdown</h4>
                ${this.priceInfo.breakdown.map((item, index) => `
                    <div class="price-breakdown-row ${index === this.priceInfo.breakdown.length - 1 ? 'total' : ''}">
                        <span>${item.label}</span>
                        <span>${formatPrice(item.amount)}</span>
                    </div>
                `).join('')}
                ${this.priceInfo.customizationCost > 0 ? `
                    <div class="price-breakdown-row total">
                        <span>Total</span>
                        <span>${formatPrice(this.priceInfo.totalPrice)}</span>
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderPriceSummary() {
        const container = document.getElementById('priceSummaryContainer');
        if (!container || !this.priceInfo) return;

        container.innerHTML = `
            <div class="text-right">
                <div class="text-sm text-gray-600">Total Price</div>
                <div class="text-2xl font-bold text-gold">${formatPrice(this.priceInfo.totalPrice)}</div>
            </div>
        `;
    }

    selectOption(optionId, value, optionConfig) {
        const optionValue = optionConfig.values?.find(v => v.value === value);

        this.customizations[optionId] = {
            value: value,
            price: optionValue?.price_modifier || 0
        };

        // Update UI
        document.querySelectorAll(`.option-card[data-option-id="${optionId}"]`).forEach(card => {
            if (card.dataset.value === value) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });

        this.updatePrice();
        this.debouncedSave();
    }

    updatePrice() {
        this.priceInfo = calculateCustomizationPrice(
            this.product.price,
            this.customizations,
            this.config
        );
        this.renderPriceSummary();
    }

    updateStepperUI() {
        document.querySelectorAll('.stepper-step').forEach((step, index) => {
            const stepNumber = index + 1;

            step.classList.remove('active', 'completed');

            if (stepNumber === this.currentStep) {
                step.classList.add('active');
            } else if (stepNumber < this.currentStep) {
                step.classList.add('completed');
            }
        });

        // Update button states
        const prevBtn = document.getElementById('prevStepBtn');
        const nextBtn = document.getElementById('nextStepBtn');

        prevBtn.disabled = this.currentStep === 1;

        if (this.currentStep === this.totalSteps) {
            nextBtn.textContent = 'Add to Cart';
            nextBtn.classList.remove('btn-primary');
            nextBtn.classList.add('btn-primary');
        } else {
            nextBtn.textContent = 'Next';
        }
    }

    async nextStep() {
        // Validate current step
        const validation = validateStep(this.currentStep, this.customizations, this.config);

        if (!validation.valid) {
            this.showErrors(validation.errors);
            return;
        }

        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.renderStep();
            this.updateStepperUI();
            this.clearErrors();
        } else {
            // Final step - add to cart
            this.addToCart();
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.renderStep();
            this.updateStepperUI();
            this.clearErrors();
        }
    }

    showErrors(errors) {
        const errorContainer = document.getElementById('errorContainer');
        errorContainer.innerHTML = `
            <div class="error-summary">
                <h4>Please correct the following:</h4>
                <ul>
                    ${errors.map(err => `<li>${err}</li>`).join('')}
                </ul>
            </div>
        `;
        errorContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    clearErrors() {
        const errorContainer = document.getElementById('errorContainer');
        if (errorContainer) {
            errorContainer.innerHTML = '';
        }
    }

    addToCart() {
        const customizedItem = {
            ...this.product,
            id: generateCustomizationId(this.product.id, this.customizations),
            productId: this.product.id,
            isCustomized: true,
            price: this.priceInfo.totalPrice,
            basePrice: this.product.price,
            customizationCost: this.priceInfo.customizationCost,
            customizations: this.customizations,
            customizationSummary: formatCustomizationSummary(this.customizations, this.config)
        };

        cart.addItem(customizedItem);

        showCustomizationNotification('Customized product added to cart!');

        this.close();
    }

    saveToLocalStorage() {
        const data = {
            productId: this.product.id,
            step: this.currentStep,
            customizations: this.customizations,
            lastModified: Date.now()
        };

        saveToLocalStorage('pandora_active_customization', data);
    }

    loadSavedProgress() {
        const saved = loadFromLocalStorage('pandora_active_customization');

        if (saved && saved.productId === this.product.id) {
            this.customizations = saved.customizations || {};
            // Note: We start from step 1 to ensure user reviews all selections
        }
    }
}

// Global instance
let activeCustomizationBuilder = null;

// Open customization modal
function openCustomizationModal(product) {
    if (activeCustomizationBuilder) {
        activeCustomizationBuilder.close();
    }

    activeCustomizationBuilder = new CustomizationBuilder(product);
    activeCustomizationBuilder.init();
}

// Close button handler
document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.getElementById('closeCustomizationBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (activeCustomizationBuilder) {
                activeCustomizationBuilder.close();
            }
        });
    }

    // Overlay click to close
    const overlay = document.getElementById('customizationOverlay');
    if (overlay) {
        overlay.addEventListener('click', () => {
            if (activeCustomizationBuilder) {
                activeCustomizationBuilder.close();
            }
        });
    }

    // Navigation buttons
    const prevBtn = document.getElementById('prevStepBtn');
    const nextBtn = document.getElementById('nextStepBtn');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (activeCustomizationBuilder) {
                activeCustomizationBuilder.previousStep();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (activeCustomizationBuilder) {
                activeCustomizationBuilder.nextStep();
            }
        });
    }
});
