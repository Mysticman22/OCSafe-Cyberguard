import secrets
from passlib.context import CryptContext

key_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def generate_api_key() -> tuple[str, str, str]:
    """
    Generates a secure API key.
    Returns:
        prefix (str): A public identifier for the key (to look it up in DB).
        raw_key (str): The full key given to the user (prefix.secret).
        hashed_secret (str): The bcrypt hash of the secret part, stored in DB.
    """
    prefix = secrets.token_hex(8)
    secret_part = secrets.token_urlsafe(32)
    raw_key = f"oc_{prefix}.{secret_part}"
    
    hashed_secret = key_context.hash(secret_part)
    return prefix, raw_key, hashed_secret

def verify_api_key(secret_part: str, hashed_secret: str) -> bool:
    return key_context.verify(secret_part, hashed_secret)
