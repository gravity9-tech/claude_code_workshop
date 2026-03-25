# AGENT.md

Instructions and guidelines for AI agents working in this repository.

## Project Overview

This is a full-stack Tea Store e-commerce application built as a workshop environment for demonstrating Claude Code and Atlassian JIRA integration.

- **Backend**: Python 3.12 + FastAPI (port 8765)
- **Frontend**: React 19 + TypeScript + Vite 7 + Tailwind CSS 4 (port 4321)
- **E2E Testing**: Playwright
- **MCP Integration**: Atlassian Rovo for Jira/Confluence

## Project Structure

```
├── backend/                    # FastAPI Python backend
│   ├── app/
│   │   ├── api/routes.py       # API endpoints
│   │   ├── main.py             # FastAPI app with CORS
│   │   ├── models.py           # Pydantic models
│   │   ├── mock_data.py        # Product data store (15 teas)
│   │   └── customization_config.py
│   ├── tests/                  # Pytest tests
│   ├── main.py                 # Uvicorn entry point
│   └── requirements.txt
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── features/       # Feature components (customization wizard, etc.)
│   │   │   ├── shared/         # Reusable components (ProductCard, CartSidebar, etc.)
│   │   │   └── context/        # React Context providers (Cart, Wishlist, Theme, Notification)
│   │   ├── services/           # API service layer
│   │   └── types/              # TypeScript type definitions
│   ├── package.json
│   └── vite.config.ts
│
├── e2e/                        # Playwright E2E tests
├── .claude/skills/             # Claude Code skills
├── test.js                     # Cross-platform unified test runner
├── start.sh / start.bat        # Orchestration scripts
└── playwright.config.ts
```

## Running the Application

```bash
# Quick start (installs deps + starts both services)
./start.sh          # macOS/Linux
start.bat           # Windows

# Manual start
# Backend
cd backend && source venv/bin/activate && python main.py

# Frontend (separate terminal)
cd frontend && npm run dev
```

- Frontend: http://localhost:4321
- Backend API: http://localhost:8765
- API Docs (Swagger): http://localhost:8765/docs

## Linting

```bash
# Backend
cd backend && source venv/bin/activate && flake8 app/ --max-line-length=120

# Frontend
cd frontend && npx tsc -b
```

## Testing

```bash
# All unit tests (backend + frontend)
node test.js

# Including E2E
node test.js --e2e

# Backend only
cd backend && source venv/bin/activate && pytest -v

# Frontend only
cd frontend && npm run test

# E2E only
npx playwright test
```

## API Endpoints

| Method | Endpoint                                | Description                      |
|--------|-----------------------------------------|----------------------------------|
| GET    | `/api/products`                         | All products (supports filtering)|
| GET    | `/api/products/{id}`                    | Product by ID                    |
| GET    | `/api/products/category/{category}`     | Products by category             |
| GET    | `/api/customization-config/{category}`  | Customization options for a category |

### Query Parameters for `/api/products`

- `category` - Filter by category (green, black, oolong, herbal)
- `price_max` - Maximum price filter
- `material` - Filter by origin (China, Japan, India, Taiwan)

## Code Conventions

### Backend (Python)
- Use **Pydantic** models for all data validation (`backend/app/models.py`)
- Max line length: **120 characters** (flake8)
- Tests go in `backend/tests/`
- Mock data is in `backend/app/mock_data.py` (no database)

### Frontend (TypeScript/React)
- **TypeScript strict mode** is enabled
- Prefer `const` over `let`
- State management via **React Context** (Cart, Wishlist, Theme, Notification)
- Cart and Wishlist persist to **localStorage**
- Feature components live in `frontend/src/app/features/`
- Shared/reusable components live in `frontend/src/app/shared/`
- Frontend proxies `/api` requests to the backend during development

## Key Domain Terms

- **Customization Wizard**: Multi-step UI flow for modifying tea attributes before adding to cart
- **Tea Category**: Green, Black, Oolong, or Herbal - determines available customization options
- **Material**: Refers to the tea's country of origin (China, Japan, India, Taiwan)
- **Price Modifier**: Value added to base price based on customization selections
- **Customization Config**: Dynamic schema from the API defining options and validation rules per category

## Important Notes

- There is no database; product data is served from an in-memory mock data store (`PRODUCTS` list in `mock_data.py`)
- CORS is configured for `localhost:4321`
- The `test.js` script handles cross-platform differences for running both Python and JavaScript tests
- Playwright browsers are installed via `postinstall`; if missing, run `npx playwright install chromium`
