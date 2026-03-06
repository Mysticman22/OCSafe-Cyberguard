import { useState, useEffect } from 'react';
import { getLatestTelemetry } from '../api/auth';

export default function UserNetwork() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getLatestTelemetry(1);
        if (result.data && result.data.network) {
          setData(result.data.network);
        }
      } catch (e) {
        console.error('Failed to fetch network data:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Network Integrity</h1>
      <p className="text-gray-400 font-medium mb-8">Monitor active connections, open ports, and network interfaces.</p>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : !data ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm p-12 text-center">
          <div className="mx-auto w-40 h-40 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-xl shadow-purple-600/20 mb-8">
            <svg className="w-20 h-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
            </svg>
          </div>
          <p className="text-sm text-purple-600 dark:text-purple-300 font-medium">
            Install the OCSafe Agent to see live network data.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Active Connections', value: data.active_connections, color: 'text-blue-500' },
              { label: 'Open Ports', value: data.open_ports?.length || 0, color: 'text-purple-500' },
              { label: 'Data Sent', value: `${data.bytes_sent_mb || 0} MB`, color: 'text-green-500' },
              { label: 'Data Received', value: `${data.bytes_recv_mb || 0} MB`, color: 'text-orange-500' },
            ].map(s => (
              <div key={s.label} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-800 shadow-sm text-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{s.label}</p>
                <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Network Interfaces */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Network Interfaces</h3>
            <div className="space-y-3">
              {(data.interfaces || []).map((iface, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${iface.status === 'up' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div>
                      <p className="font-bold text-sm text-slate-900 dark:text-white">{iface.name}</p>
                      <p className="text-xs text-gray-400">{iface.ip || 'No IP'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-bold uppercase ${iface.status === 'up' ? 'text-green-500' : 'text-gray-400'}`}>
                      {iface.status}
                    </span>
                    {iface.speed_mbps > 0 && (
                      <p className="text-xs text-gray-400">{iface.speed_mbps} Mbps</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Open Ports */}
          {data.open_ports && data.open_ports.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Open Ports ({data.open_ports.length})</h3>
              <div className="flex flex-wrap gap-2">
                {data.open_ports.map(port => (
                  <span key={port} className="px-3 py-1.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white">
                    :{port}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
