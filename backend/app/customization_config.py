"""Customization configuration for Steep House product categories.

Defines Pydantic models and per-category configuration objects for all
product customization options (package size, brew style, add-ons, etc.)
along with their pricing modifiers. Exposes a single lookup function,
``get_customization_config``, for use by API route handlers.
"""

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class CustomizationOptionValue(BaseModel):
    """Individual selectable value within a customization option.

    Represents a single choice a customer can make — for example ``"50g"``
    within a *Package Size* option — together with any price adjustment that
    choice carries.

    Attributes:
        value (str): Machine-readable identifier for this choice
            (e.g., ``"50g"``, ``"loose"``).
        price_modifier (float): Additional cost in USD added to the base
            product price when this value is selected. Defaults to ``0.0``.
        display_name (str): Human-readable label shown in the UI
            (e.g., ``"50g"`` or ``"Loose Leaf"``).
        description (Optional[str]): Short supplementary text displayed
            beneath the label in the UI. Defaults to ``None``.

    Example:
        >>> opt_val = CustomizationOptionValue(
        ...     value="100g",
        ...     price_modifier=15.0,
        ...     display_name="100g",
        ...     description="Regular size",
        ... )
        >>> opt_val.value
        '100g'
        >>> opt_val.price_modifier
        15.0
    """

    value: str
    price_modifier: float = Field(
        0.0, description="Additional cost for this option in USD"
    )
    display_name: str
    description: Optional[str] = None


class CustomizationOption(BaseModel):
    """A single customization dimension presented to the customer.

    Groups a set of ``CustomizationOptionValue`` choices under a labelled
    category such as *Package Size* or *Brew Strength*, and carries metadata
    used by the frontend to render the appropriate input widget and validate
    the customer's selection.

    Attributes:
        option_id (str): Snake-case identifier for this option
            (e.g., ``"package_size"``, ``"brew_strength"``).
        display_name (str): Human-readable label shown as the option heading
            in the UI (e.g., ``"Package Size"``).
        option_type (str): Widget type hint for the frontend. One of
            ``"select"``, ``"text"``, ``"number"``, or ``"multi_select"``.
        required (bool): Whether the customer must supply a value before
            adding the product to the cart. Defaults to ``True``.
        values (List[CustomizationOptionValue]): Ordered list of selectable
            values. Empty for free-form types such as ``"text"``.
        validation_rules (Optional[Dict[str, Any]]): Arbitrary validation
            constraints forwarded to the frontend (e.g.,
            ``{"max_length": 100}``). Defaults to ``None``.
        order (int): Ascending display order within the parent config.
            Defaults to ``1``.
        help_text (Optional[str]): Instructional text displayed near the
            option widget. Defaults to ``None``.

    Example:
        >>> option = CustomizationOption(
        ...     option_id="brew_strength",
        ...     display_name="Brew Strength",
        ...     option_type="select",
        ...     required=True,
        ...     order=2,
        ... )
        >>> option.option_id
        'brew_strength'
        >>> option.required
        True
    """

    option_id: str  # e.g., "package_size", "brew_style"
    display_name: str
    option_type: str  # "select", "text", "number", "multi_select"
    required: bool = True
    values: List[CustomizationOptionValue] = []
    validation_rules: Optional[Dict[str, Any]] = None
    order: int = Field(1, description="Display order in UI")
    help_text: Optional[str] = None


class ProductCustomizationConfig(BaseModel):
    """Complete customization configuration for a tea product category.

    Aggregates all ``CustomizationOption`` objects that apply to a specific
    product category (``black``, ``green``, ``oolong``, or ``herbal``) and
    an optional preview template string used by the frontend to render a
    human-readable order summary.

    Attributes:
        category (str): Tea category identifier. One of ``"black"``,
            ``"green"``, ``"oolong"``, or ``"herbal"``.
        options (List[CustomizationOption]): Ordered list of customization
            dimensions available for this category.
        preview_template (Optional[str]): Template string for generating a
            human-readable preview of the customer's selections.
            Defaults to ``None``.

    Example:
        >>> config = ProductCustomizationConfig(
        ...     category="herbal",
        ...     options=[],
        ... )
        >>> config.category
        'herbal'
        >>> config.options
        []
    """

    category: str
    options: List[CustomizationOption]
    preview_template: Optional[str] = None


