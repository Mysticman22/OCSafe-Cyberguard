import { useState, useEffect } from 'react';
import { ShieldAlert, Shield, ShieldQuestion } from 'lucide-react';
import { cn } from '../shared/utils';
import { getOrgTelemetrySummary } from '../api/auth';

export default function Threats() {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchThreats() {
      try {
        const summary = await getOrgTelemetrySummary();
        const devices = summary?.devices || [];

        // Build threat list from real telemetry data
        const detected = [];
        devices.forEach(d => {
          if (!d.firewall_enabled) {
            detected.push({
              id: `fw-${d.device_id}`,
              title: 'Firewall Disabled',
              target: d.hostname || `Device ${d.device_id}`,
              time: d.last_seen ? new Date(d.last_seen).toLocaleString() : 'Unknown',
              severity: 'critical',
              resolved: false,
            });
          }
          if (!d.antivirus_enabled) {
            detected.push({
              id: `av-${d.device_id}`,
              title: 'Antivirus Disabled',
              target: d.hostname || `Device ${d.device_id}`,
              time: d.last_seen ? new Date(d.last_seen).toLocaleString() : 'Unknown',
              severity: 'critical',
              resolved: false,
            });
          }
          if (d.disk_percent > 90) {
            detected.push({
              id: `disk-${d.device_id}`,
              title: `Disk Almost Full (${d.disk_percent}%)`,
              target: d.hostname || `Device ${d.device_id}`,
              time: d.last_seen ? new Date(d.last_seen).toLocaleString() : 'Unknown',
              severity: 'warning',
              resolved: false,
            });
          }
          if (d.cpu_percent > 90) {
            detected.push({
              id: `cpu-${d.device_id}`,
              title: `High CPU Usage (${d.cpu_percent}%)`,
              target: d.hostname || `Device ${d.device_id}`,
              time: d.last_seen ? new Date(d.last_seen).toLocaleString() : 'Unknown',
              severity: 'warning',
              resolved: false,
            });
          }
        });

        setThreats(detected);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchThreats();
    const i = setInterval(fetchThreats, 30000);
    return () => clearInterval(i);
  }, []);

  const resolveThreat = (id) => {
    setThreats(threats.map(t => t.id === id ? { ...t, resolved: true } : t));
  };

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'critical': return { stripe: 'bg-red-500', badge: 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400' };
      case 'warning': return { stripe: 'bg-yellow-500', badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400' };
      case 'info': return { stripe: 'bg-green-500', badge: 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' };
      default: return { stripe: 'bg-gray-500', badge: 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400' };
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Threat Command Center</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Active security incidents from real-time telemetry.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("px-4 py-2 rounded-xl text-sm font-bold",
            threats.filter(t => !t.resolved).length > 0
              ? "bg-red-100 dark:bg-red-500/10 text-red-600"
              : "bg-green-100 dark:bg-green-500/10 text-green-600"
          )}>
            {threats.filter(t => !t.resolved).length} Active
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : threats.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xl p-16 text-center">
          <div className="w-20 h-20 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">All Clear</h3>
          <p className="text-gray-500 dark:text-gray-400 font-medium">No security threats detected across your fleet. All devices are secure.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {threats.map((threat) => {
            const styles = getSeverityStyles(threat.severity);
            return (
              <div
                key={threat.id}
                className={cn(
                  "relative bg-white dark:bg-slate-900 rounded-full border border-gray-100 dark:border-slate-800 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl shadow-gray-200/20 dark:shadow-none transition-all duration-300",
                  threat.resolved && "grayscale opacity-60"
                )}
              >
                <div className={cn("absolute left-6 top-1/2 -translate-y-1/2 w-2 h-16 rounded-full", styles.stripe)}></div>
                <div className="pl-8 flex flex-col gap-2">
                  <div className="flex items-center gap-4">
                    <h3 className={cn("text-xl font-bold text-slate-900 dark:text-white", threat.resolved && "line-through")}>
                      {threat.title}
                    </h3>
                    <span className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider", styles.badge)}>
                      {threat.severity}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 font-medium">
                    <span className="flex items-center gap-2"><Shield size={16} /> Target: {threat.target}</span>
                    <span className="flex items-center gap-2"><ShieldQuestion size={16} /> {threat.time}</span>
                  </div>
                </div>

                <div className="w-full md:w-auto flex gap-3 shrink-0">
                  {!threat.resolved && threat.severity === 'critical' && (
                    <>
                      <button onClick={() => resolveThreat(threat.id)} className="px-6 py-3 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-bold transition-colors">
                        <div className="flex items-center gap-2"><ShieldAlert size={18} /> Isolate Device</div>
                      </button>
                      <button onClick={() => resolveThreat(threat.id)} className="px-6 py-3 rounded-full bg-slate-800 hover:bg-slate-950 dark:hover:bg-black text-white font-bold transition-colors">
                        <div className="flex items-center gap-2">⚡ Resolve</div>
                      </button>
                    </>
                  )}
                  {!threat.resolved && threat.severity === 'warning' && (
                    <button onClick={() => resolveThreat(threat.id)} className="px-8 py-3 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold transition-colors">
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
