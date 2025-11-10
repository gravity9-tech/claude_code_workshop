from typing import Literal

from pydantic import BaseModel, Field


class Product(BaseModel):
    """Jewelry product model"""

    id: int = Field(..., description="Unique product identifier")
    name: str = Field(..., min_length=1, description="Product name")
    price: float = Field(..., gt=0, description="Product price in USD")
    category: Literal["rings", "necklaces", "bracelets"] = Field(
        ..., description="Product category"
    )
    material: Literal["Silver", "Gold", "Rose Gold", "White Gold"] = Field(
        ..., description="Product material"
    )
    image: str = Field(..., description="Product image URL")
    description: str = Field(..., min_length=1, description="Product description")
    customizable: bool = Field(
        False, description="Whether product supports customization"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "name": "Diamond Solitaire Ring",
                "price": 2499.99,
                "category": "rings",
                "image": "/static/images/jewelry/ring1.jpg",
                "description": "Elegant 18k white gold ring with 1ct diamond",
            }
        }
