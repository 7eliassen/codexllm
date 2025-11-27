import httpx
from configs.api_config import TIMEOUT
from typing import AsyncGenerator
import httpx

async def get_stream(
    data: dict,
    headers: dict,
    url: str
) -> AsyncGenerator[str, None]:
    async with httpx.AsyncClient() as client:
        async with client.stream(
            "POST",
            url=url,
            timeout=httpx.Timeout(TIMEOUT),
            headers=headers,
            json=data,
        ) as response:
            response.raise_for_status()
            async for chunk in response.aiter_text():
                yield chunk