# Black Tea Customization Configuration
BLACK_CONFIG = ProductCustomizationConfig(
    category="black",
    options=[
        CustomizationOption(
            option_id="package_size",
            display_name="Package Size",
            option_type="select",
            required=True,
            order=1,
            help_text="Select your package size",
            values=[
                CustomizationOptionValue(
                    value="50g",
                    price_modifier=0.0,
                    display_name="50g",
                    description="Perfect for trying",
                ),
                CustomizationOptionValue(
                    value="100g",
                    price_modifier=15.0,
                    display_name="100g",
                    description="Regular size",
                ),
                CustomizationOptionValue(
                    value="250g",
                    price_modifier=35.0,
                    display_name="250g",
                    description="Best value",
                ),
                CustomizationOptionValue(
                    value="500g",
                    price_modifier=60.0,
                    display_name="500g",
                    description="Tea enthusiast",
                ),
            ],
        ),
        CustomizationOption(
            option_id="brew_strength",
            display_name="Brew Strength",
            option_type="select",
            required=True,
            order=2,
            help_text="Select your preferred strength",
            values=[
                CustomizationOptionValue(
                    value="light", price_modifier=0.0, display_name="Light"
                ),
                CustomizationOptionValue(
                    value="medium", price_modifier=0.0, display_name="Medium"
                ),
                CustomizationOptionValue(
                    value="strong", price_modifier=0.0, display_name="Strong"
                ),
            ],
        ),
        CustomizationOption(
            option_id="add_ons",
            display_name="Add-ons",
            option_type="select",
            required=False,
            order=3,
            help_text="Add extras (optional)",
            values=[
                CustomizationOptionValue(
                    value="none",
                    price_modifier=0.0,
                    display_name="No Add-ons",
                    description="Pure tea",
                ),
                CustomizationOptionValue(
                    value="infuser",
                    price_modifier=8.0,
                    display_name="Tea Infuser",
                    description="Stainless steel infuser",
                ),
                CustomizationOptionValue(
                    value="honey_sticks",
                    price_modifier=5.0,
                    display_name="Honey Sticks (10)",
                    description="Natural sweetener",
                ),
                CustomizationOptionValue(
                    value="sampler",
                    price_modifier=12.0,
                    display_name="Sampler Pack",
                    description="3 additional varieties",
                ),
            ],
        ),
        CustomizationOption(
            option_id="gift_note",
            display_name="Gift Note",
            option_type="text",
            required=False,
            order=4,
            help_text="Add a personalized message, max 100 characters",
            validation_rules={
                "max_length": 100,
                "pattern": "^[a-zA-Z0-9\\s\\.\\,\\!\\?\\'\\-]*$",
                "price": 0.0,
            },
        ),
    ],
)

