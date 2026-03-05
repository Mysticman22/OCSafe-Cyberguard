import { useState } from 'react';
import { ShieldCheck, Mail, Lock, Bot } from 'lucide-react';

export default function Settings() {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [email, setEmail] = useState('shreya.admin@gmail.com');
  const [aiMode, setAiMode] = useState('Semi-Automated');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!email.endsWith('@gmail.com')) {
      alert("System Administrator emails MUST end with @gmail.com for this instance.");
      return;
    }
    setIsEditingProfile(false);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Settings & Preferences</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Manage your identity and global system parameters.</p>
      </div>

      <div className="space-y-8">
        
        {/* Profile Card Section */}
        <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-gray-100 dark:border-slate-800 shadow-xl shadow-gray-200/20 dark:shadow-none">
          <div className="flex justify-between items-start mb-8">
             <h2 className="text-xl font-bold text-slate-900 dark:text-white">Administrator Identity</h2>
             <button 
               onClick={() => !isEditingProfile && setIsEditingProfile(true)}
               className="text-sm font-bold text-brand-purple hover:underline"
             >
               {isEditingProfile ? "" : "Edit Profile"}
             </button>
          </div>

          <div className="flex items-center gap-8 mb-8 pb-8 border-b border-gray-100 dark:border-slate-800">
             <div className="w-24 h-24 rounded-full bg-slate-900 dark:bg-slate-800 flex items-center justify-center text-white text-3xl font-black shadow-lg">
               S
             </div>
             <div>
               <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 Shreya Wankhede <ShieldCheck size={24} className="text-brand-purple" />
               </h3>
               <span className="inline-block mt-2 px-3 py-1 bg-brand-purple/10 text-brand-purple text-xs font-bold uppercase tracking-wider rounded-md">
                 Master Clearance
               </span>
             </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-gray-300">Registered Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!isEditingProfile}
                      className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-purple text-slate-900 dark:text-white font-medium disabled:opacity-60 disabled:bg-gray-100"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-gray-300">Auth Token Reset</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="password" 
                      placeholder="••••••••••••"
                      disabled={true}
                      className="w-full bg-gray-100 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-gray-400 font-medium opacity-60"
                    />
                  </div>
                </div>
             </div>

             {isEditingProfile && (
               <div className="flex justify-end gap-3 pt-4">
                 <button type="button" onClick={() => setIsEditingProfile(false)} className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                 <button type="submit" className="px-6 py-2.5 rounded-xl font-bold bg-brand-purple text-white shadow-md shadow-brand-purple/20">Save Configuration</button>
               </div>
             )}
          </form>
        </section>

        {/* System Config Section */}
        <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-gray-100 dark:border-slate-800 shadow-xl shadow-gray-200/20 dark:shadow-none">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8">System Configuration</h2>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-gray-50 dark:bg-slate-950 rounded-2xl border border-gray-100 dark:border-slate-800">
            <div className="flex gap-4">
              <div className="p-3 bg-brand-purple/10 text-brand-purple rounded-xl shrink-0"><Bot size={24} /></div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-[15px]">AI Automated Response Mode</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium pb-2 md:pb-0">Configure how the local Cyberguard AI handles incoming user queries.</p>
              </div>
            </div>
            
            <select 
              value={aiMode}
              onChange={(e) => setAiMode(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-brand-purple w-full md:w-auto"
            >
              <option value="Manual">Manual Interpretation</option>
              <option value="Semi-Automated">Semi-Automated</option>
              <option value="Fully Automated">Fully Automated</option>
            </select>
          </div>
        </section>

      </div>
    </div>
  );
}
