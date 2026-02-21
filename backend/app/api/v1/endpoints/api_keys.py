from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.api import deps
from app.core.security_keys import generate_api_key
from app.db.session import get_db
from app.models.core import APIKey, User
from app.schemas.core import APIKey as APIKeySchema, APIKeyCreate

router = APIRouter()

@router.post("/", response_model=dict)
async def create_api_key(
    *,
    db: AsyncSession = Depends(get_db),
    api_key_in: APIKeyCreate,
    current_user: User = Depends(deps.get_current_active_user)
) -> dict:
    """
    Create a new API key.
    Note: The raw key is only returned ONCE. Store it securely.
    """
    # Enforce basic permissions
    if current_user.role != "admin" and current_user.organization_id != api_key_in.organization_id:
        raise HTTPException(status_code=403, detail="Not enough privileges")
        
    prefix, raw_key, hashed_secret = generate_api_key()
    
    db_api_key = APIKey(
        prefix=prefix,
        hashed_secret=hashed_secret,
        name=api_key_in.name,
        organization_id=api_key_in.organization_id,
        is_active=api_key_in.is_active
    )
    db.add(db_api_key)
    await db.commit()
    await db.refresh(db_api_key)
    
    return {"api_key": raw_key, "id": db_api_key.id}

@router.get("/", response_model=List[APIKeySchema])
async def read_api_keys(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> List[APIKeySchema]:
    """Retrieve all active API keys for the current organization."""
    result = await db.execute(
        select(APIKey).where(
            APIKey.organization_id == current_user.organization_id,
        )
    )
    return result.scalars().all()
    
@router.delete("/{api_key_id}")
async def revoke_api_key(
    api_key_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> dict:
    """Soft delete/revoke an API Key."""
    result = await db.execute(
        select(APIKey).where(
            APIKey.id == api_key_id, 
            APIKey.organization_id == current_user.organization_id
        )
    )
    api_key = result.scalars().first()
    if not api_key:
        raise HTTPException(status_code=404, detail="API Key not found")
        
    api_key.is_active = False
    db.add(api_key)
    await db.commit()
    return {"message": "API key revoked"}
