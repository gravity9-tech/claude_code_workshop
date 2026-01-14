"""
Tests for customization API endpoints
"""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


class TestCustomizationAPI:
    """Test customization endpoints"""

    def test_get_customization_config_rings(self):
        """Test getting customization options for rings"""
        response = client.get("/api/customization-config/rings")
        assert response.status_code == 200
        config = response.json()
        assert config["category"] == "rings"
        assert len(config["options"]) > 0

        # Check metal_type option exists
        metal_option = next(
            (opt for opt in config["options"] if opt["option_id"] == "metal_type"), None
        )
        assert metal_option is not None
        assert metal_option["required"] is True
        assert len(metal_option["values"]) == 4  # Silver, Gold, Rose Gold, Platinum

    def test_get_customization_config_necklaces(self):
        """Test getting customization options for necklaces"""
        response = client.get("/api/customization-config/necklaces")
        assert response.status_code == 200
        config = response.json()
        assert config["category"] == "necklaces"

        # Check chain_length option exists
        chain_option = next(
            (opt for opt in config["options"] if opt["option_id"] == "chain_length"),
            None,
        )
        assert chain_option is not None
        assert len(chain_option["values"]) == 5  # 16", 18", 20", 22", 24"

    def test_get_customization_config_bracelets(self):
        """Test getting customization options for bracelets"""
        response = client.get("/api/customization-config/bracelets")
        assert response.status_code == 200
        config = response.json()
        assert config["category"] == "bracelets"

        # Check charms option exists
        charms_option = next(
            (opt for opt in config["options"] if opt["option_id"] == "charms"), None
        )
        assert charms_option is not None
        assert charms_option["option_type"] == "multi_select"

    def test_get_customization_config_invalid_category(self):
        """Test error when category is invalid"""
        response = client.get("/api/customization-config/invalid")
        assert response.status_code == 400
        error = response.json()
        assert "Invalid category" in error["detail"]

    def test_price_modifiers_present(self):
        """Test that all options have price modifiers"""
        response = client.get("/api/customization-config/rings")
        config = response.json()

        for option in config["options"]:
            if option["values"]:  # If option has values
                for value in option["values"]:
                    assert "price_modifier" in value
                    assert isinstance(value["price_modifier"], (int, float))

    def test_engraving_validation_rules(self):
        """Test that engraving options have validation rules"""
        categories = ["rings", "necklaces", "bracelets"]
        expected_max_lengths = {"rings": 20, "necklaces": 15, "bracelets": 10}

        for category in categories:
            response = client.get(f"/api/customization-config/{category}")
            config = response.json()

            engraving_option = next(
                (opt for opt in config["options"] if opt["option_id"] == "engraving"),
                None,
            )
            assert engraving_option is not None
            assert engraving_option["option_type"] == "text"
            assert "validation_rules" in engraving_option
            assert (
                engraving_option["validation_rules"]["max_length"]
                == expected_max_lengths[category]
            )


class TestCustomizableProducts:
    """Test that products have customizable flag"""

    def test_product_has_customizable_field(self):
        """Test that products include customizable field"""
        response = client.get("/api/products")
        assert response.status_code == 200
        products = response.json()

        # All products should have customizable field
        for product in products:
            assert "customizable" in product
            assert isinstance(product["customizable"], bool)

    def test_some_products_are_customizable(self):
        """Test that at least some products are marked as customizable"""
        response = client.get("/api/products")
        products = response.json()

        customizable_products = [p for p in products if p.get("customizable", False)]
        assert len(customizable_products) >= 6  # We marked 6 products as customizable

    def test_customizable_products_per_category(self):
        """Test that each category has at least 2 customizable products"""
        categories = ["rings", "necklaces", "bracelets"]

        for category in categories:
            response = client.get(f"/api/products?category={category}")
            products = response.json()

            customizable_count = sum(
                1 for p in products if p.get("customizable", False)
            )
            assert (
                customizable_count >= 2
            ), f"Category {category} should have at least 2 customizable products"

    def test_specific_customizable_products(self):
        """Test that specific products are marked as customizable"""
        customizable_ids = [1, 2, 6, 7, 10, 11]  # IDs we marked as customizable

        for product_id in customizable_ids:
            response = client.get(f"/api/products/{product_id}")
            assert response.status_code == 200
            product = response.json()
            assert (
                product["customizable"] is True
            ), f"Product {product_id} should be customizable"
