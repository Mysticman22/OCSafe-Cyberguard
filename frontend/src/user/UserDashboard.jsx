import { useState } from 'react';
import { cn } from '../shared/utils';

export default function UserDashboard() {
  const [healthScore, setHealthScore] = useState(94);
  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzingScore, setIsAnalyzingScore] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);
  const [scoreReport, setScoreReport] = useState(null);
  const [scanReport, setScanReport] = useState(null);
  const [firewallEnabled, setFirewallEnabled] = useState(true);
  const [usbEnabled, setUsbEnabled] = useState(false);
  const [logs, setLogs] = useState([]);
  const [analyzingLogId, setAnalyzingLogId] = useState(null);

  // SVG gauge calculations
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (healthScore / 100) * circumference;

  const handleAnalyzeScore = () => {
    setIsAnalyzingScore(true);
    setTimeout(() => {
      setIsAnalyzingScore(false);
      setScoreReport(`AI Health Analysis: Your system scored ${healthScore}/100. All core defenses are active. Firewall is ${firewallEnabled ? 'enabled' : 'disabled'}. USB monitoring is ${usbEnabled ? 'active' : 'inactive'}. No critical vulnerabilities detected in the last 24 hours. Recommendation: ${healthScore >= 90 ? 'Maintain current security posture.' : 'Run a full system scan to improve your score.'}`);
    }, 2000);
  };

  const handleQuickScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setTimeout(() => {
      const newScore = Math.floor(Math.random() * 11) + 90; // 90-100
      setHealthScore(newScore);
      const scan = {
        id: Date.now(),
        title: 'Quick System Scan',
        time: new Date().toLocaleString(),
        status: 'Clean',
        report: `Scan Complete — Score: ${newScore}/100. Analyzed 2,847 system processes, 127 installed applications, and 14 active network connections. No threats detected. All endpoints verified. Firewall rules validated. System integrity confirmed.`
      };
      setScanHistory(prev => [scan, ...prev]);
      setIsScanning(false);
    }, 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* 1. Header & Health Gauge */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Welcome back,
          </h1>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Guest
          </h1>
        </div>

        {/* SVG Health Gauge */}
        <div
          className="relative cursor-pointer group"
          onClick={handleAnalyzeScore}
          title="Click to analyze"
        >
          <svg width="140" height="140" className="-rotate-90">
            <circle cx="70" cy="70" r={radius} fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-100 dark:text-slate-800" />
            {!isAnalyzingScore && (
              <circle
                cx="70" cy="70" r={radius} fill="none"
                stroke="#9333ea" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-1000"
              />
            )}
            {isAnalyzingScore && (
              <circle
                cx="70" cy="70" r={radius} fill="none"
                stroke="#9333ea" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * 0.75}
                className="animate-spin origin-center"
              />
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {isAnalyzingScore ? (
              <div className="w-6 h-6 border-3 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span className="text-3xl font-black text-slate-900 dark:text-white">{healthScore}</span>
                <span className="text-[10px] font-bold tracking-widest text-purple-600 uppercase">Healthy</span>
              </>
            )}
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-lg">
            Analyze ✨
          </div>
        </div>
      </div>

      {/* 2. Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* A. Quick Scan Card */}
        <div className={cn("bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[220px]", isScanning && "opacity-70")}>
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>
            </div>
            {scanHistory.length === 0 ? (
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-orange-500 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                Pending Scan
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-green-500 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                Protected
              </span>
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Quick Scan</h3>
            <p className="text-sm text-gray-400 font-medium mt-1">Run a heuristic analysis on system processes.</p>
            {scanHistory.length > 0 && (
              <p className="text-xs text-gray-400 mt-2">Last scan: {scanHistory[0].time}</p>
            )}
          </div>
          <button
            onClick={handleQuickScan}
            disabled={isScanning}
            className="mt-4 w-full py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-bold rounded-xl shadow-md shadow-purple-500/20 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            {isScanning ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Scanning...</>
            ) : (
              'Start Scan'
            )}
          </button>
        </div>

        {/* B. Endpoint Security Summary Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col min-h-[220px]">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path strokeLinecap="round" d="M8 21h8M12 17v4"/></svg>
            </div>
            <span className={cn("text-[11px] font-bold uppercase tracking-wider", (firewallEnabled || usbEnabled) ? "text-green-500" : "text-gray-400")}>
              {(firewallEnabled || usbEnabled) ? 'Active' : 'Inactive'}
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Endpoint Security</h3>
          <div className="space-y-3 mt-auto">
            <div className="flex items-center gap-2">
              <svg className={cn("w-4 h-4", firewallEnabled ? "text-green-500" : "text-gray-300")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Firewall: <span className={cn("font-bold", firewallEnabled ? "text-green-500" : "text-gray-400")}>{firewallEnabled ? 'ON' : 'OFF'}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <svg className={cn("w-4 h-4", usbEnabled ? "text-green-500" : "text-gray-300")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">USB: <span className={cn("font-bold", usbEnabled ? "text-green-500" : "text-gray-400")}>{usbEnabled ? 'ON' : 'OFF'}</span></span>
            </div>
          </div>
        </div>

        {/* C. Network Security Summary Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col min-h-[220px]">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"/></svg>
            </div>
            <span className="text-[11px] font-bold text-green-500 uppercase tracking-wider">Secured</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Network Security</h3>
          <p className="text-sm text-gray-400 font-medium mt-auto">Traffic encrypted via AI-powered gateway. All connections verified.</p>
        </div>
      </div>

      {/* 3. Inline AI Report */}
      {scoreReport && (
        <div className="bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-2xl p-6 relative">
          <button onClick={() => setScoreReport(null)} className="absolute top-4 right-4 text-purple-400 hover:text-purple-600 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
          <h4 className="font-bold text-purple-700 dark:text-purple-400 mb-2 text-sm">🔮 AI Health Analysis</h4>
          <p className="text-sm text-purple-600 dark:text-purple-300 font-medium leading-relaxed">{scoreReport}</p>
        </div>
      )}

      {/* 4. Recent Scans History */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Recent Scans</h3>

        {scanHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-300 dark:text-gray-600">
            <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            <p className="font-bold text-gray-400 dark:text-gray-500">No Scans Yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-600 mt-1">Run a Quick Scan to see your history here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {scanHistory.map((scan) => (
              <div key={scan.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-500">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900 dark:text-white">{scan.title}</p>
                    <p className="text-xs text-gray-400">{scan.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-green-500 bg-green-50 dark:bg-green-500/10 px-3 py-1 rounded-full">{scan.status}</span>
                  <button
                    onClick={() => setScanReport(scan.report)}
                    className="text-xs font-bold text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    View Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Threat Intelligence Logs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Threat Intelligence</h3>
          <button className="text-xs font-bold text-purple-600 hover:text-purple-700 px-4 py-2 bg-purple-50 dark:bg-purple-500/10 rounded-xl transition-colors">
            Export PDF
          </button>
        </div>

        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-300 dark:text-gray-600">
            <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>
            <p className="font-bold text-gray-400 dark:text-gray-500">No Threats Detected</p>
            <p className="text-sm text-gray-400 dark:text-gray-600 mt-1">Your system is secure.</p>
          </div>
        ) : null}
      </div>

      {/* Scan Report Modal */}
      {scanReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setScanReport(null)}></div>
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-2xl border border-gray-100 dark:border-slate-800 z-10">
            <button onClick={() => setScanReport(null)} className="absolute top-4 right-4 text-gray-400 hover:text-slate-900 dark:hover:text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">📋 Scan Report</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed">{scanReport}</p>
          </div>
        </div>
      )}
    </div>
  );
}
