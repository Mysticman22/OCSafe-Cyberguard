from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any, Dict
from datetime import datetime

# --- Organization Schemas ---
class OrganizationBase(BaseModel):
    name: str

class OrganizationCreate(OrganizationBase):
    pass

class Organization(OrganizationBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    role: str = "user"

class UserCreate(UserBase):
    password: str
    organization_id: Optional[int] = None

class User(UserBase):
    id: int
    organization_id: Optional[int]
    created_at: datetime
    class Config:
        from_attributes = True

# --- Device Schemas ---
class DeviceBase(BaseModel):
    hostname: str
    os_type: str
    mac_address: str
    status: str = "active"

class DeviceCreate(DeviceBase):
    organization_id: int

class Device(DeviceBase):
    id: int
    organization_id: int
    last_heartbeat: datetime
    class Config:
        from_attributes = True

# --- API Key Schemas ---
class APIKeyBase(BaseModel):
    name: Optional[str] = None
    is_active: bool = True

class APIKeyCreate(APIKeyBase):
    organization_id: int

class APIKey(APIKeyBase):
    id: int
    organization_id: int
    expires_at: Optional[datetime]
    created_at: datetime
    class Config:
        from_attributes = True

# --- Policy Schemas ---
class AdvancedPolicyRules(BaseModel):
    block_usb_storage: bool = False
    dns_blacklist: List[str] = []
    blocked_processes: List[str] = []

class PolicyBase(BaseModel):
    name: str
    rules: AdvancedPolicyRules = AdvancedPolicyRules()

class PolicyCreate(PolicyBase):
    organization_id: int

class Policy(PolicyBase):
    id: int
    organization_id: int
    created_at: datetime
    class Config:
        from_attributes = True

# --- API Action Schemas ---
class DeviceActionBase(BaseModel):
    action_type: str
    payload: Optional[Dict[str, Any]] = None

class DeviceActionCreate(DeviceActionBase):
    device_id: int

class DeviceAction(DeviceActionBase):
    id: int
    device_id: int
    status: str
    created_at: datetime
    completed_at: Optional[datetime]
    class Config:
        from_attributes = True
