from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.api import deps
from app.db.session import get_db
from app.models.core import User, AuditLog
from app.schemas.core import User as UserSchema, UserCreate
from app.core import security

router = APIRouter()

@router.get("/", response_model=List[UserSchema])
async def list_users(
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(deps.get_current_admin_user)
):
    """
    List all users in the organization (Admin only).
    """
    result = await db.execute(select(User).where(
        User.organization_id == current_admin.organization_id
    ))
    return result.scalars().all()

@router.delete("/{user_id}")
async def remove_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(deps.get_current_admin_user)
):
    """
    Remove a user from the organization (Admin only).
    """
    if user_id == current_admin.id:
        raise HTTPException(status_code=400, detail="Cannot remove yourself")
        
    result = await db.execute(select(User).where(
        User.id == user_id,
        User.organization_id == current_admin.organization_id
    ))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Log the action
    audit_log = AuditLog(
        organization_id=current_admin.organization_id,
        user_id=current_admin.id,
        action=f"Removed user {user.email}",
    )
    db.add(audit_log)
    
    await db.delete(user)
    await db.commit()
    return {"message": "User removed successfully"}

@router.put("/{user_id}/role")
async def change_user_role(
    user_id: int,
    role: str,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(deps.get_current_admin_user)
):
    """
    Promote/Demote a user (Admin only). Role must be 'admin' or 'user'.
    """
    if role not in ["admin", "user"]:
        raise HTTPException(status_code=400, detail="Invalid role")
        
    if user_id == current_admin.id:
        raise HTTPException(status_code=400, detail="Cannot change your own role")

    result = await db.execute(select(User).where(
        User.id == user_id,
        User.organization_id == current_admin.organization_id
    ))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user.role = role
    
    # Log the action
    audit_log = AuditLog(
        organization_id=current_admin.organization_id,
        user_id=current_admin.id,
        action=f"Changed user {user.email} role to {role}",
    )
    db.add(audit_log)
    db.add(user)
    await db.commit()
    
    return {"message": f"User role updated to {role}"}
