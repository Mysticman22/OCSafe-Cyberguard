"""Create the ocsafe database if it doesn't exist, then create all tables."""
import asyncio
import asyncpg
from app.core.config import settings

async def setup():
    print(f"Connecting to PostgreSQL as {settings.POSTGRES_USER}@{settings.POSTGRES_SERVER}:{settings.POSTGRES_PORT}...")
    try:
        conn = await asyncpg.connect(
            user=settings.POSTGRES_USER,
            password=settings.POSTGRES_PASSWORD,
            host=settings.POSTGRES_SERVER,
            port=int(settings.POSTGRES_PORT),
            database='postgres'
        )
        print("[OK] PostgreSQL connection successful!")
        
        exists = await conn.fetchval("SELECT 1 FROM pg_database WHERE datname=$1", settings.POSTGRES_DB)
        if not exists:
            await conn.execute(f'CREATE DATABASE {settings.POSTGRES_DB}')
            print(f"[OK] Database '{settings.POSTGRES_DB}' created!")
        else:
            print(f"[OK] Database '{settings.POSTGRES_DB}' already exists.")
        await conn.close()
    except Exception as e:
        print(f"[ERROR] Connection failed: {e}")
        return

    from app.db.base_class import Base
    from app.db.session import engine
    from app.models.core import Organization, User, Device, APIKey, Policy, DeviceAction, AuditLog

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    print("[OK] All tables created!")
    print("\nTables:")
    for name in Base.metadata.tables:
        print(f"  - {name}")
    
    print("\n[DONE] Database setup complete! Backend is ready.")

if __name__ == "__main__":
    asyncio.run(setup())
