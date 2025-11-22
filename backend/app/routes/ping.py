from fastapi import APIRouter

router = APIRouter()
@router.get("/")
async def ping():
    return {"msg": "Api is working"}