from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc

from app.api import deps
from app.db.session import get_db
from app.models.core import AuditLog, User
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

router = APIRouter()

class AuditLogSchema(BaseModel):
    id: int
    user_id: Optional[int]
    action: str
    details: Optional[str]
    ip_address: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

@router.get("/", response_model=List[AuditLogSchema])
async def get_audit_logs(
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(deps.get_current_admin_user)
):
    """
    Fetch the most recent audit logs for the organization (Admin only).
    """
    result = await db.execute(
        select(AuditLog)
        .where(AuditLog.organization_id == current_admin.organization_id)
        .order_by(desc(AuditLog.created_at))
        .limit(limit)
    )
    return result.scalars().all()
