// Shopping Cart Management

class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartUI();
    }

    // Load cart from localStorage
    loadCart() {
        const saved = localStorage.getItem('pandora_cart');
        return saved ? JSON.parse(saved) : [];
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('pandora_cart', JSON.stringify(this.items));
    }

    // Add item to cart
    addItem(product) {
        // For customized items, treat each as unique (they have unique IDs already)
        // For regular items, check if already in cart
        if (product.isCustomized) {
            this.items.push({
                ...product,
                quantity: 1
            });
        } else {
            const existingItem = this.items.find(item => item.id === product.id && !item.isCustomized);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.items.push({
                    ...product,
                    quantity: 1
                });
            }
        }

        this.saveCart();
        this.updateCartUI();
        this.showNotification(`${product.name} added to cart`);
    }

    // Remove item from cart
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
    }

    // Update item quantity
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartUI();
            }
        }
    }

    // Get cart total
    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Get total items count
    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    // Update cart UI
    updateCartUI() {
        // Update cart count badge
        const cartCount = document.getElementById('cartCount');
        cartCount.textContent = this.getItemCount();

        // Update cart items display
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');

        if (this.items.length === 0) {
            cartItems.innerHTML = '<p class="text-gray-500 text-center">Your cart is empty</p>';
        } else {
            cartItems.innerHTML = this.items.map(item => `
                <div class="cart-item bg-white rounded-lg shadow p-4 mb-4">
                    ${item.isCustomized ? '<div class="inline-block bg-gold text-white text-xs px-2 py-1 rounded mb-2">Customized</div>' : ''}
                    <div class="flex gap-4">
                        <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded">
                        <div class="flex-1">
                            <h4 class="font-semibold text-sm mb-1">${item.name}</h4>
                            ${item.isCustomized && item.customizationSummary ? `
                                <div class="text-xs text-gray-600 mb-1">
                                    ${item.customizationSummary.map(c => `${c.label}: ${c.value}`).join(' • ')}
                                </div>
                            ` : ''}
                            <p class="text-gold font-bold mb-2">$${item.price.toFixed(2)}</p>
                            <div class="flex items-center gap-2">
                                ${!item.isCustomized ? `
                                    <button onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})"
                                            class="bg-gray-200 hover:bg-gray-300 w-7 h-7 rounded flex items-center justify-center">
                                        <span class="text-lg font-bold">−</span>
                                    </button>
                                    <span class="w-8 text-center font-semibold">${item.quantity}</span>
                                    <button onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})"
                                            class="bg-gray-200 hover:bg-gray-300 w-7 h-7 rounded flex items-center justify-center">
                                        <span class="text-lg font-bold">+</span>
                                    </button>
                                ` : `
                                    <span class="text-sm text-gray-600">Qty: ${item.quantity}</span>
                                `}
                                <button onclick="cart.removeItem('${item.id}')"
                                        class="ml-auto text-red-500 hover:text-red-700">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        cartTotal.textContent = `$${this.getTotal().toFixed(2)}`;
    }

    // Show notification
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 right-4 bg-gold text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
        notification.textContent = message;
        document.body.appendChild(notification);

        // Remove after 2 seconds
        setTimeout(() => {
            notification.classList.add('animate-fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}

// Initialize cart
const cart = new ShoppingCart();

// Cart sidebar controls
const cartBtn = document.getElementById('cartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');

function openCart() {
    cartSidebar.classList.remove('translate-x-full');
    cartOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartSidebar.classList.add('translate-x-full');
    cartOverlay.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

cartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);
