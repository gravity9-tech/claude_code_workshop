"""
Customization Configuration
Centralized configuration for all product customization options and pricing
"""

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class CustomizationOptionValue(BaseModel):
    """Individual option value (e.g., 'Gold' or 'Size 7')"""

    value: str
    price_modifier: float = Field(
        0.0, description="Additional cost for this option in USD"
    )
    display_name: str
    description: Optional[str] = None


class CustomizationOption(BaseModel):
    """A customization category (e.g., Metal Type, Ring Size)"""

    option_id: str  # e.g., "metal_type", "ring_size"
    display_name: str
    option_type: str  # "select", "text", "number", "multi_select"
    required: bool = True
    values: List[CustomizationOptionValue] = []
    validation_rules: Optional[Dict[str, Any]] = None
    order: int = Field(1, description="Display order in UI")
    help_text: Optional[str] = None


class ProductCustomizationConfig(BaseModel):
    """Customization configuration for a product category"""

    category: str
    options: List[CustomizationOption]
    preview_template: Optional[str] = None


# Note: Requirements use £ (GBP) but the app uses $ (USD)
# For consistency, treating all prices as USD

# Rings Customization Configuration
RINGS_CONFIG = ProductCustomizationConfig(
    category="rings",
    options=[
        CustomizationOption(
            option_id="metal_type",
            display_name="Metal Type",
            option_type="select",
            required=True,
            order=1,
            help_text="Select the metal for your ring",
            values=[
                CustomizationOptionValue(
                    value="sterling_silver",
                    price_modifier=0.0,
                    display_name="Sterling Silver",
                    description="Classic and affordable",
                ),
                CustomizationOptionValue(
                    value="gold",
                    price_modifier=200.0,
                    display_name="Gold",
                    description="Timeless 18k yellow gold",
                ),
                CustomizationOptionValue(
                    value="rose_gold",
                    price_modifier=250.0,
                    display_name="Rose Gold",
                    description="Romantic 14k rose gold",
                ),
                CustomizationOptionValue(
                    value="platinum",
                    price_modifier=500.0,
                    display_name="Platinum",
                    description="Premium and durable",
                ),
            ],
        ),
        CustomizationOption(
            option_id="ring_size",
            display_name="Ring Size",
            option_type="select",
            required=True,
            order=2,
            help_text="Select your ring size (US sizing)",
            values=[
                CustomizationOptionValue(
                    value=str(size), price_modifier=0.0, display_name=f"Size {size}"
                )
                for size in [
                    4.0,
                    4.5,
                    5.0,
                    5.5,
                    6.0,
                    6.5,
                    7.0,
                    7.5,
                    8.0,
                    8.5,
                    9.0,
                    9.5,
                    10.0,
                    10.5,
                    11.0,
                    11.5,
                    12.0,
                ]
            ],
        ),
        CustomizationOption(
            option_id="gemstone",
            display_name="Gemstone",
            option_type="select",
            required=False,
            order=3,
            help_text="Add a gemstone (optional)",
            values=[
                CustomizationOptionValue(
                    value="none",
                    price_modifier=0.0,
                    display_name="No Gemstone",
                    description="Keep it simple",
                ),
                CustomizationOptionValue(
                    value="diamond",
                    price_modifier=300.0,
                    display_name="Diamond",
                    description="Classic brilliance",
                ),
                CustomizationOptionValue(
                    value="sapphire",
                    price_modifier=150.0,
                    display_name="Sapphire",
                    description="Deep blue elegance",
                ),
                CustomizationOptionValue(
                    value="emerald",
                    price_modifier=200.0,
                    display_name="Emerald",
                    description="Vibrant green",
                ),
                CustomizationOptionValue(
                    value="ruby",
                    price_modifier=180.0,
                    display_name="Ruby",
                    description="Passionate red",
                ),
            ],
        ),
        CustomizationOption(
            option_id="engraving",
            display_name="Engraving",
            option_type="text",
            required=False,
            order=4,
            help_text="Inside band, max 20 characters",
            validation_rules={
                "max_length": 20,
                "pattern": "^[a-zA-Z0-9\\s\\.\\,\\!\\?\\'\\-]*$",
                "price": 50.0,
            },
        ),
    ],
)

