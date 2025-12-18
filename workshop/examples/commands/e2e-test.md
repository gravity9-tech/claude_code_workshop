---
description: Run E2E tests using Playwright
argument-hint: [test scenario]
---

Run end-to-end tests on http://localhost:8000 using Playwright.

## Setup

First, ensure Playwright and Chromium are installed:

1. Check if Playwright is installed by running: `npx playwright --version`
2. If not installed or Chromium is missing, run: `npx playwright install chromium`
3. Wait for installation to complete before proceeding with tests

## Test Execution

Use Playwright to spin up a Chromium browser and run tests.

Test scenario: $ARGUMENTS

If no scenario specified, run a **full test suite** covering:

### 1. Homepage Tests
- Navigate to http://localhost:8000
- Verify the page title and main elements load correctly
- Check that product grid is visible
- Take a screenshot of the homepage

### 2. Category Filtering Tests
- Click each category filter button
- Verify products are filtered correctly for each category
- Verify "All" category shows all products
- Take screenshots showing filtered results

### 3. Product Display Tests
- Verify product cards display name, price, and image
- Check that "Add to Cart" buttons are present on all products

### 4. Add to Cart Tests
- Add a single product to cart
- Verify cart count updates
- Add multiple products to cart
- Verify cart reflects all added items

### 5. Cart Functionality Tests
- Open the cart
- Verify cart displays correct items and quantities
- Test quantity increment/decrement if available
- Verify cart total calculation is accurate
- Test remove item functionality
- Take a screenshot of cart with items

### 6. Edge Cases
- Test adding same product multiple times
- Test empty cart state
- Verify prices format correctly

## Test Reporting

For each test:
- Describe what you're testing
- Execute the test action using Playwright
- Capture any errors or unexpected behavior
- Report PASS/FAIL with details

## Summary

At the end, provide:
- Total tests run
- Tests passed
- Tests failed (with failure reasons)
- Screenshots taken
- Any recommendations for fixes
