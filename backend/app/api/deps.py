from fastapi import Depends, HTTPException, status, Security
from fastapi.security import OAuth2PasswordBearer, APIKeyHeader
from jose import jwt, JWTError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.config import settings
from app.db.session import get_db
from app.models.core import User, APIKey
from app.core.security_keys import verify_api_key

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

async def get_current_user(
    db: AsyncSession = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    result = await db.execute(select(User).where(User.id == int(user_id)))
    user = result.scalars().first()
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    # Here you'd check if user is active, etc.
    return current_user

async def get_current_admin_user(
    current_user: User = Depends(get_current_active_user),
) -> User:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not enough privileges"
        )
    return current_user

async def verify_api_key_dependency(
    api_key: str = Security(api_key_header), db: AsyncSession = Depends(get_db)
) -> APIKey:
    """Validates an incoming API Key header. Used for server-to-server or SDK calls."""
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing API Key header"
        )
    
    # Expected format: "oc_{prefix}.{secret}"
    try:
        header_parts = api_key.split(".")
        if len(header_parts) != 2 or not header_parts[0].startswith("oc_"):
            raise ValueError()
        prefix = header_parts[0][3:] # strip 'oc_'
        secret_part = header_parts[1]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid API Key format")

    result = await db.execute(select(APIKey).where(APIKey.prefix == prefix, APIKey.is_active == True))
    db_api_key = result.scalars().first()
    
    if not db_api_key or not verify_api_key(secret_part, db_api_key.hashed_secret):
        raise HTTPException(status_code=401, detail="Invalid or revoked API Key")
        
    return db_api_key
