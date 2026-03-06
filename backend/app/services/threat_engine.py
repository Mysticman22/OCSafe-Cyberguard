"""
OCSafe Threat Engine
====================
Rule-based threat detection that evaluates incoming telemetry.
Flags disabled security, suspicious processes, and anomalous network activity.
"""
from typing import Any, Dict, List


class ThreatEngine:
    def evaluate_telemetry(self, device_id: int, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Evaluate incoming telemetry against security rules.
        Returns threat assessment with risk score.
        """
        reasons = []
        risk_score = 0

        # --- Security Status Checks ---
        security = payload.get("security", {})
        if security and not security.get("error"):
            if security.get("firewall_enabled") is False:
                reasons.append("Windows Firewall is DISABLED")
                risk_score += 30

            if security.get("antivirus_enabled") is False:
                reasons.append(f"Antivirus ({security.get('antivirus_name', 'Unknown')}) is DISABLED")
                risk_score += 30

            pending = security.get("windows_update_pending", 0)
            if pending > 5:
                reasons.append(f"{pending} Windows updates pending")
                risk_score += 15

        # --- Suspicious Process Checks ---
        processes = payload.get("processes", {})
        if processes and not processes.get("error"):
            suspicious = processes.get("suspicious", [])
            for proc in suspicious:
                reason = proc.get("reason", "Suspicious activity")
                reasons.append(f"Suspicious process: {proc.get('name', 'unknown')} - {reason}")
                risk_score += 25

        # --- Network Checks ---
        network = payload.get("network", {})
        if network and not network.get("error"):
            # Flag common attack ports being open
            dangerous_ports = {4444, 5555, 1337, 31337, 6666, 6667}
            open_ports = set(network.get("open_ports", []))
            flagged_ports = open_ports & dangerous_ports
            if flagged_ports:
                reasons.append(f"Suspicious open ports: {sorted(flagged_ports)}")
                risk_score += 20

        # --- System Health Checks ---
        system = payload.get("system", {})
        if system and not system.get("error"):
            if system.get("disk_percent", 0) > 95:
                reasons.append(f"Disk almost full ({system['disk_percent']}%)")
                risk_score += 10

        # Cap risk score at 100
        risk_score = min(risk_score, 100)

        return {
            "is_threat": len(reasons) > 0,
            "reasons": reasons,
            "risk_score": risk_score,
            "threat_count": len(reasons),
        }


threat_engine = ThreatEngine()
