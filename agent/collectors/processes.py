"""
Process Collector
Scans running processes, detects suspicious activity.
"""
import psutil
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import SUSPICIOUS_PROCESSES, HIGH_CPU_THRESHOLD


def collect():
    """Returns running process summary and flagged suspicious processes."""
    processes = []
    suspicious = []
    total = 0

    for proc in psutil.process_iter(["pid", "name", "cpu_percent", "memory_percent", "username"]):
        try:
            info = proc.info
            total += 1

            # Check if suspicious
            name_lower = info["name"].lower() if info["name"] else ""
            is_suspicious = False
            reason = ""

            if name_lower in [s.lower() for s in SUSPICIOUS_PROCESSES]:
                is_suspicious = True
                reason = "Known malicious tool"

            elif info["cpu_percent"] and info["cpu_percent"] > HIGH_CPU_THRESHOLD:
                is_suspicious = True
                reason = f"High CPU usage ({info['cpu_percent']:.1f}%)"

            if is_suspicious:
                suspicious.append({
                    "name": info["name"],
                    "pid": info["pid"],
                    "cpu": round(info["cpu_percent"] or 0, 1),
                    "memory": round(info["memory_percent"] or 0, 1),
                    "user": info.get("username", ""),
                    "reason": reason,
                })

        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            continue

    return {
        "total_count": total,
        "suspicious": suspicious,
    }
