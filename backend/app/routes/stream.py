from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from modules.fetch_ndsjon import response_generator
from pydantic import BaseModel, Field

class StreamRequest(BaseModel):
    prompt: str = Field(..., min_length=1)


router = APIRouter()

@router.post("/stream")
async def stream(request: StreamRequest):
    return StreamingResponse(
        response_generator(request.prompt),
        media_type="application/x-ndjson",
    )