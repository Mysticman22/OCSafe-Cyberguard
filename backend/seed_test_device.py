"""
OCSafe - Seed a test device and insert sample telemetry data.
Run this to test the full end-to-end flow without needing the agent.

Usage:
  cd c:\\OCPL\\backend
  python seed_test_device.py
"""
import asyncio
import json
from datetime import datetime
from app.db.session import AsyncSessionLocal
from app.models.core import Organization, Device, TelemetryLog, User
from sqlalchemy.future import select

async def seed():
    async with AsyncSessionLocal() as db:
        # 1. Create test organization if not exists
        result = await db.execute(select(Organization).where(Organization.name == "OCSafe Test Org"))
        org = result.scalars().first()
        if not org:
            org = Organization(name="OCSafe Test Org")
            db.add(org)
            await db.flush()
            print(f"[OK] Created organization: {org.name} (ID: {org.id})")
        else:
            print(f"[OK] Organization exists: {org.name} (ID: {org.id})")

        # 2. Update existing users to belong to this org (if they have no org)
        user_result = await db.execute(select(User).where(User.organization_id == None))
        users = user_result.scalars().all()
        for u in users:
            u.organization_id = org.id
            db.add(u)
            print(f"[OK] Linked user {u.email} to org {org.id}")

        # 3. Create test device if not exists
        result = await db.execute(select(Device).where(Device.mac_address == "AA:BB:CC:DD:EE:01"))
        device = result.scalars().first()
        if not device:
            device = Device(
                hostname="SARTHAK-PC",
                os_type="Windows 11",
                mac_address="AA:BB:CC:DD:EE:01",
                status="active",
                organization_id=org.id,
                last_heartbeat=datetime.utcnow(),
            )
            db.add(device)
            await db.flush()
            print(f"[OK] Created device: {device.hostname} (ID: {device.id})")
        else:
            print(f"[OK] Device exists: {device.hostname} (ID: {device.id})")

        # 4. Insert sample telemetry data (simulating real agent data)
        sample_payload = {
            "device_id": device.id,
            "timestamp": datetime.utcnow().isoformat(),
            "system": {
                "cpu_percent": 32.5,
                "cpu_count": 8,
                "cpu_freq_mhz": 3600,
                "ram_percent": 67.3,
                "ram_used_gb": 10.77,
                "ram_total_gb": 16.0,
                "disk_percent": 72.4,
                "disk_used_gb": 345.2,
                "disk_total_gb": 476.8,
                "os_name": "Windows 11",
                "os_version": "10.0.22631",
                "hostname": "SARTHAK-PC",
                "uptime_hours": 48.5,
            },
            "security": {
                "firewall_enabled": True,
                "antivirus_name": "Windows Defender",
                "antivirus_enabled": True,
                "windows_update_pending": 2,
            },
            "processes": {
                "total_count": 287,
                "suspicious": [],
            },
            "network": {
                "active_connections": 42,
                "established_connections": [],
                "open_ports": [80, 443, 5432, 8000, 5173],
                "interfaces": [
                    {"name": "Wi-Fi", "ip": "192.168.1.10", "status": "up", "speed_mbps": 866},
                    {"name": "Ethernet", "ip": "", "status": "down", "speed_mbps": 0},
                ],
                "bytes_sent_mb": 1240.5,
                "bytes_recv_mb": 3876.2,
            },
        }

        log = TelemetryLog(
            device_id=device.id,
            organization_id=org.id,
            payload=sample_payload,
            threat_evaluation={"is_threat": False, "reasons": [], "risk_score": 0, "threat_count": 0},
        )
        db.add(log)
        await db.commit()

        print(f"[OK] Inserted sample telemetry for device {device.id}")
        print(f"\n[DONE] Test data seeded! Device ID: {device.id}")
        print(f"  - Open User Dashboard to see real data")
        print(f"  - Or run the agent: cd agent && python main.py")

if __name__ == "__main__":
    asyncio.run(seed())
