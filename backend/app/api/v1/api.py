from fastapi import APIRouter
from app.api.v1.endpoints import auth, devices, threats, alerts

api_router = APIRouter()

# api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
# api_router.include_router(devices.router, prefix="/devices", tags=["devices"])
# api_router.include_router(threats.router, prefix="/threats", tags=["threats"])
# api_router.include_router(alerts.router, prefix="/alerts", tags=["alerts"])
