import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, Response
import uvicorn

from config import settings
from database import engine, Base
from routes import router

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.APP_NAME, version=settings.APP_VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix=settings.API_PREFIX)

FRONTEND = Path(__file__).resolve().parent.parent / "frontend"

if FRONTEND.is_dir():
    app.mount("/css", StaticFiles(directory=str(FRONTEND / "css")), name="css")
    app.mount("/js", StaticFiles(directory=str(FRONTEND / "js")), name="js")


@app.get("/favicon.ico")
def favicon():
    return Response(content="", media_type="image/x-icon")

@app.get("/health")
def health():
    return {"status": "ok", "versao": settings.APP_VERSION}


@app.get("/")
def index():
    html = FRONTEND / "index.html"
    if html.exists():
        return FileResponse(str(html))
    return {"erro": "Frontend não encontrado"}


if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=settings.DEBUG)
