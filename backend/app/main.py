"""FastAPI application entry point for the Steep House backend.

Creates and configures the FastAPI application instance, sets up
CORS middleware to allow requests from the React frontend dev server
at localhost:4321, and mounts the API router under the /api prefix.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router

app = FastAPI(
    title="Pandora Jewelry API",
    description="Backend API for Pandora Jewelry Store",
    version="1.0.0",
)

# CORS configuration for Angular dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4321",  # Angular dev server
        "http://127.0.0.1:4321",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="/api", tags=["products"])
