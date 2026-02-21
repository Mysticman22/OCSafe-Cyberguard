from fastapi import APIRouter
from app.api.v1.endpoints import auth, api_keys, devices, policies, telemetry, dashboard, alerts, clients

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(api_keys.router, prefix="/keys", tags=["api_keys"])
api_router.include_router(devices.router, prefix="/devices", tags=["devices"])
api_router.include_router(policies.router, prefix="/policies", tags=["policies"])
api_router.include_router(telemetry.router, prefix="/telemetry", tags=["telemetry"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["alerts"])
api_router.include_router(clients.router, prefix="/clients", tags=["clients"])
