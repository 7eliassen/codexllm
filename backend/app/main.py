from fastapi import FastAPI
from routes.ping import router as ping_route
from routes.stream import router as stream_router

app = FastAPI(
    title="Codex LLM",
    description="Api for Codex LLM",
    version="0.0.0",
)

app.include_router(ping_route)
app.include_router(stream_router)

