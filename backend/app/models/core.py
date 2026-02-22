from app.db.base_class import Base
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime

class Organization(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    users = relationship("User", back_populates="organization")
    devices = relationship("Device", back_populates="organization")
    api_keys = relationship("APIKey", back_populates="organization")
    policies = relationship("Policy", back_populates="organization")

class User(Base):
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user") # admin, user
    organization_id = Column(Integer, ForeignKey("organization.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    organization = relationship("Organization", back_populates="users")

class Device(Base):
    id = Column(Integer, primary_key=True, index=True)
    hostname = Column(String, index=True)
    os_type = Column(String) # windows, linux, macos
    mac_address = Column(String, unique=True, index=True)
    status = Column(String, default="active") # active, isolated, inactive
    organization_id = Column(Integer, ForeignKey("organization.id"))
    last_heartbeat = Column(DateTime, default=datetime.utcnow)

    organization = relationship("Organization", back_populates="devices")

class APIKey(Base):
    __tablename__ = "api_keys"
    id = Column(Integer, primary_key=True, index=True)
    prefix = Column(String, unique=True, index=True, nullable=False)
    hashed_secret = Column(String, nullable=False)
    name = Column(String)
    organization_id = Column(Integer, ForeignKey("organization.id"))
    expires_at = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    organization = relationship("Organization", back_populates="api_keys")

class Policy(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    rules = Column(JSON, default={}) # JSONB in pg
    organization_id = Column(Integer, ForeignKey("organization.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    organization = relationship("Organization", back_populates="policies")

class DeviceAction(Base):
    """
    Commands sent from the Admin dashboard to the OS Agent.
    E.g., isolation, full_scan, terminate_process
    """
    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(Integer, ForeignKey("device.id"))
    action_type = Column(String, index=True) # isolate, scan, kill
    payload = Column(JSON, nullable=True) # e.g., {"pid": 1234}
    status = Column(String, default="pending") # pending, completed, failed
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    device = relationship("Device")

class AuditLog(Base):
    """
    Tracks actions administrators take on the dashboard.
    """
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organization.id"))
    user_id = Column(Integer, ForeignKey("user.id"), nullable=True) # Might be system action
    action = Column(String) # e.g., "created_policy", "isolated_device"
    details = Column(String)
    ip_address = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    organization = relationship("Organization")
    user = relationship("User")