# Green Tea Customization Configuration
GREEN_CONFIG = ProductCustomizationConfig(
    category="green",
    options=[
        CustomizationOption(
            option_id="package_size",
            display_name="Package Size",
            option_type="select",
            required=True,
            order=1,
            help_text="Select your package size",
            values=[
                CustomizationOptionValue(
                    value="30g",
                    price_modifier=0.0,
                    display_name="30g",
                    description="Sample size",
                ),
                CustomizationOptionValue(
                    value="50g",
                    price_modifier=10.0,
                    display_name="50g",
                    description="Perfect for trying",
                ),
                CustomizationOptionValue(
                    value="100g",
                    price_modifier=25.0,
                    display_name="100g",
                    description="Regular size",
                ),
                CustomizationOptionValue(
                    value="200g",
                    price_modifier=45.0,
                    display_name="200g",
                    description="Best value",
                ),
            ],
        ),
        CustomizationOption(
            option_id="leaf_style",
            display_name="Leaf Style",
            option_type="select",
            required=True,
            order=2,
            help_text="Choose leaf preparation",
            values=[
                CustomizationOptionValue(
                    value="loose", price_modifier=0.0, display_name="Loose Leaf"
                ),
                CustomizationOptionValue(
                    value="sachets", price_modifier=5.0, display_name="Pyramid Sachets"
                ),
                CustomizationOptionValue(
                    value="powder", price_modifier=8.0, display_name="Stone-Ground Powder"
                ),
            ],
        ),
        CustomizationOption(
            option_id="accessories",
            display_name="Accessories",
            option_type="select",
            required=False,
            order=3,
            help_text="Add tea accessories (optional)",
            values=[
                CustomizationOptionValue(
                    value="none", price_modifier=0.0, display_name="No Accessories"
                ),
                CustomizationOptionValue(
                    value="whisk",
                    price_modifier=18.0,
                    display_name="Bamboo Whisk (Chasen)",
                ),
                CustomizationOptionValue(
                    value="bowl", price_modifier=25.0, display_name="Matcha Bowl (Chawan)"
                ),
                CustomizationOptionValue(
                    value="set",
                    price_modifier=40.0,
                    display_name="Complete Set (Whisk + Bowl)",
                ),
            ],
        ),
        CustomizationOption(
            option_id="gift_note",
            display_name="Gift Note",
            option_type="text",
            required=False,
            order=4,
            help_text="Add a personalized message, max 100 characters",
            validation_rules={
                "max_length": 100,
                "pattern": "^[a-zA-Z0-9\\s\\.\\,\\!\\?\\'\\-]*$",
                "price": 0.0,
            },
        ),
    ],
)

# Oolong Tea Customization Configuration
OOLONG_CONFIG = ProductCustomizationConfig(
    category="oolong",
    options=[
        CustomizationOption(
            option_id="package_size",
            display_name="Package Size",
            option_type="select",
            required=True,
            order=1,
            help_text="Select your package size",
            values=[
                CustomizationOptionValue(
                    value="50g",
                    price_modifier=0.0,
                    display_name="50g",
                    description="Perfect for trying",
                ),
                CustomizationOptionValue(
                    value="100g",
                    price_modifier=20.0,
                    display_name="100g",
                    description="Regular size",
                ),
                CustomizationOptionValue(
                    value="150g",
                    price_modifier=35.0,
                    display_name="150g",
                    description="Tea lover",
                ),
                CustomizationOptionValue(
                    value="250g",
                    price_modifier=55.0,
                    display_name="250g",
                    description="Best value",
                ),
            ],
        ),
        CustomizationOption(
            option_id="roast_level",
            display_name="Roast Level",
            option_type="select",
            required=True,
            order=2,
            help_text="Select oxidation/roast level",
            values=[
                CustomizationOptionValue(
                    value="light", price_modifier=0.0, display_name="Light Roast",
                    description="Floral, delicate"
                ),
                CustomizationOptionValue(
                    value="medium", price_modifier=0.0, display_name="Medium Roast",
                    description="Balanced, smooth"
                ),
                CustomizationOptionValue(
                    value="dark", price_modifier=0.0, display_name="Dark Roast",
                    description="Rich, toasty"
                ),
            ],
        ),
        CustomizationOption(
            option_id="brewing_vessel",
            display_name="Brewing Vessel",
            option_type="select",
            required=False,
            order=3,
            help_text="Add a traditional brewing vessel (optional)",
            values=[
                CustomizationOptionValue(
                    value="none", price_modifier=0.0, display_name="No Vessel"
                ),
                CustomizationOptionValue(
                    value="gaiwan",
                    price_modifier=22.0,
                    display_name="Gaiwan (120ml)",
                    description="Traditional Chinese brewing",
                ),
                CustomizationOptionValue(
                    value="yixing",
                    price_modifier=45.0,
                    display_name="Yixing Clay Pot",
                    description="Premium unglazed clay",
                ),
            ],
        ),
        CustomizationOption(
            option_id="gift_note",
            display_name="Gift Note",
            option_type="text",
            required=False,
            order=4,
            help_text="Add a personalized message, max 100 characters",
            validation_rules={
                "max_length": 100,
                "pattern": "^[a-zA-Z0-9\\s\\.\\,\\!\\?\\'\\-]*$",
                "price": 0.0,
            },
        ),
    ],
)

