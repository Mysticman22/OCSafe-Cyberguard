"""
Security Status Collector
Checks Firewall, Antivirus, and Windows Update status.
Uses WMI on Windows for security center queries.
"""
import subprocess
import platform
import re


def collect():
    """Returns security status of the machine."""
    data = {
        "firewall_enabled": False,
        "antivirus_name": "Unknown",
        "antivirus_enabled": False,
        "windows_update_pending": 0,
        "last_update_date": None,
    }

    if platform.system() != "Windows":
        data["firewall_enabled"] = _check_linux_firewall()
        data["antivirus_name"] = "N/A (Linux)"
        return data

    # --- Windows Firewall ---
    data["firewall_enabled"] = _check_windows_firewall()

    # --- Windows Antivirus ---
    av_name, av_enabled = _check_windows_antivirus()
    data["antivirus_name"] = av_name
    data["antivirus_enabled"] = av_enabled

    # --- Windows Updates ---
    data["windows_update_pending"] = _check_pending_updates()

    return data


def _check_windows_firewall():
    """Check if Windows Firewall is enabled via netsh."""
    try:
        result = subprocess.run(
            ["netsh", "advfirewall", "show", "allprofiles", "state"],
            capture_output=True, text=True, timeout=10
        )
        # Count how many profiles have "ON"
        return "ON" in result.stdout.upper()
    except Exception:
        return False


def _check_windows_antivirus():
    """Query Windows Security Center for AV info via PowerShell."""
    try:
        result = subprocess.run(
            ["powershell", "-Command",
             "Get-CimInstance -Namespace root/SecurityCenter2 -ClassName AntivirusProduct | "
             "Select-Object displayName, productState | ConvertTo-Json"],
            capture_output=True, text=True, timeout=15
        )
        import json
        output = result.stdout.strip()
        if not output:
            return "None Detected", False

        av_data = json.loads(output)
        # Handle single object vs array
        if isinstance(av_data, dict):
            av_data = [av_data]

        for av in av_data:
            name = av.get("displayName", "Unknown")
            state = av.get("productState", 0)
            # Bit 12 indicates if the AV is enabled
            enabled = bool((state >> 12) & 1)
            if enabled:
                return name, True

        # Return first AV name even if not enabled
        return av_data[0].get("displayName", "Unknown"), False
    except Exception:
        return "Unknown", False


def _check_pending_updates():
    """Check number of pending Windows Updates via PowerShell."""
    try:
        result = subprocess.run(
            ["powershell", "-Command",
             "(New-Object -ComObject Microsoft.Update.Session).CreateUpdateSearcher()"
             ".Search('IsInstalled=0').Updates.Count"],
            capture_output=True, text=True, timeout=30
        )
        count = result.stdout.strip()
        return int(count) if count.isdigit() else 0
    except Exception:
        return 0


def _check_linux_firewall():
    """Check if ufw or iptables is active on Linux."""
    try:
        result = subprocess.run(["ufw", "status"], capture_output=True, text=True, timeout=5)
        return "active" in result.stdout.lower()
    except Exception:
        try:
            result = subprocess.run(
                ["iptables", "-L", "-n"],
                capture_output=True, text=True, timeout=5
            )
            return bool(result.stdout.strip())
        except Exception:
            return False
