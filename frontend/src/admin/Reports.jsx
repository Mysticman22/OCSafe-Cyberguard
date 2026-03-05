import { useState } from 'react';
import { FileText, Loader2, Download, Printer, Share2, ShieldCheck, Users as UsersIcon, MessageSquare, AlertTriangle, Activity } from 'lucide-react';
import { cn } from '../shared/utils';

export default function Reports() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasReport, setHasReport] = useState(false);

  const generateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setHasReport(true);
    }, 3000);
  };

  if (!hasReport) {
    return (
      <div className="max-w-5xl mx-auto h-full flex flex-col justify-center animate-in fade-in duration-500">
        
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Security Intelligence</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Generate and analyze monthly security reports.</p>
        </div>

        <div className="flex-1 min-h-[500px] border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-[3rem] flex flex-col items-center justify-center p-8 bg-white/30 dark:bg-slate-900/10 transition-colors">
          
          <div className="w-24 h-24 mb-6 rounded-full bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
            {isGenerating ? (
              <Loader2 size={40} className="text-brand-purple animate-spin" strokeWidth={2} />
            ) : (
              <FileText size={40} className="text-brand-purple" strokeWidth={2} />
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {isGenerating ? "Compiling Data..." : "No Report Generated"}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm font-medium mb-10">
            {isGenerating 
              ? "Gathering threat intel, user activity, and system health metrics across all nodes." 
              : "Generate the comprehensive security intelligence report for March 2026 to view network health and threat analysis."}
          </p>
          
          <button 
            onClick={generateReport}
            disabled={isGenerating}
            className={cn(
              "px-8 py-4 rounded-2xl font-bold transition-all shadow-xl flex items-center gap-3",
              isGenerating 
                ? "bg-gray-100 text-gray-400 dark:bg-slate-800 cursor-not-allowed shadow-none" 
                : "bg-brand-purple text-white hover:bg-purple-600 shadow-brand-purple/25 active:scale-95"
            )}
          >
             {!isGenerating && <span className="text-lg">⚡</span>} 
             Generate March 2026 Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in zoom-in duration-500">
      
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Security Intelligence</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Generate and analyze monthly security reports.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-gray-100 dark:border-slate-800 shadow-2xl shadow-gray-200/20 dark:shadow-none">
        
        {/* Report Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-8 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-brand-purple text-white rounded-2xl shadow-lg shadow-brand-purple/20">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Monthly Summary Report</h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Period: March 2026</p>
            </div>
          </div>
          <div className="flex gap-3">
             <button className="p-3.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-gray-300 hover:text-brand-purple transition-colors"><Printer size={20} /></button>
             <button className="p-3.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-gray-300 hover:text-brand-purple transition-colors"><Share2 size={20} /></button>
             <button className="px-6 py-3.5 rounded-xl bg-brand-purple hover:bg-purple-600 text-white font-bold flex items-center gap-2 shadow-lg shadow-brand-purple/20"><Download size={20} /> Export PDF</button>
          </div>
        </div>

        {/* 4-Grid Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           {[
             { title: "New Devices Added", count: "3", icon: UsersIcon, color: "text-blue-500" },
             { title: "Support Queries Solved", count: "24", icon: MessageSquare, color: "text-green-500" },
             { title: "Threats Blocked", count: "142", icon: AlertTriangle, color: "text-red-500" },
             { title: "System Uptime", count: "99.99%", icon: Activity, color: "text-purple-500" },
           ].map((stat) => (
             <div key={stat.title} className="p-6 rounded-3xl bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800">
               <stat.icon size={24} className={cn("mb-6", stat.color)} />
               <p className="text-gray-500 dark:text-gray-400 text-sm font-bold mb-1">{stat.title}</p>
               <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stat.count}</h3>
             </div>
           ))}
        </div>

        {/* Global Banner */}
        <div className="w-full bg-brand-purple rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between text-white shadow-xl shadow-brand-purple/30 relative overflow-hidden">
           
           <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
           
           <div className="z-10 relative">
             <h2 className="text-2xl font-bold tracking-tight mb-2">Overall Security Health</h2>
             <p className="text-purple-200 font-medium">Based on active monitoring and threat mitigation metrics.</p>
           </div>
           
           <div className="flex items-center gap-6 mt-6 md:mt-0 z-10 relative">
             <div className="flex flex-col items-end">
               <span className="text-5xl font-black">94%</span>
               <span className="text-xs font-bold tracking-widest text-purple-200 mt-1">EXCELLENT</span>
             </div>
             <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur border-2 border-white/30 flex items-center justify-center">
               <CheckCircle2 size={32} className="text-white" />
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
