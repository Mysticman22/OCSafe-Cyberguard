import { useState } from 'react';
import { cn } from '../shared/utils';

export default function UserEndpoints() {
  const [firewallEnabled, setFirewallEnabled] = useState(true);
  const [usbEnabled, setUsbEnabled] = useState(false);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Endpoint Security</h1>
      <p className="text-gray-400 font-medium mb-8">Manage your device's security controls.</p>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-8 space-y-6">

        {/* Firewall Toggle */}
        <div className="flex items-center justify-between p-5 rounded-2xl bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", firewallEnabled ? "bg-green-50 dark:bg-green-500/10 text-green-500" : "bg-gray-100 dark:bg-slate-800 text-gray-400")}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Device Firewall</p>
              <p className="text-sm text-gray-400 font-medium">Block unauthorized inbound connections</p>
            </div>
          </div>
          <button
            onClick={() => setFirewallEnabled(!firewallEnabled)}
            className={cn("w-14 h-8 rounded-full transition-colors flex items-center px-1", firewallEnabled ? "bg-green-500" : "bg-gray-300 dark:bg-slate-700")}
          >
            <div className={cn("w-6 h-6 bg-white rounded-full shadow-sm transition-transform", firewallEnabled && "translate-x-6")}></div>
          </button>
        </div>

        {/* USB Toggle */}
        <div className="flex items-center justify-between p-5 rounded-2xl bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", usbEnabled ? "bg-green-50 dark:bg-green-500/10 text-green-500" : "bg-gray-100 dark:bg-slate-800 text-gray-400")}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z"/></svg>
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">USB Monitoring</p>
              <p className="text-sm text-gray-400 font-medium">Monitor and restrict USB device access</p>
            </div>
          </div>
          <button
            onClick={() => setUsbEnabled(!usbEnabled)}
            className={cn("w-14 h-8 rounded-full transition-colors flex items-center px-1", usbEnabled ? "bg-green-500" : "bg-gray-300 dark:bg-slate-700")}
          >
            <div className={cn("w-6 h-6 bg-white rounded-full shadow-sm transition-transform", usbEnabled && "translate-x-6")}></div>
          </button>
        </div>

      </div>
    </div>
  );
}
