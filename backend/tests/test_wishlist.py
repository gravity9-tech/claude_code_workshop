"""
Frontend integration tests for Wishlist functionality

These tests verify the wishlist feature works correctly with the backend API.
The wishlist itself is client-side (localStorage), but it depends on product data from the API.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


class TestWishlistIntegration:
    """Integration tests for wishlist feature with backend API"""

    def test_wishlist_page_loads(self):
        """Test that the wishlist HTML page loads successfully"""
        response = client.get("/wishlist.html")
        assert response.status_code == 200
        assert b"My Wishlist" in response.content
        assert b"wishlist.js" in response.content

    def test_wishlist_page_has_cart_script(self):
        """Test that wishlist page includes cart.js for move-to-cart functionality"""
        response = client.get("/wishlist.html")
        assert response.status_code == 200
        assert b"cart.js" in response.content

    def test_wishlist_uses_products_api(self):
        """Test that wishlist page references the products API endpoint"""
        response = client.get("/wishlist.html")
        assert response.status_code == 200
        assert b"/api/products" in response.content

    def test_products_api_available_for_wishlist(self):
        """Test that products API is available for wishlist to fetch product data"""
        response = client.get("/api/products")
        assert response.status_code == 200
        products = response.json()
        assert len(products) > 0

        # Verify product structure contains fields needed by wishlist
        first_product = products[0]
        required_fields = ["id", "name", "price", "category", "material", "image", "description"]
        for field in required_fields:
            assert field in first_product

    def test_wishlist_can_fetch_specific_products(self):
        """Test that wishlist can fetch specific product details by ID"""
        # First get all products to find valid IDs
        response = client.get("/api/products")
        products = response.json()
        product_id = products[0]["id"]

        # Test fetching specific product
        response = client.get(f"/api/products/{product_id}")
        assert response.status_code == 200
        product = response.json()
        assert product["id"] == product_id
        assert all(field in product for field in ["name", "price", "image", "description"])

    def test_wishlist_static_assets_available(self):
        """Test that wishlist.js static file is served correctly"""
        response = client.get("/static/js/wishlist.js")
        assert response.status_code == 200
        assert b"WishlistManager" in response.content
        assert b"localStorage" in response.content

    def test_wishlist_page_has_empty_state(self):
        """Test that wishlist page includes empty state UI"""
        response = client.get("/wishlist.html")
        assert response.status_code == 200
        assert b"emptyWishlist" in response.content
        assert b"Your wishlist is empty" in response.content

    def test_wishlist_page_has_wishlist_container(self):
        """Test that wishlist page has container for wishlist items"""
        response = client.get("/wishlist.html")
        assert response.status_code == 200
        assert b"wishlistItems" in response.content

    def test_wishlist_page_has_counter(self):
        """Test that wishlist page includes wishlist counter badge"""
        response = client.get("/wishlist.html")
        assert response.status_code == 200
        assert b"wishlistCount" in response.content

    def test_products_have_valid_images(self):
        """Test that products have image URLs for wishlist display"""
        response = client.get("/api/products")
        products = response.json()

        for product in products:
            assert "image" in product
            assert isinstance(product["image"], str)
            assert len(product["image"]) > 0

    def test_products_have_all_display_fields(self):
        """Test that products have all fields needed for wishlist display"""
        response = client.get("/api/products")
        products = response.json()

        display_fields = ["id", "name", "price", "category", "material", "description", "image"]

        for product in products:
            for field in display_fields:
                assert field in product, f"Product {product.get('id')} missing {field}"
                assert product[field] is not None, f"Product {product.get('id')} has null {field}"

    def test_wishlist_page_responsive_design(self):
        """Test that wishlist page includes responsive grid classes"""
        response = client.get("/wishlist.html")
        assert response.status_code == 200
        content = response.content.decode()

        # Check for responsive grid classes
        assert "grid-cols-1" in content or "sm:grid-cols-2" in content
        assert "lg:grid-cols-3" in content or "xl:grid-cols-4" in content

    def test_wishlist_integration_with_cart(self):
        """Test that wishlist page can integrate with cart for move-to-cart feature"""
        response = client.get("/wishlist.html")
        assert response.status_code == 200
        content = response.content.decode()

        # Verify cart.js is included for move-to-cart functionality
        assert "cart.js" in content

        # Verify moveToCart exists in wishlist.js
        wishlist_js_response = client.get("/static/js/wishlist.js")
        assert wishlist_js_response.status_code == 200
        assert b"moveToCart" in wishlist_js_response.content

    def test_wishlist_has_remove_functionality(self):
        """Test that wishlist page includes remove item UI"""
        # Check wishlist.js has removeItem functionality
        wishlist_js_response = client.get("/static/js/wishlist.js")
        assert wishlist_js_response.status_code == 200
        assert b"removeItem" in wishlist_js_response.content

        # Verify wishlist.js is loaded on the page
        response = client.get("/wishlist.html")
        assert response.status_code == 200
        assert b"wishlist.js" in response.content

    def test_products_api_filters_work_for_wishlist(self):
        """Test that product filtering works (useful for wishlist search/filter features)"""
        # Test category filter
        response = client.get("/api/products?category=rings")
        assert response.status_code == 200
        products = response.json()
        assert all(p["category"] == "rings" for p in products)

        # Test material filter
        response = client.get("/api/products?material=Gold")
        assert response.status_code == 200
        products = response.json()
        assert all(p["material"] == "Gold" for p in products)

    def test_wishlist_can_handle_all_product_categories(self):
        """Test that all product categories can be added to wishlist"""
        categories = ["rings", "necklaces", "bracelets"]

        for category in categories:
            response = client.get(f"/api/products?category={category}")
            assert response.status_code == 200
            products = response.json()
            assert len(products) > 0, f"No products found for category: {category}"

            # Verify first product has all required fields
            first_product = products[0]
            assert first_product["category"] == category
            assert all(field in first_product for field in ["id", "name", "price", "image"])

    def test_wishlist_page_has_navigation(self):
        """Test that wishlist page has navigation links"""
        response = client.get("/wishlist.html")
        assert response.status_code == 200
        content = response.content.decode()

        # Check for navigation elements
        assert 'href="/"' in content  # Home link
        assert "PANDORA" in content  # Brand name

    def test_wishlist_page_mobile_responsive(self):
        """Test that wishlist page includes mobile menu"""
        response = client.get("/wishlist.html")
        assert response.status_code == 200
        content = response.content.decode()

        # Check for mobile menu elements
        assert "mobileMenu" in content
        assert "menuBtn" in content

    def test_wishlist_localStorage_key_documented(self):
        """Test that wishlist uses the correct localStorage key"""
        response = client.get("/static/js/wishlist.js")
        assert response.status_code == 200
        content = response.content.decode()

        # Verify localStorage key is consistent
        assert "pandora_wishlist" in content

    def test_products_price_format_for_wishlist(self):
        """Test that product prices are correctly formatted for wishlist display"""
        response = client.get("/api/products")
        products = response.json()

        for product in products:
            assert isinstance(product["price"], (int, float))
            assert product["price"] > 0
            # Price should be a reasonable value
            assert 0 < product["price"] < 100000

    def test_wishlist_supports_pwa(self):
        """Test that wishlist page supports PWA features"""
        response = client.get("/wishlist.html")
        assert response.status_code == 200
        content = response.content.decode()

        # Check for PWA elements
        assert "manifest.json" in content
        assert "serviceWorker" in content or "service-worker" in content
