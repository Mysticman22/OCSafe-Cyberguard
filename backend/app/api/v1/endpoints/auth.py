from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.config import settings
from app.core import security
from app.api import deps
from app.db.session import get_db
from app.models.core import User, Organization
from app.schemas.core import UserCreate, User as UserSchema, OrganizationCreate
from sqlalchemy.exc import IntegrityError

router = APIRouter()

@router.get("/me")
async def get_current_user_info(
    current_user: User = Depends(deps.get_current_active_user),
):
    """Return current user info including role for frontend routing."""
    return {
        "id": current_user.id,
        "email": current_user.email,
        "role": current_user.role,
        "organization_id": current_user.organization_id,
    }

@router.post("/login/access-token", response_model=dict)
async def login_access_token(
    db: AsyncSession = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> dict:
    """OAuth2 compatible token login, getting an access token for future requests."""
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalars().first()
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/register/admin", response_model=UserSchema)
async def register_admin(
    org_in: OrganizationCreate,
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Register a new Organization and an Admin user for it.
    """
    # Check if user exists
    result = await db.execute(select(User).where(User.email == user_in.email))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Email already registered")
        
    # Create org
    db_org = Organization(name=org_in.name)
    db.add(db_org)
    await db.commit()
    await db.refresh(db_org)
    
    # Create admin
    user_in.role = "admin"
    user_in.organization_id = db_org.id
    hashed_password = security.get_password_hash(user_in.password)
    db_user = User(
        email=user_in.email,
        hashed_password=hashed_password,
        role=user_in.role,
        organization_id=db_org.id
    )
    db.add(db_user)
    try:
        await db.commit()
        await db.refresh(db_user)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Database integrity error")
    return db_user

@router.post("/register/user", response_model=UserSchema)
async def register_user(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Register a standard user.
    If no organization_id is provided, auto-assign to the default org or create one.
    """
    result = await db.execute(select(User).where(User.email == user_in.email))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Auto-assign organization if not provided
    org_id = user_in.organization_id
    if not org_id:
        # Use the first existing org, or create a default one
        org_result = await db.execute(select(Organization).limit(1))
        org = org_result.scalars().first()
        if not org:
            org = Organization(name="Default Organization")
            db.add(org)
            await db.flush()
        org_id = org.id
        
    user_in.role = "user"
    hashed_password = security.get_password_hash(user_in.password)
    db_user = User(
        email=user_in.email,
        hashed_password=hashed_password,
        role=user_in.role,
        organization_id=org_id
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user
