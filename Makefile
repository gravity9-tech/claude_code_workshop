# Pandora Jewelry Store - Makefile
# FastAPI Backend + Angular Frontend

.PHONY: help install install-backend install-frontend dev start start-backend start-frontend build test test-backend test-frontend lint format clean

# Virtual environment path
VENV := backend/venv
PYTHON := $(VENV)/bin/python
PIP := $(VENV)/bin/pip

# Default target
help:
	@echo "Pandora Jewelry Store - Development Commands"
	@echo ""
	@echo "Setup:"
	@echo "  make install          - Install all dependencies (backend + frontend)"
	@echo "  make install-backend  - Create venv and install backend Python dependencies"
	@echo "  make install-frontend - Install frontend Node.js dependencies"
	@echo ""
	@echo "Development:"
	@echo "  make dev              - Start both backend and frontend (parallel)"
	@echo "  make start-backend    - Start backend server only (port 8765)"
	@echo "  make start-frontend   - Start frontend dev server only (port 4321)"
	@echo ""
	@echo "Build & Test:"
	@echo "  make build            - Build frontend for production"
	@echo "  make test             - Run all tests"
	@echo "  make test-backend     - Run backend tests only"
	@echo "  make test-frontend    - Run frontend tests only"
	@echo ""
	@echo "Code Quality:"
	@echo "  make lint             - Run linters on both projects"
	@echo "  make format           - Format code in both projects"
	@echo ""
	@echo "Cleanup:"
	@echo "  make clean            - Remove build artifacts and caches"

# ============================================================================
# Installation
# ============================================================================

install: install-backend install-frontend
	@echo "All dependencies installed successfully!"

# Create virtual environment if it doesn't exist
$(VENV)/bin/activate:
	@echo "Creating virtual environment..."
	python3 -m venv $(VENV)

install-backend: $(VENV)/bin/activate
	@echo "Installing backend dependencies in virtual environment..."
	$(PIP) install --upgrade pip
	$(PIP) install -r backend/requirements.txt
	@echo "Backend dependencies installed in $(VENV)"

install-frontend:
	@echo "Installing frontend dependencies..."
	cd frontend && npm install

# ============================================================================
# Development
# ============================================================================

# Start both services in parallel
# Note: This uses background processes - use Ctrl+C to stop both
dev:
	@echo "Starting development servers..."
	@echo "Backend: http://localhost:8765"
	@echo "Frontend: http://localhost:4321"
	@echo "API Docs: http://localhost:8765/docs"
	@echo ""
	@echo "Press Ctrl+C to stop both servers"
	@trap 'kill 0' INT; \
	(cd backend && ../$(VENV)/bin/python main.py) & \
	(cd frontend && npm start) & \
	wait

start-backend:
	@echo "Starting backend server on http://localhost:8765..."
	cd backend && ../$(VENV)/bin/python main.py

start-frontend:
	@echo "Starting frontend dev server on http://localhost:4321..."
	cd frontend && npm start

# ============================================================================
# Build
# ============================================================================

build:
	@echo "Building frontend for production..."
	cd frontend && npm run build
	@echo "Build complete! Output in frontend/dist/"

# ============================================================================
# Testing
# ============================================================================

test: test-backend test-frontend
	@echo "All tests completed!"

test-backend:
	@echo "Running backend tests..."
	cd backend && ../$(VENV)/bin/pytest -v

test-frontend:
	@echo "Running frontend tests..."
	cd frontend && npm test -- --watch=false --browsers=ChromeHeadless

# ============================================================================
# Code Quality
# ============================================================================

lint: lint-backend lint-frontend
	@echo "Linting completed!"

lint-backend:
	@echo "Linting backend..."
	cd backend && ../$(VENV)/bin/python -m flake8 app/ --max-line-length=100 || true
	cd backend && ../$(VENV)/bin/python -m mypy app/ --ignore-missing-imports || true

lint-frontend:
	@echo "Linting frontend..."
	cd frontend && npm run lint || true

format: format-backend format-frontend
	@echo "Formatting completed!"

format-backend:
	@echo "Formatting backend..."
	cd backend && ../$(VENV)/bin/python -m black app/ tests/ || true
	cd backend && ../$(VENV)/bin/python -m isort app/ tests/ || true

format-frontend:
	@echo "Formatting frontend..."
	@# Add prettier or other formatter if configured

# ============================================================================
# Cleanup
# ============================================================================

clean:
	@echo "Cleaning up build artifacts..."
	# Frontend
	rm -rf frontend/dist
	rm -rf frontend/node_modules/.cache
	rm -rf frontend/.angular
	# Backend
	find backend -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find backend -type d -name .pytest_cache -exec rm -rf {} + 2>/dev/null || true
	find backend -type d -name htmlcov -exec rm -rf {} + 2>/dev/null || true
	find backend -type f -name "*.pyc" -delete 2>/dev/null || true
	find backend -type f -name ".coverage" -delete 2>/dev/null || true
	@echo "Cleanup complete!"

clean-all: clean
	@echo "Removing virtual environment and node_modules..."
	rm -rf $(VENV)
	rm -rf frontend/node_modules
	@echo "Full cleanup complete!"
