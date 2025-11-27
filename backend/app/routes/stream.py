from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from modules.get_stream import get_stream
from pydantic import BaseModel, Field
from configs.api_config import url, headers

class StreamRequest(BaseModel):
    prompt: str = Field(..., min_length=1)


router = APIRouter()

@router.post("/stream")
async def stream(request: StreamRequest):

    async def response_generator(prompt: str):
        body = {
            "prompt" : prompt
        }
        async for response in get_stream(body, headers, url):
            yield response

    return StreamingResponse(
        response_generator(request.prompt),
        media_type="application/x-ndjson",
    )

