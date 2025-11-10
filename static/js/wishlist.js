// Wishlist Management

class WishlistManager {
    constructor() {
        this.items = this.loadWishlist();
        this.updateWishlistUI();
    }

    // Load wishlist from localStorage
    loadWishlist() {
        const saved = localStorage.getItem('pandora_wishlist');
        return saved ? JSON.parse(saved) : [];
    }

    // Save wishlist to localStorage
    saveWishlist() {
        localStorage.setItem('pandora_wishlist', JSON.stringify(this.items));
    }

    // Check if product is in wishlist
    isInWishlist(productId) {
        return this.items.some(item => item.id === productId);
    }

    // Add item to wishlist
    addItem(product) {
        if (!this.isInWishlist(product.id)) {
            this.items.push(product);
            this.saveWishlist();
            this.updateWishlistUI();
            this.showNotification(`${product.name} added to wishlist`);
            return true;
        }
        return false;
    }

    // Remove item from wishlist
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveWishlist();
        this.updateWishlistUI();

        // Update heart icons on all pages
        const heartBtns = document.querySelectorAll(`.js-wishlist-btn[data-product-id="${productId}"]`);
        heartBtns.forEach(btn => {
            btn.classList.remove('text-red-500');
            btn.classList.add('text-gray-400');
        });

        // If on wishlist page, refresh the display
        if (window.location.pathname.includes('wishlist.html')) {
            this.displayWishlistItems();
        }
    }

    // Toggle wishlist item
    toggleItem(product) {
        if (this.isInWishlist(product.id)) {
            this.removeItem(product.id);
            return false;
        } else {
            this.addItem(product);
            return true;
        }
    }

    // Move item to cart
    moveToCart(productId) {
        const product = this.items.find(item => item.id === productId);
        if (product && typeof cart !== 'undefined') {
            cart.addItem(product);
            this.removeItem(productId);
            this.showNotification(`${product.name} moved to cart`);
        }
    }

    // Get wishlist count
    getItemCount() {
        return this.items.length;
    }

    // Update wishlist UI
    updateWishlistUI() {
        // Update wishlist count badge
        const wishlistCount = document.getElementById('wishlistCount');
        if (wishlistCount) {
            wishlistCount.textContent = this.getItemCount();
        }

        // Update heart icons
        const heartBtns = document.querySelectorAll('.js-wishlist-btn');
        heartBtns.forEach(btn => {
            const productId = parseInt(btn.dataset.productId);
            if (this.isInWishlist(productId)) {
                btn.classList.remove('text-gray-400');
                btn.classList.add('text-red-500');
            } else {
                btn.classList.remove('text-red-500');
                btn.classList.add('text-gray-400');
            }
        });
    }

    // Display wishlist items (for wishlist page)
    displayWishlistItems() {
        const wishlistContainer = document.getElementById('wishlistItems');
        const emptyState = document.getElementById('emptyWishlist');

        if (!wishlistContainer) return;

        if (this.items.length === 0) {
            wishlistContainer.classList.add('hidden');
            if (emptyState) emptyState.classList.remove('hidden');
            return;
        }

        if (emptyState) emptyState.classList.add('hidden');
        wishlistContainer.classList.remove('hidden');

        wishlistContainer.innerHTML = this.items.map(product => `
            <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div class="relative overflow-hidden group">
                    <img src="${product.image}"
                         alt="${product.name}"
                         class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                         onerror="this.src='https://via.placeholder.com/500x500/D4AF37/FFFFFF?text=Jewelry'">
                    <div class="absolute top-2 right-2 bg-gold text-white text-xs font-bold px-2 py-1 rounded uppercase">
                        ${product.category.replace('s', '')}
                    </div>
                    <button onclick="wishlist.removeItem(${product.id})"
                            class="absolute top-2 left-2 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors">
                        <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
                <div class="p-5">
                    <div class="mb-3">
                        <h3 class="font-bold text-lg text-luxury mb-1 line-clamp-2">${product.name}</h3>
                        <p class="text-gray-600 text-sm line-clamp-2">${product.description}</p>
                    </div>
                    <div class="flex items-center justify-between mb-4">
                        <span class="text-2xl font-bold text-gold">$${product.price.toFixed(2)}</span>
                        <span class="text-xs text-gray-500 uppercase tracking-wider">${product.material}</span>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="wishlist.moveToCart(${product.id})"
                                class="flex-1 bg-gold hover:bg-dark-gold text-white font-semibold py-3 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                            </svg>
                            Move to Cart
                        </button>
                        <button onclick="wishlist.removeItem(${product.id})"
                                class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-3 rounded-lg transition-colors duration-300">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
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

// Initialize wishlist
const wishlist = new WishlistManager();

// Function to toggle wishlist for a product
function toggleWishlist(productId) {
    // Find product in allProducts array
    if (typeof allProducts !== 'undefined') {
        const product = allProducts.find(p => p.id === productId);
        if (product) {
            const isAdded = wishlist.toggleItem(product);

            // Update the button appearance
            const heartBtns = document.querySelectorAll(`.js-wishlist-btn[data-product-id="${productId}"]`);
            heartBtns.forEach(btn => {
                if (isAdded) {
                    btn.classList.remove('text-gray-400');
                    btn.classList.add('text-red-500');
                } else {
                    btn.classList.remove('text-red-500');
                    btn.classList.add('text-gray-400');
                }
            });
        }
    }
}
