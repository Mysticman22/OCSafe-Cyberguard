import { useState, useEffect } from 'react';
import { cn } from '../shared/utils';
import { getLatestTelemetry } from '../api/auth';

export default function UserEndpoints() {
  const [firewall, setFirewall] = useState({ enabled: null, loading: true });
  const [antivirus, setAntivirus] = useState({ name: '', enabled: null, loading: true });
  const [updates, setUpdates] = useState({ pending: 0, loading: true });

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getLatestTelemetry(1);
        if (result.data && result.data.security) {
          const sec = result.data.security;
          setFirewall({ enabled: sec.firewall_enabled, loading: false });
          setAntivirus({ name: sec.antivirus_name || 'Unknown', enabled: sec.antivirus_enabled, loading: false });
          setUpdates({ pending: sec.windows_update_pending || 0, loading: false });
        } else {
          setFirewall(p => ({ ...p, loading: false }));
          setAntivirus(p => ({ ...p, loading: false }));
          setUpdates(p => ({ ...p, loading: false }));
        }
      } catch (e) {
        console.error('Failed to fetch security data:', e);
        setFirewall(p => ({ ...p, loading: false }));
        setAntivirus(p => ({ ...p, loading: false }));
        setUpdates(p => ({ ...p, loading: false }));
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const items = [
    {
      title: 'Device Firewall',
      description: 'Block unauthorized inbound connections',
      enabled: firewall.enabled,
      loading: firewall.loading,
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>,
    },
    {
      title: `Antivirus (${antivirus.name || 'Unknown'})`,
      description: 'Real-time threat protection',
      enabled: antivirus.enabled,
      loading: antivirus.loading,
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Endpoint Security</h1>
      <p className="text-gray-400 font-medium mb-8">Real-time security status from your device agent.</p>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-8 space-y-6">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center",
                item.loading ? "bg-gray-100 dark:bg-slate-800 text-gray-400" :
                item.enabled ? "bg-green-50 dark:bg-green-500/10 text-green-500" :
                "bg-red-50 dark:bg-red-500/10 text-red-500"
              )}>
                {item.icon}
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{item.title}</p>
                <p className="text-sm text-gray-400 font-medium">{item.description}</p>
              </div>
            </div>
            {item.loading ? (
              <div className="w-14 h-8 rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse"></div>
            ) : (
              <span className={cn("px-4 py-1.5 rounded-full text-xs font-bold uppercase",
                item.enabled
                  ? "bg-green-50 dark:bg-green-500/10 text-green-600"
                  : "bg-red-50 dark:bg-red-500/10 text-red-600"
              )}>
                {item.enabled ? 'Enabled' : 'Disabled'}
              </span>
            )}
          </div>
        ))}

        {/* Windows Updates */}
        <div className="flex items-center justify-between p-5 rounded-2xl bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center",
              updates.loading ? "bg-gray-100 dark:bg-slate-800 text-gray-400" :
              updates.pending === 0 ? "bg-green-50 dark:bg-green-500/10 text-green-500" :
              "bg-orange-50 dark:bg-orange-500/10 text-orange-500"
            )}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Windows Updates</p>
              <p className="text-sm text-gray-400 font-medium">Keep your system patched and secure</p>
            </div>
          </div>
          {updates.loading ? (
            <div className="w-14 h-8 rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse"></div>
          ) : (
            <span className={cn("px-4 py-1.5 rounded-full text-xs font-bold",
              updates.pending === 0
                ? "bg-green-50 dark:bg-green-500/10 text-green-600"
                : "bg-orange-50 dark:bg-orange-500/10 text-orange-600"
            )}>
              {updates.pending === 0 ? 'Up to date' : `${updates.pending} pending`}
            </span>
          )}
        </div>
      </div>

      {firewall.enabled === null && !firewall.loading && (
        <div className="bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-2xl p-6 mt-6 text-center">
          <p className="text-sm text-purple-600 dark:text-purple-300 font-medium">
            No security data available. Install the OCSafe Agent to see real endpoint security status.
          </p>
        </div>
      )}
    </div>
  );
}
