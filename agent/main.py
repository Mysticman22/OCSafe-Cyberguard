"""
OCSafe Cyberguard - OS Agent
=============================
Silent background agent that collects system telemetry and sends it to the backend.

Usage:
  1. Set your API_KEY and DEVICE_ID in config.py
  2. Run: python main.py
"""
import time
import json
import requests
import schedule
import logging
from datetime import datetime, timezone

from config import SERVER_URL, API_BASE, API_KEY, DEVICE_ID, COLLECT_INTERVAL, COLLECTORS
from collectors import system, security, processes, network

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("ocsafe-agent")


def collect_telemetry():
    """Collect data from all enabled collectors and build the payload."""
    payload = {
        "device_id": DEVICE_ID,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

    if COLLECTORS.get("system"):
        try:
            payload["system"] = system.collect()
            logger.info(
                "System: CPU=%.1f%% RAM=%.1f%% Disk=%.1f%%",
                payload["system"]["cpu_percent"],
                payload["system"]["ram_percent"],
                payload["system"]["disk_percent"],
            )
        except Exception as e:
            logger.error("System collector failed: %s", e)
            payload["system"] = {"error": str(e)}

    if COLLECTORS.get("security"):
        try:
            payload["security"] = security.collect()
            logger.info(
                "Security: Firewall=%s AV=%s",
                payload["security"]["firewall_enabled"],
                payload["security"]["antivirus_name"],
            )
        except Exception as e:
            logger.error("Security collector failed: %s", e)
            payload["security"] = {"error": str(e)}

    if COLLECTORS.get("processes"):
        try:
            payload["processes"] = processes.collect()
            suspicious_count = len(payload["processes"].get("suspicious", []))
            logger.info(
                "Processes: %d total, %d suspicious",
                payload["processes"]["total_count"],
                suspicious_count,
            )
        except Exception as e:
            logger.error("Process collector failed: %s", e)
            payload["processes"] = {"error": str(e)}

    if COLLECTORS.get("network"):
        try:
            payload["network"] = network.collect()
            logger.info(
                "Network: %d connections, %d open ports",
                payload["network"]["active_connections"],
                len(payload["network"]["open_ports"]),
            )
        except Exception as e:
            logger.error("Network collector failed: %s", e)
            payload["network"] = {"error": str(e)}

    return payload


def send_telemetry(payload):
    """Send collected telemetry to the backend API."""
    url = f"{SERVER_URL}{API_BASE}/telemetry/ingest"
    headers = {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
    }

    try:
        resp = requests.post(url, json=payload, headers=headers, timeout=10)
        if resp.status_code == 200:
            result = resp.json()
            threat_eval = result.get("threat_evaluation", {})
            if threat_eval.get("is_threat"):
                logger.warning("THREAT DETECTED: %s", threat_eval.get("reasons"))
            else:
                logger.info("Telemetry sent successfully.")
        else:
            logger.error("Server returned %d: %s", resp.status_code, resp.text[:200])
    except requests.exceptions.ConnectionError:
        logger.error("Cannot connect to server at %s", SERVER_URL)
    except Exception as e:
        logger.error("Failed to send telemetry: %s", e)


def run_cycle():
    """Single collect-and-send cycle."""
    logger.info("--- Collecting telemetry ---")
    payload = collect_telemetry()
    send_telemetry(payload)


def main():
    """Main entry point. Runs collection on a schedule."""
    logger.info("=" * 50)
    logger.info("OCSafe Cyberguard Agent Starting")
    logger.info("Server: %s", SERVER_URL)
    logger.info("Device ID: %s", DEVICE_ID)
    logger.info("Interval: %ds", COLLECT_INTERVAL)
    logger.info("=" * 50)

    if not DEVICE_ID:
        logger.error("DEVICE_ID not set in config.py! Please enroll this device first.")
        logger.info("To enroll, ask your admin for an API key and device ID.")
        return

    if API_KEY == "oc_YOURPREFIX.YOURSECRET":
        logger.error("API_KEY not set in config.py! Please set your device API key.")
        return

    # Run immediately on start
    run_cycle()

    # Schedule periodic collection
    schedule.every(COLLECT_INTERVAL).seconds.do(run_cycle)

    logger.info("Agent running. Press Ctrl+C to stop.")
    try:
        while True:
            schedule.run_pending()
            time.sleep(1)
    except KeyboardInterrupt:
        logger.info("Agent stopped by user.")


if __name__ == "__main__":
    main()