# Herbal Tea Customization Configuration
HERBAL_CONFIG = ProductCustomizationConfig(
    category="herbal",
    options=[
        CustomizationOption(
            option_id="package_size",
            display_name="Package Size",
            option_type="select",
            required=True,
            order=1,
            help_text="Select your package size",
            values=[
                CustomizationOptionValue(
                    value="40g",
                    price_modifier=0.0,
                    display_name="40g",
                    description="Sample size",
                ),
                CustomizationOptionValue(
                    value="80g",
                    price_modifier=12.0,
                    display_name="80g",
                    description="Regular size",
                ),
                CustomizationOptionValue(
                    value="150g",
                    price_modifier=22.0,
                    display_name="150g",
                    description="Best value",
                ),
            ],
        ),
        CustomizationOption(
            option_id="blend_type",
            display_name="Blend Preference",
            option_type="select",
            required=True,
            order=2,
            help_text="Choose your blend style",
            values=[
                CustomizationOptionValue(
                    value="pure", price_modifier=0.0, display_name="Pure Herb",
                    description="Single ingredient"
                ),
                CustomizationOptionValue(
                    value="relaxing", price_modifier=3.0, display_name="Relaxing Blend",
                    description="With lavender & chamomile"
                ),
                CustomizationOptionValue(
                    value="energizing", price_modifier=3.0, display_name="Energizing Blend",
                    description="With ginger & lemongrass"
                ),
            ],
        ),
        CustomizationOption(
            option_id="extras",
            display_name="Extras",
            option_type="multi_select",
            required=False,
            order=3,
            help_text="Add extras (select up to 3)",
            validation_rules={"max_selections": 3, "price_per_item": 4.0},
            values=[
                CustomizationOptionValue(
                    value="honey", price_modifier=4.0, display_name="Raw Honey Jar"
                ),
                CustomizationOptionValue(
                    value="strainer", price_modifier=4.0, display_name="Fine Mesh Strainer"
                ),
                CustomizationOptionValue(
                    value="jar", price_modifier=4.0, display_name="Glass Storage Jar"
                ),
                CustomizationOptionValue(
                    value="scoop", price_modifier=4.0, display_name="Bamboo Scoop"
                ),
            ],
        ),
        CustomizationOption(
            option_id="gift_note",
            display_name="Gift Note",
            option_type="text",
            required=False,
            order=4,
            help_text="Add a personalized message, max 100 characters",
            validation_rules={
                "max_length": 100,
                "pattern": "^[a-zA-Z0-9\\s\\.\\,\\!\\?\\'\\-]*$",
                "price": 0.0,
            },
        ),
    ],
)

# Master configuration dictionary
CUSTOMIZATION_CONFIGS: Dict[str, ProductCustomizationConfig] = {
    "black": BLACK_CONFIG,
    "green": GREEN_CONFIG,
    "oolong": OOLONG_CONFIG,
    "herbal": HERBAL_CONFIG,
}


def get_customization_config(category: str) -> Optional[ProductCustomizationConfig]:
    """Retrieve the customization configuration for a product category.

    Performs a dictionary lookup against the module-level
    ``CUSTOMIZATION_CONFIGS`` registry and returns the matching
    ``ProductCustomizationConfig`` instance, or ``None`` when the supplied
    category is not recognised.

    Args:
        category (str): Tea product category to look up. Expected values are
            ``"black"``, ``"green"``, ``"oolong"``, and ``"herbal"``.

    Returns:
        Optional[ProductCustomizationConfig]: The configuration object for
            the requested category, or ``None`` if the category is not found
            in the registry.

    Example:
        >>> config = get_customization_config("green")
        >>> config.category
        'green'
        >>> get_customization_config("unknown") is None
        True
    """
    return CUSTOMIZATION_CONFIGS.get(category)
