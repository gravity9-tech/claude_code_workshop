# Tea Store Demo

A full-stack premium tea e-commerce application with an Angular frontend and FastAPI backend.

## Features

- **Modern UI** - Clean design with Tailwind CSS
- **Responsive Design** - Mobile-first design that works on all devices
- **Shopping Cart** - Full-featured cart with add/remove items and quantity management
- **Wishlist** - Save favorite teas for later
- **Product Filtering** - Filter by category, price range, and origin
- **Product Customization** - Multi-step wizard for customizing select teas
- **Dark Mode** - Toggle between light and dark themes
- **Persistent State** - Cart and wishlist saved in localStorage

## Technology Stack

### Backend
- **Python 3.12** + **FastAPI**
- **Pydantic** for data validation
- **Uvicorn** ASGI server
- **Pytest** for testing

### Frontend
- **Angular 19** (standalone components)
- **TypeScript**
- **Tailwind CSS 4**
- **RxJS** for state management

## Project Structure

```
tea-store-demo/
├── backend/                    # FastAPI Python backend
│   ├── app/
│   │   ├── api/
│   │   │   └── routes.py       # API endpoints
│   │   ├── main.py             # FastAPI app with CORS
│   │   ├── models.py           # Pydantic models
│   │   ├── mock_data.py        # Product data
│   │   └── customization_config.py
│   ├── tests/
│   ├── scripts/
│   ├── main.py                 # Uvicorn entry point
│   ├── requirements.txt
│   └── pytest.ini
│
├── frontend/                   # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/           # Services & models
│   │   │   ├── shared/         # Reusable components
│   │   │   └── features/       # Feature modules
│   │   ├── environments/
│   │   └── styles.css
│   ├── angular.json
│   ├── package.json
│   ├── proxy.conf.json
│   └── tailwind.config.js
│
├── Makefile                    # Development commands
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 18+
- npm

### Installation

Install all dependencies:

```bash
make install
```

Or install separately:

```bash
# Backend (creates venv and installs dependencies)
make install-backend

# Frontend
cd frontend && npm install
```

The backend uses a virtual environment located at `backend/venv/`. The Makefile automatically creates and manages this environment.

### Running the Application

Start both backend and frontend in development mode:

```bash
make dev
```

Or run them separately:

```bash
# Backend (port 8765)
make start-backend

# Frontend (port 4321)
make start-frontend
```

The application will be available at:
- **Frontend**: http://localhost:4321
- **Backend API**: http://localhost:8765
- **API Docs**: http://localhost:8765/docs

## Makefile Commands

| Command | Description |
|---------|-------------|
| `make install` | Install all dependencies |
| `make dev` | Start both servers in parallel |
| `make start-backend` | Start backend only (port 8765) |
| `make start-frontend` | Start frontend only (port 4321) |
| `make build` | Build frontend for production |
| `make test` | Run all tests |
| `make test-backend` | Run backend tests only |
| `make lint` | Run linters |
| `make clean` | Remove build artifacts |
| `make clean-all` | Remove venv and node_modules |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products (supports filtering) |
| GET | `/api/products/{id}` | Get product by ID |
| GET | `/api/products/category/{category}` | Get products by category |
| GET | `/api/customization-config/{category}` | Get customization options |
| GET | `/health` | Health check |

### Query Parameters for `/api/products`

- `category` - Filter by category (green, black, oolong, herbal)
- `price_max` - Maximum price filter
- `material` - Filter by origin (China, Japan, India, Taiwan)

## Frontend Architecture

### Core Services
- **ProductService** - API calls for products
- **CartService** - Shopping cart state management
- **WishlistService** - Wishlist state management
- **ThemeService** - Dark/light mode toggle
- **CustomizationService** - Tea customization logic
- **NotificationService** - Toast notifications

### Feature Modules
- **Home** - Tea listing with hero, filters, and grid
- **Wishlist** - Saved teas page
- **Customization** - Multi-step customization modal

### Shared Components
- Header, Footer, ProductCard, CartSidebar, LoadingSpinner, NotificationToast

## Testing

Run all tests:

```bash
make test
```

Backend tests only:

```bash
make test-backend
# or
cd backend && pytest -v
```

## Product Data

The application includes 15 premium teas:
- **5 Green Teas** - Including Dragon Well, Matcha, Sencha, Jasmine Pearl, and Gyokuro
- **4 Black Teas** - Darjeeling, Assam, Earl Grey, and Pu-erh
- **3 Oolong Teas** - High Mountain, Tie Guan Yin, and Oriental Beauty
- **3 Herbal Teas** - Chamomile, Peppermint, and Rooibos

Teas range from $18 to $85 with origins including China, Japan, India, and Taiwan.

## Development Notes

- Frontend proxies `/api` requests to backend during development
- CORS is configured for `localhost:4321`
- State is persisted to localStorage (cart, wishlist, theme)

---

**Built with Angular, FastAPI, and Tailwind CSS**
