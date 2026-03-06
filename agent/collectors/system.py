"""
System Health Collector
Collects CPU, RAM, Disk usage, OS info, and uptime.
"""
import psutil
import platform
import time


def collect():
    """Returns system health metrics."""
    boot_time = psutil.boot_time()
    uptime_seconds = time.time() - boot_time
    uptime_hours = round(uptime_seconds / 3600, 1)

    # CPU
    cpu_percent = psutil.cpu_percent(interval=1)
    cpu_count = psutil.cpu_count()
    cpu_freq = psutil.cpu_freq()

    # RAM
    ram = psutil.virtual_memory()

    # Disk (primary drive — use shutil for Windows compatibility)
    import shutil
    disk_path = "C:\\" if platform.system() == "Windows" else "/"
    disk_total, disk_used, disk_free = shutil.disk_usage(disk_path)
    disk_percent = round((disk_used / disk_total) * 100, 1) if disk_total else 0

    # OS Info
    uname = platform.uname()

    return {
        "cpu_percent": cpu_percent,
        "cpu_count": cpu_count,
        "cpu_freq_mhz": round(cpu_freq.current, 0) if cpu_freq else 0,
        "ram_percent": ram.percent,
        "ram_used_gb": round(ram.used / (1024 ** 3), 2),
        "ram_total_gb": round(ram.total / (1024 ** 3), 2),
        "disk_percent": disk_percent,
        "disk_used_gb": round(disk_used / (1024 ** 3), 1),
        "disk_total_gb": round(disk_total / (1024 ** 3), 1),
        "os_name": f"{uname.system} {uname.release}",
        "os_version": uname.version,
        "hostname": uname.node,
        "uptime_hours": uptime_hours,
    }
