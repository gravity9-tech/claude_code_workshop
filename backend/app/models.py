"""Pydantic models for the Steep House tea e-commerce API.

Defines the data shapes used for request validation and response serialization
across all API endpoints.
"""

from typing import Literal

from pydantic import BaseModel, Field


class Product(BaseModel):
    """Represents a tea product available in the Steep House store.

    Attributes:
        id (int): Unique product identifier.
        name (str): Human-readable product name (non-empty).
        price (float): Product price in USD; must be greater than zero.
        category (Literal["black", "green", "oolong", "herbal"]): Tea category.
        material (Literal["China", "Japan", "India", "Taiwan"]): Country of origin.
        image (str): URL path to the product image.
        description (str): Long-form product description (non-empty).
        customizable (bool): Whether the product supports customization options.
            Defaults to ``False``.

    Example:
        >>> product = Product(
        ...     id=1,
        ...     name="Dragon Well Green Tea",
        ...     price=34.99,
        ...     category="green",
        ...     material="China",
        ...     image="/static/images/tea/green1.jpg",
        ...     description="Premium hand-picked Longjing tea from Hangzhou",
        ... )
        >>> print(product.category)
        green
    """

    id: int = Field(..., description="Unique product identifier")
    name: str = Field(..., min_length=1, description="Product name")
    price: float = Field(..., gt=0, description="Product price in USD")
    category: Literal["black", "green", "oolong", "herbal"] = Field(
        ..., description="Product category"
    )
    material: Literal["China", "Japan", "India", "Taiwan"] = Field(
        ..., description="Tea origin"
    )
    image: str = Field(..., description="Product image URL")
    description: str = Field(..., min_length=1, description="Product description")
    customizable: bool = Field(
        False, description="Whether product supports customization"
    )

    class Config:
        """Pydantic model configuration for ``Product``.

        Provides a JSON schema example used in auto-generated OpenAPI docs.
        """

        json_schema_extra = {
            "example": {
                "id": 1,
                "name": "Dragon Well Green Tea",
                "price": 34.99,
                "category": "green",
                "image": "/static/images/tea/green1.jpg",
                "description": "Premium hand-picked Longjing tea from Hangzhou",
            }
        }
