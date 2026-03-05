import { ShieldAlert, Shield, ShieldQuestion } from 'lucide-react';
import { cn } from '../shared/utils';
import { useState } from 'react';

export default function Threats() {
  const [threats, setThreats] = useState([
    { id: 1, title: 'Ransomware Injection', target: 'Server-04', time: '2 mins ago', severity: 'critical', resolved: false },
    { id: 2, title: 'Unauthorized Access', target: 'Admin-Panel', time: '15 mins ago', severity: 'warning', resolved: false },
    { id: 3, title: 'System Update Required', target: 'All Nodes', time: '1 hour ago', severity: 'info', resolved: false },
  ]);

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
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Active security incidents requiring immediate attention.</p>
        </div>
        <div className="flex gap-2 p-1.5 bg-gray-100 dark:bg-slate-900 rounded-2xl">
          <button className="px-6 py-2.5 rounded-xl bg-brand-purple text-white font-bold text-sm shadow-md">Priority</button>
          <button className="px-6 py-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white font-bold text-sm transition-colors">Time</button>
        </div>
      </div>

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
              {/* Vertical Color Stripe */}
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
                      <div className="flex items-center gap-2">⚡ Kill & Quarantine</div>
                    </button>
                  </>
                )}
                
                {!threat.resolved && threat.severity === 'warning' && (
                  <button onClick={() => resolveThreat(threat.id)} className="px-8 py-3 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold transition-colors">
                    Review Logs
                  </button>
                )}

                {!threat.resolved && threat.severity === 'info' && (
                  <button onClick={() => resolveThreat(threat.id)} className="px-8 py-3 rounded-full bg-green-500 hover:bg-green-600 text-white font-bold transition-colors">
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
