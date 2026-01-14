from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


class TestProductAPI:
    """Test cases for Product API endpoints"""

    def test_get_all_products(self):
        """Test GET /api/products returns all products"""
        response = client.get("/api/products")
        assert response.status_code == 200
        products = response.json()
        assert isinstance(products, list)
        assert len(products) == 15  # We have 15 mock products
        assert all("id" in p and "name" in p and "price" in p for p in products)

    def test_get_product_by_id(self):
        """Test GET /api/products/{id} returns specific product"""
        response = client.get("/api/products/1")
        assert response.status_code == 200
        product = response.json()
        assert product["id"] == 1
        assert "name" in product
        assert "price" in product
        assert "category" in product
        assert "image" in product
        assert "description" in product

    def test_get_nonexistent_product(self):
        """Test GET /api/products/{id} with invalid id returns 404"""
        response = client.get("/api/products/999")
        assert response.status_code == 404
        assert response.json()["detail"] == "Product not found"

    def test_get_products_by_category_rings(self):
        """Test GET /api/products/category/rings"""
        response = client.get("/api/products/category/rings")
        assert response.status_code == 200
        products = response.json()
        assert isinstance(products, list)
        assert all(p["category"] == "rings" for p in products)
        assert len(products) > 0

    def test_get_products_by_category_necklaces(self):
        """Test GET /api/products/category/necklaces"""
        response = client.get("/api/products/category/necklaces")
        assert response.status_code == 200
        products = response.json()
        assert isinstance(products, list)
        assert all(p["category"] == "necklaces" for p in products)
        assert len(products) > 0

    def test_get_products_by_category_bracelets(self):
        """Test GET /api/products/category/bracelets"""
        response = client.get("/api/products/category/bracelets")
        assert response.status_code == 200
        products = response.json()
        assert isinstance(products, list)
        assert all(p["category"] == "bracelets" for p in products)
        assert len(products) > 0

    def test_get_products_invalid_category(self):
        """Test GET /api/products/category/{category} with invalid category"""
        response = client.get("/api/products/category/invalid")
        assert response.status_code == 400
        assert "Invalid category" in response.json()["detail"]

    def test_product_schema(self):
        """Test that product response matches expected schema"""
        response = client.get("/api/products/1")
        product = response.json()

        # Check all required fields exist
        required_fields = [
            "id",
            "name",
            "price",
            "category",
            "material",
            "image",
            "description",
        ]
        for field in required_fields:
            assert field in product

        # Check data types
        assert isinstance(product["id"], int)
        assert isinstance(product["name"], str)
        assert isinstance(product["price"], (int, float))
        assert isinstance(product["category"], str)
        assert isinstance(product["material"], str)
        assert isinstance(product["image"], str)
        assert isinstance(product["description"], str)

        # Check category is valid
        assert product["category"] in ["rings", "necklaces", "bracelets"]

        assert product["material"] in ["Silver", "Gold", "Rose Gold", "White Gold"]

        # Check price is positive
        assert product["price"] > 0

    def test_category_distribution(self):
        """Test that we have products in all categories"""
        response = client.get("/api/products")
        products = response.json()

        categories = set(p["category"] for p in products)
        assert "rings" in categories
        assert "necklaces" in categories
        assert "bracelets" in categories

    def test_material_distribution(self):
        """Test that we have products in all materials"""
        response = client.get("/api/products")
        products = response.json()

        materials = set(p["material"] for p in products)
        assert "Silver" in materials
        assert "Gold" in materials
        assert "Rose Gold" in materials
        assert "White Gold" in materials

    def test_filter_by_category(self):
        """Test filtering products by category"""
        response = client.get("/api/products?category=rings")
        assert response.status_code == 200
        products = response.json()
        assert all(p["category"] == "rings" for p in products)
        assert len(products) > 0

    def test_filter_by_price(self):
        """Test filtering products by max price"""
        response = client.get("/api/products?price_max=1000")
        assert response.status_code == 200
        products = response.json()
        assert all(p["price"] <= 1000 for p in products)
        assert len(products) > 0

    def test_filter_by_material(self):
        """Test filtering products by material"""
        response = client.get("/api/products?material=Gold")
        assert response.status_code == 200
        products = response.json()
        assert all(p["material"] == "Gold" for p in products)
        assert len(products) > 0

    def test_filter_multi_parameter(self):
        """Test filtering with multiple parameters"""
        response = client.get(
            "/api/products?category=rings&price_max=1000&material=Gold"
        )
        assert response.status_code == 200
        products = response.json()
        assert all(
            p["category"] == "rings" and p["price"] <= 1000 and p["material"] == "Gold"
            for p in products
        )

    def test_filter_invalid_category(self):
        """Test filtering with invalid category returns 400"""
        response = client.get("/api/products?category=invalid")
        assert response.status_code == 400
        assert "Invalid category" in response.json()["detail"]

    def test_filter_invalid_price(self):
        """Test filtering with invalid price returns 400"""
        response = client.get("/api/products?price_max=999")
        assert response.status_code == 400
        assert "Invalid price_max" in response.json()["detail"]

    def test_filter_invalid_material(self):
        """Test filtering with invalid material returns 400"""
        response = client.get("/api/products?material=Platinum")
        assert response.status_code == 400
        assert "Invalid material" in response.json()["detail"]

    def test_filter_no_results(self):
        """Test filtering that returns no results"""
        response = client.get("/api/products?category=necklaces&material=Silver")
        assert response.status_code == 200
        products = response.json()
        assert products == []
