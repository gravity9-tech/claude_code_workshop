from app.models import Product

# Mock product data for luxury jewelry showcase
PRODUCTS = [
    Product(
        id=1,
        name="Eternal Brilliance Diamond Ring",
        price=3299.00,
        category="rings",
        material="White Gold",
        image="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500",
        description="Exquisite 18k white gold ring featuring a stunning 1.5ct round brilliant diamond.",
        customizable=True,
    ),
    Product(
        id=2,
        name="Rose Gold Engagement Ring",
        price=899.00,
        category="rings",
        material="Rose Gold",
        image="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500",
        description="Romantic 14k rose gold ring with delicate pavé diamonds and center stone.",
        customizable=True,
    ),
    Product(
        id=3,
        name="Vintage Emerald Ring",
        price=1299.00,
        category="rings",
        material="Gold",
        image="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500",
        description="Art deco inspired 18k yellow gold ring with natural emerald and diamond accents.",
    ),
    Product(
        id=4,
        name="Sapphire Eternity Band",
        price=450.00,
        category="rings",
        material="Silver",
        image="https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=500",
        description="Classic platinum eternity band adorned with vibrant blue sapphires.",
    ),
    Product(
        id=5,
        name="Diamond Tennis Necklace",
        price=8999.00,
        category="necklaces",
        material="White Gold",
        image="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500",
        description="Timeless 18k white gold tennis necklace with 5 carats of brilliant diamonds.",
    ),
    Product(
        id=6,
        name="Pearl Cascade Necklace",
        price=750.00,
        category="necklaces",
        material="Gold",
        image="https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500",
        description="Elegant South Sea pearl necklace with 14k gold clasp and accents.",
        customizable=True,
    ),
    Product(
        id=7,
        name="Emerald Drop Necklace",
        price=1650.00,
        category="necklaces",
        material="Gold",
        image="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500",
        description="Sophisticated 18k yellow gold necklace featuring a stunning emerald pendant.",
        customizable=True,
    ),
    Product(
        id=8,
        name="Gold Chain Statement Necklace",
        price=350.00,
        category="necklaces",
        material="Gold",
        image="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500",
        description="Bold 14k gold chain necklace with modern geometric design.",
    ),
    Product(
        id=9,
        name="Diamond Tennis Bracelet",
        price=4299.00,
        category="bracelets",
        material="White Gold",
        image="https://images.unsplash.com/photo-1611955167811-4711904bb9f8?w=500",
        description="Classic 18k white gold tennis bracelet with 3 carats of diamonds.",
    ),
    Product(
        id=10,
        name="Rose Gold Bangle Set",
        price=950.00,
        category="bracelets",
        material="Rose Gold",
        image="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500",
        description="Set of three delicate 14k rose gold bangles with diamond accents.",
        customizable=True,
    ),
    Product(
        id=11,
        name="Sapphire Link Bracelet",
        price=1850.00,
        category="bracelets",
        material="Silver",
        image="https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=500",
        description="Luxurious platinum bracelet featuring alternating sapphires and diamonds.",
        customizable=True,
    ),
    Product(
        id=12,
        name="Gold Cuff Bracelet",
        price=650.00,
        category="bracelets",
        material="Gold",
        image="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500",
        description="Modern 18k yellow gold cuff with intricate hand-engraved details.",
    ),
    Product(
        id=13,
        name="Ruby Heart Necklace",
        price=1150.00,
        category="necklaces",
        material="White Gold",
        image="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500",
        description="Romantic 18k white gold necklace with heart-shaped ruby and diamond halo.",
    ),
    Product(
        id=14,
        name="Champagne Diamond Ring",
        price=550.00,
        category="rings",
        material="Rose Gold",
        image="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500",
        description="Unique 14k rose gold ring featuring a rare champagne diamond center stone.",
    ),
    Product(
        id=15,
        name="Pearl Bangle Bracelet",
        price=425.00,
        category="bracelets",
        material="Gold",
        image="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500",
        description="Elegant 14k gold bangle adorned with freshwater pearls.",
    ),
]


def get_all_products():
    """Get all products"""
    return PRODUCTS


def get_product_by_id(product_id: int):
    """Get a product by its ID"""
    for product in PRODUCTS:
        if product.id == product_id:
            return product
    return None


def get_products_by_category(category: str):
    """Get all products in a specific category"""
    return [product for product in PRODUCTS if product.category == category]
