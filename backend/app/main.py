from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router
from app.core.config import settings
from app.core.sockets import manager

app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Update for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {"message": "Welcome to OCSafe Cyberguard API"}

# SOC Alert WebSocket endpoint
@app.websocket("/ws/alerts/{organization_id}")
async def websocket_endpoint(websocket: WebSocket, organization_id: int):
    # In reality, you'd validate a JWT token from websocket query params here
    await manager.connect(websocket, organization_id)
    try:
        while True:
            data = await websocket.receive_text()
            # Can handle incoming WS data if needed
    except WebSocketDisconnect:
        manager.disconnect(websocket, organization_id)
