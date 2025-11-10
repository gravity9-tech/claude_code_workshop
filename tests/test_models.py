import pytest
from pydantic import ValidationError

from app.models import Product


class TestProductModel:
    """Test cases for Product model"""

    def test_valid_product(self):
        """Test creating a valid product"""
        product = Product(
            id=1,
            name="Diamond Ring",
            price=2999.99,
            category="rings",
            material="White Gold",
            image="https://example.com/ring.jpg",
            description="Beautiful diamond ring",
        )
        assert product.id == 1
        assert product.name == "Diamond Ring"
        assert product.price == 2999.99
        assert product.category == "rings"
        assert product.material == "White Gold"

    def test_invalid_category(self):
        """Test that invalid category raises validation error"""
        with pytest.raises(ValidationError):
            Product(
                id=1,
                name="Invalid Product",
                price=100.0,
                category="invalid_category",
                material="Gold",
                image="https://example.com/image.jpg",
                description="Test description",
            )

    def test_negative_price(self):
        """Test that negative price raises validation error"""
        with pytest.raises(ValidationError):
            Product(
                id=1,
                name="Invalid Product",
                price=-100.0,
                category="rings",
                material="Gold",
                image="https://example.com/image.jpg",
                description="Test description",
            )

    def test_zero_price(self):
        """Test that zero price raises validation error"""
        with pytest.raises(ValidationError):
            Product(
                id=1,
                name="Invalid Product",
                price=0,
                category="rings",
                material="Gold",
                image="https://example.com/image.jpg",
                description="Test description",
            )

    def test_empty_name(self):
        """Test that empty name raises validation error"""
        with pytest.raises(ValidationError):
            Product(
                id=1,
                name="",
                price=100.0,
                category="rings",
                material="Gold",
                image="https://example.com/image.jpg",
                description="Test description",
            )

    def test_empty_description(self):
        """Test that empty description raises validation error"""
        with pytest.raises(ValidationError):
            Product(
                id=1,
                name="Test Product",
                price=100.0,
                category="rings",
                material="Gold",
                image="https://example.com/image.jpg",
                description="",
            )

    def test_all_valid_categories(self):
        """Test all valid categories"""
        valid_categories = ["rings", "necklaces", "bracelets"]
        for category in valid_categories:
            product = Product(
                id=1,
                name="Test Product",
                price=100.0,
                category=category,
                material="Gold",
                image="https://example.com/image.jpg",
                description="Test description",
            )
            assert product.category == category

    def test_all_valid_materials(self):
        """Test all valid materials"""
        valid_materials = ["Silver", "Gold", "Rose Gold", "White Gold"]
        for material in valid_materials:
            product = Product(
                id=1,
                name="Test Product",
                price=100.0,
                category="rings",
                material=material,
                image="https://example.com/image.jpg",
                description="Test description",
            )
            assert product.material == material

    def test_invalid_material(self):
        """Test that invalid material raises validation error"""
        with pytest.raises(ValidationError):
            Product(
                id=1,
                name="Invalid Product",
                price=100.0,
                category="rings",
                material="Platinum",
                image="https://example.com/image.jpg",
                description="Test description",
            )
