from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.db.session import get_db
from app.models.core import User

router = APIRouter()

@router.get("/score")
async def get_security_score(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Returns the overall device security score (e.g., 85/100)
    for the main dashboard gauge.
    """
    # TODO: Implement actual calculation logic
    # Blank structure for frontend integration
    return {
        "score": 0,
        "max_score": 100,
        "status_label": ""  # e.g., "Good - Secure"
    }

@router.get("/analytics/threats")
async def get_threats_analytics(
    days: int = 7,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Returns data for the 'Threats Detected (Last X Days)' line chart.
    """
    # TODO: Fetch from MongoDB active_threats/telemetry_logs
    return {
        "labels": [], # e.g., [1, 2, 3, 4, 5, 6, 7]
        "data": []    # e.g., [15, 30, 25, 70, 40, 50, 60]
    }

@router.get("/analytics/devices")
async def get_devices_analytics(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Returns data for the 'Devices Online vs Offline' bar charts.
    Provides data over months or specific time periods.
    """
    # TODO: Implement aggregation
    return {
        "labels": [],           # e.g., ["January", "February", ...]
        "online_series": [],    # e.g., [4, 2, 4, 4, 3, 1]
        "offline_series": []    # e.g., [5, 3, 1, 5, 5, 1]
    }

@router.get("/analytics/risk-distribution")
async def get_risk_distribution(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Returns data for the 'Risk Distribution' pie chart.
    """
    # TODO: Aggregate risk levels
    return {
        "low": 0,
        "medium": 0,
        "high": 0
    }
