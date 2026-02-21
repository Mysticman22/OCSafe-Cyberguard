from typing import List, Dict
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        # Maps organization_id to a list of active WebSockets
        self.active_connections: Dict[int, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, organization_id: int):
        await websocket.accept()
        if organization_id not in self.active_connections:
            self.active_connections[organization_id] = []
        self.active_connections[organization_id].append(websocket)

    def disconnect(self, websocket: WebSocket, organization_id: int):
        if organization_id in self.active_connections:
            self.active_connections[organization_id].remove(websocket)

    async def broadcast_to_org(self, message: str, organization_id: int):
        if organization_id in self.active_connections:
            for connection in self.active_connections[organization_id]:
                await connection.send_text(message)

manager = ConnectionManager()
