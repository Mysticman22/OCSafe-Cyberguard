from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "OCSafe Cyberguard"
    PROJECT_VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    
    # Generate a secure key for production
    SECRET_KEY: str = "change_this_to_a_secure_random_key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "password"
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: str = "5432"
    POSTGRES_DB: str = "ocsafe"
    
    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DB: str = "ocsafe_logs"

    class Config:
        env_file = ".env"

settings = Settings()
