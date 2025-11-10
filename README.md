# Pandora - Luxury Jewelry E-Commerce PWA

A professional Progressive Web App (PWA) for showcasing luxury jewelry with a modern, elegant design.

## Features

- 🎨 **Modern UI** - Elegant design with Tailwind CSS featuring a luxury gold/black color scheme
- 📱 **Responsive Design** - Mobile-first design that works beautifully on all devices
- 🛒 **Shopping Cart** - Full-featured cart with add/remove items and quantity management
- 🔍 **Category Filtering** - Filter products by rings, necklaces, and bracelets
- 💾 **Persistent Cart** - Cart data saved in localStorage
- ⚡ **PWA Features** - Installable app with offline support via service worker
- ✅ **Tested** - Comprehensive test coverage for API and models

## Technology Stack

- **Backend**: Python 3.11 + FastAPI
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Tailwind CSS
- **Testing**: Pytest
- **Server**: Uvicorn

## Project Structure

```
devin-pandora/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── models.py            # Pydantic models
│   ├── mock_data.py         # Mock product data (15 products)
│   └── api/
│       ├── __init__.py
│       └── routes.py        # API endpoints
├── static/
│   ├── css/
│   │   └── styles.css       # Custom styles
│   ├── js/
│   │   ├── app.js          # Main application logic
│   │   ├── cart.js         # Shopping cart functionality
│   │   └── service-worker.js # PWA service worker
│   └── manifest.json       # PWA manifest
├── templates/
│   └── index.html          # Main HTML template
├── tests/
│   ├── __init__.py
│   ├── test_api.py         # API tests
│   └── test_models.py      # Model tests
├── requirements.txt        # Python dependencies
├── pytest.ini             # Pytest configuration
└── README.md
```

## Installation

1. Clone the repository
2. Install dependencies:

```bash
pip install -r requirements.txt
```

## Running the Application

Start the development server:

```bash
cd ClaudeCodeWorkshop
python main.py
```

The application will be available at `http://localhost:8000`

## Running Tests

Run the test suite:

```bash
pytest tests/ -v
```

All 16 tests should pass successfully.

## API Endpoints

- `GET /` - Main application page
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get specific product by ID
- `GET /api/products/category/{category}` - Get products by category (rings, necklaces, bracelets)
- `GET /manifest.json` - PWA manifest

## Features Overview

### Product Showcase
- Grid layout with beautiful product cards
- High-quality images from Unsplash
- Category badges
- Hover effects and animations

### Shopping Cart
- Slide-out sidebar cart
- Add/remove items
- Quantity controls
- Real-time total calculation
- Persistent storage

### Category Filtering
- Filter by: All, Rings, Necklaces, Bracelets
- Responsive menu (desktop and mobile)
- Active filter highlighting

### PWA Features
- Installable on mobile and desktop
- Offline support with service worker
- App manifest for native-like experience
- Theme color and icons

## Mock Data

The application includes 15 luxury jewelry products:
- 5 Rings (Diamond, Rose Gold, Emerald, Sapphire, Champagne Diamond)
- 5 Necklaces (Tennis, Pearl, Emerald, Gold Chain, Ruby)
- 5 Bracelets (Tennis, Bangle Set, Sapphire Link, Gold Cuff, Pearl Bangle)

All products feature realistic pricing ($1,399 - $8,999) and professional descriptions.

## Development Notes

- Uses Pydantic for data validation
- FastAPI automatic API documentation at `/docs`
- Tailwind CSS for rapid styling
- Vanilla JavaScript for lightweight client-side code
- LocalStorage for cart persistence
- Service Worker for offline capability

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

**Built with ❤️ using FastAPI, Tailwind CSS, and modern web technologies**
