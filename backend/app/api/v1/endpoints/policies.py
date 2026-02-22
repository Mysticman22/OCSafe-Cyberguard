from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.api import deps
from app.db.session import get_db
from app.models.core import Policy, User, Device, AuditLog
from app.schemas.core import Policy as PolicySchema, PolicyCreate

router = APIRouter()

@router.post("/", response_model=PolicySchema)
async def create_policy(
    *,
    db: AsyncSession = Depends(get_db),
    policy_in: PolicyCreate,
    current_user: User = Depends(deps.get_current_active_user)
):
    """Create a new security policy rule for the organization"""
    if current_user.organization_id != policy_in.organization_id:
        raise HTTPException(status_code=403, detail="Not enough privileges")
        
    db_policy = Policy(
        name=policy_in.name,
        rules=policy_in.rules.dict(),
        organization_id=policy_in.organization_id
    )
    db.add(db_policy)
    
    # Log the action
    audit_log = AuditLog(
        organization_id=current_user.organization_id,
        user_id=current_user.id,
        action=f"Created policy '{policy_in.name}'",
    )
    db.add(audit_log)

    await db.commit()
    await db.refresh(db_policy)
    return db_policy

@router.get("/", response_model=List[PolicySchema])
async def list_policies(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """List all policies for the admin dashboard"""
    result = await db.execute(
        select(Policy).where(Policy.organization_id == current_user.organization_id)
    )
    return result.scalars().all()

@router.get("/device/{device_id}", response_model=List[PolicySchema])
async def get_device_policies(
    device_id: int,
    db: AsyncSession = Depends(get_db),
    # Using API Key authentication so the Agent itself can fetch policies
    api_key = Depends(deps.verify_api_key_dependency)
):
    """Endpoint for the OS Agent to download its active policies"""
    result = await db.execute(
        select(Device).where(
            Device.id == device_id, 
            Device.organization_id == api_key.organization_id
        )
    )
    device = result.scalars().first()
    
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
        
    # In a full system, you might map policies specifically to devices.
    # For now, return all org policies to the device.
    policies = await db.execute(
        select(Policy).where(Policy.organization_id == api_key.organization_id)
    )
    return policies.scalars().all()