# Necklaces Customization Configuration
NECKLACES_CONFIG = ProductCustomizationConfig(
    category="necklaces",
    options=[
        CustomizationOption(
            option_id="metal_type",
            display_name="Metal Type",
            option_type="select",
            required=True,
            order=1,
            help_text="Select the metal for your necklace",
            values=[
                CustomizationOptionValue(
                    value="sterling_silver",
                    price_modifier=0.0,
                    display_name="Sterling Silver",
                ),
                CustomizationOptionValue(
                    value="gold", price_modifier=150.0, display_name="Gold"
                ),
                CustomizationOptionValue(
                    value="rose_gold", price_modifier=180.0, display_name="Rose Gold"
                ),
                CustomizationOptionValue(
                    value="white_gold", price_modifier=200.0, display_name="White Gold"
                ),
            ],
        ),
        CustomizationOption(
            option_id="chain_length",
            display_name="Chain Length",
            option_type="select",
            required=True,
            order=2,
            help_text="Select your preferred chain length",
            values=[
                CustomizationOptionValue(
                    value='16"', price_modifier=0.0, display_name="16 inches"
                ),
                CustomizationOptionValue(
                    value='18"', price_modifier=0.0, display_name="18 inches"
                ),
                CustomizationOptionValue(
                    value='20"', price_modifier=0.0, display_name="20 inches"
                ),
                CustomizationOptionValue(
                    value='22"', price_modifier=0.0, display_name="22 inches"
                ),
                CustomizationOptionValue(
                    value='24"', price_modifier=0.0, display_name="24 inches"
                ),
            ],
        ),
        CustomizationOption(
            option_id="pendant_option",
            display_name="Pendant Option",
            option_type="select",
            required=False,
            order=3,
            help_text="Add a special pendant (optional)",
            values=[
                CustomizationOptionValue(
                    value="none", price_modifier=0.0, display_name="No Addition"
                ),
                CustomizationOptionValue(
                    value="birthstone",
                    price_modifier=100.0,
                    display_name="Add Birthstone",
                ),
                CustomizationOptionValue(
                    value="initials", price_modifier=75.0, display_name="Add Initials"
                ),
            ],
        ),
        CustomizationOption(
            option_id="clasp_type",
            display_name="Clasp Type",
            option_type="select",
            required=True,
            order=4,
            help_text="Select clasp style",
            values=[
                CustomizationOptionValue(
                    value="lobster", price_modifier=0.0, display_name="Lobster Clasp"
                ),
                CustomizationOptionValue(
                    value="spring_ring", price_modifier=0.0, display_name="Spring Ring"
                ),
                CustomizationOptionValue(
                    value="toggle", price_modifier=0.0, display_name="Toggle Clasp"
                ),
            ],
        ),
        CustomizationOption(
            option_id="engraving",
            display_name="Engraving",
            option_type="text",
            required=False,
            order=5,
            help_text="Back of pendant, max 15 characters",
            validation_rules={
                "max_length": 15,
                "pattern": "^[a-zA-Z0-9\\s\\.\\,\\!\\?\\'\\-]*$",
                "price": 40.0,
            },
        ),
    ],
)

# Bracelets Customization Configuration
BRACELETS_CONFIG = ProductCustomizationConfig(
    category="bracelets",
    options=[
        CustomizationOption(
            option_id="metal_type",
            display_name="Metal Type",
            option_type="select",
            required=True,
            order=1,
            help_text="Select the metal for your bracelet",
            values=[
                CustomizationOptionValue(
                    value="sterling_silver",
                    price_modifier=0.0,
                    display_name="Sterling Silver",
                ),
                CustomizationOptionValue(
                    value="gold", price_modifier=120.0, display_name="Gold"
                ),
                CustomizationOptionValue(
                    value="rose_gold", price_modifier=150.0, display_name="Rose Gold"
                ),
            ],
        ),
        CustomizationOption(
            option_id="bracelet_size",
            display_name="Bracelet Size",
            option_type="select",
            required=True,
            order=2,
            help_text="Select your wrist size",
            values=[
                CustomizationOptionValue(
                    value='6"', price_modifier=0.0, display_name="6 inches"
                ),
                CustomizationOptionValue(
                    value='6.5"', price_modifier=0.0, display_name="6.5 inches"
                ),
                CustomizationOptionValue(
                    value='7"', price_modifier=0.0, display_name="7 inches"
                ),
                CustomizationOptionValue(
                    value='7.5"', price_modifier=0.0, display_name="7.5 inches"
                ),
                CustomizationOptionValue(
                    value='8"', price_modifier=0.0, display_name="8 inches"
                ),
            ],
        ),
        CustomizationOption(
            option_id="charms",
            display_name="Charm Addition",
            option_type="multi_select",
            required=False,
            order=3,
            help_text="Add up to 3 charms ($50 each)",
            validation_rules={"max_selections": 3, "price_per_item": 50.0},
            values=[
                CustomizationOptionValue(
                    value="heart", price_modifier=50.0, display_name="Heart Charm"
                ),
                CustomizationOptionValue(
                    value="star", price_modifier=50.0, display_name="Star Charm"
                ),
                CustomizationOptionValue(
                    value="moon", price_modifier=50.0, display_name="Moon Charm"
                ),
                CustomizationOptionValue(
                    value="flower", price_modifier=50.0, display_name="Flower Charm"
                ),
                CustomizationOptionValue(
                    value="key", price_modifier=50.0, display_name="Key Charm"
                ),
                CustomizationOptionValue(
                    value="lock", price_modifier=50.0, display_name="Lock Charm"
                ),
            ],
        ),
        CustomizationOption(
            option_id="engraving",
            display_name="Engraving",
            option_type="text",
            required=False,
            order=4,
            help_text="Inside bracelet, max 10 characters",
            validation_rules={
                "max_length": 10,
                "pattern": "^[a-zA-Z0-9\\s\\.\\,\\!\\?\\'\\-]*$",
                "price": 35.0,
            },
        ),
    ],
)

# Master configuration dictionary
CUSTOMIZATION_CONFIGS: Dict[str, ProductCustomizationConfig] = {
    "rings": RINGS_CONFIG,
    "necklaces": NECKLACES_CONFIG,
    "bracelets": BRACELETS_CONFIG,
}


def get_customization_config(category: str) -> Optional[ProductCustomizationConfig]:
    """
    Retrieve customization configuration for a product category

    Args:
        category: Product category (rings, necklaces, bracelets)

    Returns:
        ProductCustomizationConfig or None if category not found
    """
    return CUSTOMIZATION_CONFIGS.get(category)
