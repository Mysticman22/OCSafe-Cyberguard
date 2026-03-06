from typing import Dict, Any
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc

from app.api import deps
from app.db.session import get_db
from app.models.core import Device, APIKey, User, TelemetryLog
from app.services.threat_engine import threat_engine

router = APIRouter()


@router.post("/ingest")
async def ingest_telemetry(
    payload: Dict[str, Any],
    db: AsyncSession = Depends(get_db),
    api_key: APIKey = Depends(deps.verify_api_key_dependency)
):
    """
    Accepts telemetry from OS Agents.
    Stores in PostgreSQL and evaluates against the Threat Engine.
    """
    device_id = payload.get("device_id")
    if not device_id:
        raise HTTPException(status_code=400, detail="Missing device_id")

    result = await db.execute(
        select(Device).where(
            Device.id == device_id,
            Device.organization_id == api_key.organization_id
        )
    )
    device = result.scalars().first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    # Update device heartbeat
    device.last_heartbeat = datetime.utcnow()
    db.add(device)

    # Evaluate threats
    eval_result = threat_engine.evaluate_telemetry(device.id, payload)

    # Store in PostgreSQL
    log = TelemetryLog(
        device_id=device.id,
        organization_id=api_key.organization_id,
        payload=payload,
        threat_evaluation=eval_result,
    )
    db.add(log)
    await db.commit()

    return {"status": "ingested", "threat_evaluation": eval_result}


@router.get("/latest/{device_id}")
async def get_latest_telemetry(
    device_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """
    Get the most recent telemetry for a device.
    """
    result = await db.execute(
        select(TelemetryLog)
        .where(TelemetryLog.device_id == device_id)
        .order_by(desc(TelemetryLog.created_at))
        .limit(1)
    )
    log = result.scalars().first()

    if not log:
        return {"message": "No telemetry data available", "data": None}

    return {"data": log.payload}


@router.get("/history/{device_id}")
async def get_telemetry_history(
    device_id: int,
    hours: int = Query(default=24, le=168),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """
    Get telemetry history for charts (last N hours).
    """
    since = datetime.utcnow() - timedelta(hours=hours)
    result = await db.execute(
        select(TelemetryLog)
        .where(
            TelemetryLog.device_id == device_id,
            TelemetryLog.created_at >= since
        )
        .order_by(TelemetryLog.created_at)
        .limit(500)
    )
    logs = result.scalars().all()

    history = []
    for log in logs:
        system_data = (log.payload or {}).get("system", {})
        history.append({
            "timestamp": log.created_at.isoformat() if log.created_at else "",
            "cpu_percent": system_data.get("cpu_percent", 0),
            "ram_percent": system_data.get("ram_percent", 0),
            "disk_percent": system_data.get("disk_percent", 0),
        })

    return {"device_id": device_id, "hours": hours, "data": history}


@router.get("/summary")
async def get_org_telemetry_summary(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """
    Get latest telemetry per device for the admin fleet overview.
    """
    # Get all devices in the org
    device_result = await db.execute(
        select(Device).where(Device.organization_id == current_user.organization_id)
    )
    devices = device_result.scalars().all()

    results = []
    for device in devices:
        # Get latest telemetry for each device
        log_result = await db.execute(
            select(TelemetryLog)
            .where(TelemetryLog.device_id == device.id)
            .order_by(desc(TelemetryLog.created_at))
            .limit(1)
        )
        log = log_result.scalars().first()

        payload = log.payload if log else {}
        system_data = payload.get("system", {})
        security_data = payload.get("security", {})

        results.append({
            "device_id": device.id,
            "hostname": system_data.get("hostname", device.hostname or "Unknown"),
            "os_type": device.os_type or system_data.get("os_name", ""),
            "status": device.status,
            "cpu_percent": system_data.get("cpu_percent", 0),
            "ram_percent": system_data.get("ram_percent", 0),
            "disk_percent": system_data.get("disk_percent", 0),
            "firewall_enabled": security_data.get("firewall_enabled", False),
            "antivirus_enabled": security_data.get("antivirus_enabled", False),
            "last_seen": device.last_heartbeat.isoformat() if device.last_heartbeat else "",
        })

    return {"devices": results, "total": len(results)}
