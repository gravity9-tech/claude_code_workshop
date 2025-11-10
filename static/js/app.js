// Main Application Logic

let allProducts = [];
let currentFilters = {
    category: 'all',
    price: 'all',
    material: 'all'
};

// Mobile menu controls
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

function closeMobileMenu() {
    mobileMenu.classList.add('hidden');
}

// Fetch products from API with filters
async function fetchProducts() {
    try {
        let url = '/api/products';
        const params = new URLSearchParams();
        
        if (currentFilters.category !== 'all') {
            params.append('category', currentFilters.category);
        }
        if (currentFilters.price !== 'all') {
            params.append('price_max', currentFilters.price);
        }
        if (currentFilters.material !== 'all') {
            params.append('material', currentFilters.material);
        }
        
        if (params.toString()) {
            url += '?' + params.toString();
        }
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const products = await response.json();
        displayProducts(products);
        updateResultCounter(products.length);
    } catch (error) {
        console.error('Error fetching products:', error);
        showError('Failed to load products. Please try again later.');
    }
}

async function fetchAllProducts() {
    try {
        const response = await fetch('/api/products');
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        allProducts = await response.json();
        document.getElementById('totalCount').textContent = allProducts.length;
    } catch (error) {
        console.error('Error fetching all products:', error);
    }
}

// Display products in grid
function displayProducts(products) {
    const loading = document.getElementById('loading');
    const productGrid = document.getElementById('productGrid');
    const noResults = document.getElementById('noResults');

    loading.classList.add('hidden');

    if (products.length === 0) {
        productGrid.classList.add('hidden');
        noResults.classList.remove('hidden');
        return;
    }

    noResults.classList.add('hidden');
    productGrid.classList.remove('hidden');

    productGrid.innerHTML = products.map(product => {
        const isInWishlist = wishlist.isInWishlist(product.id);
        return `
        <div class="product-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div class="relative overflow-hidden group">
                <img src="${product.image}"
                     alt="${product.name}"
                     class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                     onerror="this.src='https://via.placeholder.com/500x500/D4AF37/FFFFFF?text=Jewelry'">
                <div class="absolute top-2 right-2 bg-gold text-white text-xs font-bold px-2 py-1 rounded uppercase">
                    ${product.category.replace('s', '')}
                </div>
                <button onclick="toggleWishlist(${product.id})"
                        data-product-id="${product.id}"
                        class="js-wishlist-btn absolute top-2 left-2 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-all ${isInWishlist ? 'text-red-500' : 'text-gray-400'}">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
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
                ${product.customizable ? `
                    <button onclick="openCustomization(${product.id})"
                            class="w-full bg-gold hover:bg-dark-gold text-white font-semibold py-3 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 mb-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        Customize
                    </button>
                    <button onclick="addToCart(${product.id})"
                            class="w-full bg-luxury hover:bg-gray-800 text-white font-semibold py-2 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 text-sm">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                        </svg>
                        Add Standard
                    </button>
                ` : `
                    <button onclick="addToCart(${product.id})"
                            class="w-full bg-luxury hover:bg-gold text-white font-semibold py-3 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                        </svg>
                        Add to Cart
                    </button>
                `}
            </div>
        </div>
    `;
    }).join('');
}

// Update result counter
function updateResultCounter(count) {
    document.getElementById('resultCount').textContent = count;
}

// Update URL with current filters
function updateURL() {
    const params = new URLSearchParams();
    
    if (currentFilters.category !== 'all') {
        params.append('category', currentFilters.category);
    }
    if (currentFilters.price !== 'all') {
        params.append('price', currentFilters.price);
    }
    if (currentFilters.material !== 'all') {
        params.append('material', currentFilters.material);
    }
    
    const newURL = params.toString() ? `?${params.toString()}` : window.location.pathname;
    window.history.replaceState({}, '', newURL);
}

function loadFiltersFromURL() {
    const params = new URLSearchParams(window.location.search);
    
    if (params.has('category')) {
        currentFilters.category = params.get('category');
        document.getElementById('categoryFilter').value = currentFilters.category;
    }
    
    if (params.has('price')) {
        currentFilters.price = params.get('price');
        document.getElementById('priceFilter').value = currentFilters.price;
    }
    
    if (params.has('material')) {
        currentFilters.material = params.get('material');
        document.getElementById('materialFilter').value = currentFilters.material;
    }
}

function applyFilters() {
    updateURL();
    fetchProducts();
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.classList.remove('text-gold', 'font-bold');
    });
    
    if (currentFilters.category !== 'all') {
        const activeButtons = Array.from(filterButtons).filter(btn =>
            btn.textContent.toLowerCase().includes(currentFilters.category)
        );
        activeButtons.forEach(btn => {
            btn.classList.add('text-gold', 'font-bold');
        });
    } else {
        const allButtons = Array.from(filterButtons).filter(btn =>
            btn.textContent.toLowerCase().includes('all')
        );
        allButtons.forEach(btn => {
            btn.classList.add('text-gold', 'font-bold');
        });
    }
}

// Filter products by category (for header buttons)
function filterProducts(category) {
    currentFilters.category = category;
    document.getElementById('categoryFilter').value = category;
    applyFilters();
    document.getElementById('productGrid').scrollIntoView({ behavior: 'smooth' });
}

// Add product to cart
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
        cart.addItem(product);
    }
}

// Open customization modal
function openCustomization(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (product && product.customizable) {
        openCustomizationModal(product);
    } else {
        showError('This product is not available for customization');
    }
}

// Show error message
function showError(message) {
    const loading = document.getElementById('loading');
    loading.innerHTML = `
        <div class="text-center text-red-600">
            <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-lg font-semibold">${message}</p>
        </div>
    `;
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    fetchAllProducts();
    loadFiltersFromURL();
    fetchProducts();

    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const materialFilter = document.getElementById('materialFilter');
    const clearFiltersBtn = document.getElementById('clearFilters');

    categoryFilter.addEventListener('change', (e) => {
        currentFilters.category = e.target.value;
        applyFilters();
    });

    priceFilter.addEventListener('change', (e) => {
        currentFilters.price = e.target.value;
        applyFilters();
    });

    materialFilter.addEventListener('change', (e) => {
        currentFilters.material = e.target.value;
        applyFilters();
    });

    clearFiltersBtn.addEventListener('click', () => {
        currentFilters.category = 'all';
        currentFilters.price = 'all';
        currentFilters.material = 'all';
        
        categoryFilter.value = 'all';
        priceFilter.value = 'all';
        materialFilter.value = 'all';
        
        applyFilters();
    });

    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.classList.remove('text-gold', 'font-bold');
    });
    
    const allButtons = Array.from(filterButtons).filter(btn =>
        btn.textContent.toLowerCase().includes('all')
    );
    allButtons.forEach(btn => {
        btn.classList.add('text-gold', 'font-bold');
    });
});
