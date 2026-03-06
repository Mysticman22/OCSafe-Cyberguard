"""
Network Collector
Monitors active connections, open ports, and network interfaces.
"""
import psutil


def collect():
    """Returns network status including connections, ports, and interfaces."""

    # Active connections
    connections = []
    open_ports = set()
    try:
        for conn in psutil.net_connections(kind="inet"):
            if conn.status == "ESTABLISHED":
                connections.append({
                    "local_addr": f"{conn.laddr.ip}:{conn.laddr.port}" if conn.laddr else "",
                    "remote_addr": f"{conn.raddr.ip}:{conn.raddr.port}" if conn.raddr else "",
                    "status": conn.status,
                    "pid": conn.pid,
                })
            if conn.status == "LISTEN" and conn.laddr:
                open_ports.add(conn.laddr.port)
    except (psutil.AccessDenied, PermissionError):
        pass

    # Network interfaces
    interfaces = []
    stats = psutil.net_if_stats()
    addrs = psutil.net_if_addrs()

    for iface_name, iface_stats in stats.items():
        iface_info = {
            "name": iface_name,
            "status": "up" if iface_stats.isup else "down",
            "speed_mbps": iface_stats.speed,
            "ip": "",
        }
        # Get IPv4 address
        if iface_name in addrs:
            for addr in addrs[iface_name]:
                if addr.family.name == "AF_INET":
                    iface_info["ip"] = addr.address
                    break
        interfaces.append(iface_info)

    # Bandwidth (bytes sent/received since boot)
    io = psutil.net_io_counters()

    return {
        "active_connections": len(connections),
        "established_connections": connections[:20],  # Limit to 20 for payload size
        "open_ports": sorted(list(open_ports)),
        "interfaces": interfaces,
        "bytes_sent_mb": round(io.bytes_sent / (1024 ** 2), 1),
        "bytes_recv_mb": round(io.bytes_recv / (1024 ** 2), 1),
    }
