"""API route handlers for the Steep House tea e-commerce backend.

This module defines all FastAPI routes mounted under the ``/api`` prefix.
Routes cover health checks, product listing and filtering, product search,
single-product lookup, category browsing, and per-category customization
configuration retrieval.

Constants:
    VALID_CATEGORIES: Allowed tea category values.
    VALID_MATERIALS: Allowed tea origin/material values.
"""

from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query

from app.customization_config import (
    ProductCustomizationConfig,
    get_customization_config,
)
from app.mock_data import get_all_products, get_product_by_id, get_products_by_category
from app.models import Product

router = APIRouter()

VALID_CATEGORIES = ["black", "green", "oolong", "herbal"]
VALID_MATERIALS = ["China", "Japan", "India", "Taiwan"]


def validate_product_query_params(
    category: Optional[str],
    material: Optional[str],
) -> None:
    """Validate category and material query parameters against allowed values.

    Args:
        category (Optional[str]): Tea category to validate. Must be one of
            VALID_CATEGORIES if provided.
        material (Optional[str]): Tea origin to validate. Must be one of
            VALID_MATERIALS if provided.

    Returns:
        None

    Raises:
        HTTPException: 400 status if category or material is not in the
            allowed values list.

    Example:
        >>> validate_product_query_params("green", "Japan")  # no error
        >>> validate_product_query_params("invalid", None)
        # raises HTTPException(status_code=400, ...)
    """
    if category and category not in VALID_CATEGORIES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid category. Must be one of: {', '.join(VALID_CATEGORIES)}",
        )
    if material and material not in VALID_MATERIALS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid origin. Must be one of: {', '.join(VALID_MATERIALS)}",
        )


@router.get("/health")
def health_check():
    """Return the current health status of the API.

    Returns:
        dict: A mapping with a single key ``status`` set to ``"ok"`` when
            the service is running normally.

    Example:
        >>> response = client.get("/api/health")
        >>> response.status_code
        200
        >>> response.json()
        {"status": "ok"}
    """
    return {"status": "ok"}


# Following AIP rules for validation and error handling
@router.get("/products", response_model=List[Product])
async def get_products(
    category: Optional[str] = Query(
        None, description="Filter by category: black, green, oolong, herbal"
    ),
    price_max: Optional[int] = Query(
        None, description="Filter by max price"
    ),
    material: Optional[str] = Query(
        None, description="Filter by origin: China, Japan, India, Taiwan"
    ),
    name: Optional[str] = Query(
        None, description="Filter by product name (case-insensitive partial match)"
    ),
):
    """Get all products with optional filters.

    Applies zero or more filters to the full product catalogue and returns
    the matching subset. All filter parameters are optional; omitting them
    returns the complete product list.

    Args:
        category (Optional[str]): Restrict results to this tea category.
            Must be one of ``black``, ``green``, ``oolong``, or ``herbal``.
        price_max (Optional[int]): Upper price bound (inclusive). Products
            with a price greater than this value are excluded.
        material (Optional[str]): Restrict results to teas originating from
            this country. Must be one of ``China``, ``Japan``, ``India``, or
            ``Taiwan``.
        name (Optional[str]): Case-insensitive substring match against
            product names.

    Returns:
        List[Product]: The filtered list of products. May be empty if no
            products match the supplied filters.

    Raises:
        HTTPException: 400 status if ``category`` or ``material`` is not in
            the respective allowed-values list.

    Example:
        >>> response = client.get("/api/products?category=green")
        >>> response.status_code
        200
        >>> [p["category"] for p in response.json()]
        ['green', 'green', ...]
    """
    validate_product_query_params(category, material)

    products = get_all_products()

    if category:
        products = [p for p in products if p.category == category]

    if price_max:
        products = [p for p in products if p.price <= price_max]

    if material:
        products = [p for p in products if p.material == material]

    if name:
        products = [p for p in products if name.lower() in p.name.lower()]

    return products


# Following AIP rules for validation and error handling
@router.get("/products/search", response_model=List[Product])
async def search_products(
    q: str = Query(..., description="Search query to match against product names"),
):
    """Search products by name using a free-text query string.

    Performs a case-insensitive substring search across all product names
    and returns every product whose name contains the query term.

    Args:
        q (str): The search term. Must be a non-empty string. Matched
            case-insensitively against each product's name.

    Returns:
        List[Product]: Products whose names contain ``q`` as a substring.
            Returns an empty list when no products match.

    Raises:
        HTTPException: 422 status (FastAPI default) if ``q`` is not provided.

    Example:
        >>> response = client.get("/api/products/search?q=earl")
        >>> response.status_code
        200
        >>> response.json()[0]["name"]
        'Earl Grey'
    """
    products = get_all_products()
    return [p for p in products if q.lower() in p.name.lower()]


# Following AIP rules for validation and error handling
@router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: int):
    """Get a specific product by its unique integer ID.

    Args:
        product_id (int): The unique identifier of the product to retrieve.

    Returns:
        Product: The product record matching the supplied ID.

    Raises:
        HTTPException: 404 status if no product exists with the given ID.

    Example:
        >>> response = client.get("/api/products/1")
        >>> response.status_code
        200
        >>> response.json()["id"]
        1
    """
    product = get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


# Following AIP rules for validation and error handling
@router.get("/products/category/{category}", response_model=List[Product])
async def get_products_in_category(category: str):
    """Get all products belonging to a specific tea category.

    Args:
        category (str): The tea category to retrieve. Must be one of
            ``black``, ``green``, ``oolong``, or ``herbal``.

    Returns:
        List[Product]: All products in the specified category. May be an
            empty list if the category contains no products.

    Raises:
        HTTPException: 400 status if ``category`` is not a recognised value.

    Example:
        >>> response = client.get("/api/products/category/herbal")
        >>> response.status_code
        200
        >>> all(p["category"] == "herbal" for p in response.json())
        True
    """
    validate_product_query_params(category, None)
    return get_products_by_category(category)


# Following AIP rules for validation and error handling
@router.get(
    "/customization-config/{category}", response_model=ProductCustomizationConfig
)
async def get_customization_configuration(category: str):
    """Get customization configuration for a product category.

    Returns all available customization options with pricing for the
    specified category, including options such as brew temperature, steep
    time, and add-ons relevant to that tea type.

    Args:
        category (str): The tea category whose customization options should
            be returned. Must be one of ``black``, ``green``, ``oolong``, or
            ``herbal``.

    Returns:
        ProductCustomizationConfig: The customization configuration object
            containing all available options and their associated prices for
            the given category.

    Raises:
        HTTPException: 400 status if ``category`` is not a recognised value.
        HTTPException: 404 status if no customization configuration exists
            for the given category.

    Example:
        >>> response = client.get("/api/customization-config/green")
        >>> response.status_code
        200
        >>> "options" in response.json()
        True
    """
    validate_product_query_params(category, None)

    config = get_customization_config(category)
    if not config:
        raise HTTPException(
            status_code=404,
            detail=f"Customization configuration not found for category: {category}",
        )

    return config
