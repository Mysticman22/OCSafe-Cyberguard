from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.api import deps
from app.db.session import get_db
from app.models.core import Device, APIKey
from app.schemas.core import Device as DeviceSchema, DeviceCreate

router = APIRouter()

@router.post("/enroll", response_model=DeviceSchema)
async def enroll_device(
    *,
    db: AsyncSession = Depends(get_db),
    device_in: DeviceCreate,
    api_key: APIKey = Depends(deps.verify_api_key_dependency)
):
    """
    Register a new OS-Level Agent device.
    Uses the organization's API Key for authentication.
    """
    # Verify the API key belongs to the organization enrolling the device
    if api_key.organization_id != device_in.organization_id:
        raise HTTPException(status_code=403, detail="API Key does not match organization")
        
    db_device = Device(
        hostname=device_in.hostname,
        os_type=device_in.os_type,
        mac_address=device_in.mac_address,
        organization_id=device_in.organization_id,
        status="active"
    )
    db.add(db_device)
    await db.commit()
    await db.refresh(db_device)
    return db_device

@router.post("/{device_id}/heartbeat")
async def device_heartbeat(
    device_id: int,
    db: AsyncSession = Depends(get_db),
    api_key: APIKey = Depends(deps.verify_api_key_dependency)
):
    """
    Receive heartbeat from the OS agent to mark it as online.
    """
    result = await db.execute(
        select(Device).where(
            Device.id == device_id, 
            Device.organization_id == api_key.organization_id
        )
    )
    device = result.scalars().first()
    
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
        
    device.last_heartbeat = datetime.utcnow()
    db.add(device)
    await db.commit()
    
    return {"status": "ok", "message": "Heartbeat updated"}

@router.get("/", response_model=List[DeviceSchema])
async def list_devices(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(deps.get_current_active_user)
):
    """List devices in the admin dashboard (User token auth)"""
    result = await db.execute(
        select(Device).where(Device.organization_id == current_user.organization_id)
    )
    return result.scalars().all()
