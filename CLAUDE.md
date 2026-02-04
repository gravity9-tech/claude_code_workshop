# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A full-stack premium tea e-commerce application with a React frontend and FastAPI backend.

## Commands

### Quick Start
```bash
./start.sh        # macOS/Linux - starts both services
start.bat         # Windows
```

### Running Services Manually
```bash
# Backend (port 8765)
cd backend && source venv/bin/activate && python main.py

# Frontend (port 4321)
cd frontend && npm run dev
```

### Testing
```bash
# All unit tests (backend + frontend)
./test.sh

# Backend only
cd backend && source venv/bin/activate && pytest tests/ -v

# Single backend test file
cd backend && source venv/bin/activate && pytest tests/test_api.py -v

# Single backend test
cd backend && source venv/bin/activate && pytest tests/test_api.py::test_get_products -v

# Frontend unit tests
cd frontend && npm run test

# Frontend tests in watch mode
cd frontend && npm run test:watch

# E2E tests (auto-starts services)
npx playwright test
npx playwright test --headed     # visible browser
npx playwright test --ui         # Playwright UI

# Single E2E test file
npx playwright test e2e/cart.spec.ts
```

### Linting & Formatting
```bash
# Frontend
cd frontend && npm run lint

# Backend
cd backend && source venv/bin/activate
black app/ tests/
isort app/ tests/
flake8 app/ tests/
mypy app/
```

### Building
```bash
cd frontend && npm run build     # TypeScript check + Vite build
```

## Architecture

### Backend (FastAPI)
- `backend/app/main.py` - FastAPI app configuration and CORS setup
- `backend/app/api/routes.py` - All API endpoints under `/api` prefix
- `backend/app/models.py` - Pydantic models for data validation
- `backend/app/mock_data.py` - Static product data (no database)
- `backend/app/customization_config.py` - Tea customization options

### Frontend (React + TypeScript)
- Uses React Context for state management with localStorage persistence
- Context providers wrap the app in this order: `ThemeProvider > NotificationProvider > CartProvider > WishlistProvider`
- `frontend/src/contexts/` - Cart, Wishlist, Theme, Notification contexts
- `frontend/src/services/` - API client functions (productService, customizationService)
- `frontend/src/components/features/` - Page-level components (home, wishlist, customization)
- `frontend/src/components/shared/` - Reusable components (Header, ProductCard, CartSidebar)
- `frontend/src/types/` - TypeScript type definitions

### API Proxy
Frontend dev server proxies `/api` requests to backend at `localhost:8765` (configured in `vite.config.ts`).

### E2E Tests
Playwright tests in `e2e/` directory auto-start both backend and frontend services via `playwright.config.ts`.
