# OCSafe Agent Configuration

# Backend API server URL
SERVER_URL = "http://localhost:8000"
API_BASE = "/api/v1"

# Device API Key (get this from admin dashboard after enrolling device)
API_KEY = "oc_YOURPREFIX.YOURSECRET"

# Device ID (assigned after enrollment)
DEVICE_ID = None  # Will be set after enrollment

# Collection interval in seconds
COLLECT_INTERVAL = 30

# What to collect
COLLECTORS = {
    "system": True,      # CPU, RAM, Disk, OS info
    "security": True,    # Firewall, AV, Windows Updates
    "processes": True,   # Running processes, suspicious detection
    "network": True,     # Active connections, open ports
}

# Suspicious process names (flagged automatically)
SUSPICIOUS_PROCESSES = [
    "mimikatz.exe", "nc.exe", "ncat.exe", "netcat.exe",
    "psexec.exe", "procdump.exe", "lazagne.exe",
    "wce.exe", "fgdump.exe", "pwdump.exe",
    "sharphound.exe", "rubeus.exe",
]

# High CPU threshold (flag processes above this %)
HIGH_CPU_THRESHOLD = 85.0
