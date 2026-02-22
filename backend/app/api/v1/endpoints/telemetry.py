from typing import Dict, Any
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import json

from app.api import deps
from app.db.session import get_db
from app.db.mongodb import mongodb
from app.models.core import Device, APIKey
from app.services.threat_engine import threat_engine
from app.core.sockets import manager

router = APIRouter()

@router.post("/ingest")
async def ingest_telemetry(
    payload: Dict[str, Any],
    db: AsyncSession = Depends(get_db),
    api_key: APIKey = Depends(deps.verify_api_key_dependency)
):
    """
    Accepts high-throughput telemetry logs from the OS Agents.
    Pushes data to MongoDB for storage and evaluates it against the Threat Engine.
    """
    device_id = payload.get("device_id")
    if not device_id:
        raise HTTPException(status_code=400, detail="Missing device_id")
        
    result = await db.execute(
        select(Device).where(
            Device.id == device_id, 
            Device.organization_id == api_key.organization_id
        )
    )
    device = result.scalars().first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
        
    # 1. Evaluate payload against Threat Engine
    eval_result = await threat_engine.evaluate_telemetry(device.id, payload)
    
    # 2. Store raw telemetry into MongoDB async
    if mongodb.db is not None:
        log_entry = {
            "device_id": device.id,
            "organization_id": api_key.organization_id,
            "timestamp": datetime.utcnow(),
            "payload": payload,
            "threat_evaluation": eval_result
        }
        await mongodb.db.telemetry_logs.insert_one(log_entry)
        
        if eval_result.get("is_threat"):
            # Store in dedicated high-priority threats collection
            await mongodb.db.active_threats.insert_one(log_entry)
            
            # Broadcast to SOC Dashboard
            alert_msg = json.dumps({"type": "threat_alert", "data": eval_result})
            await manager.broadcast_to_org(alert_msg, api_key.organization_id)
            
    return {"status": "ingested", "threat_evaluation": eval_result}
