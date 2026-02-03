#!/bin/bash

# Tea Store Demo - Test Runner
# This script runs all tests for both backend and frontend

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Track test results
BACKEND_RESULT=0
FRONTEND_UNIT_RESULT=0
E2E_RESULT=0

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Tea Store Demo - Test Runner${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Parse arguments
RUN_E2E=false
RUN_COVERAGE=false
RUN_HEADED=false

for arg in "$@"; do
    case $arg in
        --e2e)
            RUN_E2E=true
            shift
            ;;
        --coverage)
            RUN_COVERAGE=true
            shift
            ;;
        --headed)
            RUN_HEADED=true
            shift
            ;;
        --help)
            echo "Usage: ./test.sh [options]"
            echo ""
            echo "Options:"
            echo "  --e2e       Run E2E tests (requires services to be running)"
            echo "  --headed    Run E2E tests in headed mode (visible browser)"
            echo "  --coverage  Run tests with coverage reports"
            echo "  --help      Show this help message"
            echo ""
            echo "By default, runs backend (pytest) and frontend unit tests (vitest)"
            exit 0
            ;;
    esac
done

# ============================================
# Backend Tests (pytest)
# ============================================
echo -e "${YELLOW}[1/3] Running Backend Tests (pytest)...${NC}"
echo ""

cd "$SCRIPT_DIR/backend"

# Activate virtual environment
if [ -d "venv" ]; then
    source venv/bin/activate
else
    echo -e "${RED}  ✗ Backend virtual environment not found${NC}"
    echo -e "  Run ./start.sh first to set up dependencies"
    BACKEND_RESULT=1
fi

if [ $BACKEND_RESULT -eq 0 ]; then
    if $RUN_COVERAGE; then
        pytest tests/ -v --cov=app --cov-report=term-missing --cov-report=html:coverage_html || BACKEND_RESULT=$?
    else
        pytest tests/ -v || BACKEND_RESULT=$?
    fi
fi

if [ $BACKEND_RESULT -eq 0 ]; then
    echo -e "${GREEN}  ✓ Backend tests passed${NC}"
else
    echo -e "${RED}  ✗ Backend tests failed${NC}"
fi
echo ""

# ============================================
# Frontend Unit Tests (vitest)
# ============================================
echo -e "${YELLOW}[2/3] Running Frontend Unit Tests (vitest)...${NC}"
echo ""

cd "$SCRIPT_DIR/frontend"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}  Installing frontend dependencies...${NC}"
    npm install --silent
fi

if $RUN_COVERAGE; then
    npm run test:coverage || FRONTEND_UNIT_RESULT=$?
else
    npm run test || FRONTEND_UNIT_RESULT=$?
fi

if [ $FRONTEND_UNIT_RESULT -eq 0 ]; then
    echo -e "${GREEN}  ✓ Frontend unit tests passed${NC}"
else
    echo -e "${RED}  ✗ Frontend unit tests failed${NC}"
fi
echo ""

# ============================================
# E2E Tests (playwright) - Optional
# ============================================
if $RUN_E2E; then
    echo -e "${YELLOW}[3/3] Running E2E Tests (playwright)...${NC}"
    echo ""

    cd "$SCRIPT_DIR"

    # Ensure root dependencies are installed (includes playwright via postinstall)
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}  Installing root dependencies...${NC}"
        npm install
    fi

    if $RUN_HEADED; then
        npx playwright test --headed || E2E_RESULT=$?
    else
        npx playwright test || E2E_RESULT=$?
    fi

    if [ $E2E_RESULT -eq 0 ]; then
        echo -e "${GREEN}  ✓ E2E tests passed${NC}"
    else
        echo -e "${RED}  ✗ E2E tests failed${NC}"
    fi
    echo ""
else
    echo -e "${BLUE}[3/3] Skipping E2E Tests${NC}"
    echo -e "  (Run with --e2e flag to include E2E tests)"
    echo ""
fi

# ============================================
# Summary
# ============================================
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Test Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Calculate overall result
OVERALL_RESULT=0

if [ $BACKEND_RESULT -eq 0 ]; then
    echo -e "  Backend (pytest):     ${GREEN}PASSED${NC}"
else
    echo -e "  Backend (pytest):     ${RED}FAILED${NC}"
    OVERALL_RESULT=1
fi

if [ $FRONTEND_UNIT_RESULT -eq 0 ]; then
    echo -e "  Frontend (vitest):    ${GREEN}PASSED${NC}"
else
    echo -e "  Frontend (vitest):    ${RED}FAILED${NC}"
    OVERALL_RESULT=1
fi

if $RUN_E2E; then
    if [ $E2E_RESULT -eq 0 ]; then
        echo -e "  E2E (playwright):     ${GREEN}PASSED${NC}"
    else
        echo -e "  E2E (playwright):     ${RED}FAILED${NC}"
        OVERALL_RESULT=1
    fi
else
    echo -e "  E2E (playwright):     ${YELLOW}SKIPPED${NC}"
fi

echo ""

if [ $OVERALL_RESULT -eq 0 ]; then
    echo -e "${GREEN}All tests passed!${NC}"
else
    echo -e "${RED}Some tests failed.${NC}"
fi

echo ""
exit $OVERALL_RESULT
