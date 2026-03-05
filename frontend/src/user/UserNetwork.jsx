export default function UserNetwork() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
      
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm p-12 w-full text-center">
        
        {/* Wi-Fi Icon in Purple Circle */}
        <div className="mx-auto w-40 h-40 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-xl shadow-purple-600/20 mb-8">
          <svg className="w-20 h-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
          </svg>
        </div>

        {/* Integrity Score */}
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
          Network Integrity:
        </h1>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
          100%
        </h1>

        {/* Description */}
        <p className="text-gray-500 dark:text-gray-400 font-medium text-lg leading-relaxed max-w-md mx-auto">
          Your network traffic is being routed through our AI-powered secure gateway. No anomalies detected in the last 24 hours.
        </p>

        {/* Status Indicators */}
        <div className="flex items-center justify-center gap-8 mt-10">
          {[
            { label: 'Gateway', status: 'Secured' },
            { label: 'Encryption', status: 'AES-256' },
            { label: 'DNS', status: 'Protected' },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mx-auto mb-2"></div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.label}</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{item.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
