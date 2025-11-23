import httpx
from configs.api_config import url, headers, TIMEOUT, pre_prompt
from typing import AsyncGenerator
import httpx

async def stream(
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

async def response_generator(prompt: str):
    body = {
        "prompt" : f"Requirements: {pre_prompt}. Prompt: {prompt}"
    }
    async for response in stream(body, headers, url):
        yield response
