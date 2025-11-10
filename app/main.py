from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.api.routes import router

app = FastAPI(
    title="Pandora Jewelry Showcase",
    description="Luxury jewelry e-commerce PWA",
    version="1.0.0",
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include API routes
app.include_router(router, prefix="/api", tags=["products"])


@app.get("/")
async def read_index():
    """Serve the main HTML page"""
    return FileResponse("templates/index.html")


@app.get("/wishlist.html")
async def read_wishlist():
    """Serve the wishlist page"""
    return FileResponse("templates/wishlist.html")


@app.get("/manifest.json")
async def get_manifest():
    """Serve PWA manifest"""
    return FileResponse("static/manifest.json")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
