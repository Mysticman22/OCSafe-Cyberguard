import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { cn } from '../shared/utils';

export default function Support() {
  const [reply, setReply] = useState('');
  const [tickets, setTickets] = useState([
    { id: 1, user: 'John Doe', preview: 'Need help resetting my master auth token...', active: true, solved: false },
    { id: 2, user: 'Alice Smith', preview: 'Isolating device failed on node 7...', active: false, solved: true },
    { id: 3, user: 'Bob Wilson', preview: 'How do I export the March threat report?', active: false, solved: false },
  ]);

  const [conversation, setConversation] = useState([
    { role: 'user', content: 'Hi, I lost access to my master auth token after format.' },
    { role: 'admin', content: 'No problem John, I can send a reset link to your registered @gmail.com.' },
    { role: 'user', content: 'Yes please, that would be great.' },
  ]);

  const handleSendAndSolve = () => {
    if (!reply.trim()) return;
    
    // Add reply
    setConversation([...conversation, { role: 'admin', content: reply }]);
    setReply('');
    
    // Mark active ticket as solved
    setTickets(tickets.map(t => t.active ? { ...t, solved: true } : t));
  };

  const activeTicket = tickets.find(t => t.active);

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-160px)] flex flex-col animate-in fade-in duration-500">
      
      <div className="mb-8 shrink-0">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Help & Support</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Manage unassigned tickets and active user conversations.</p>
      </div>

      <div className="flex-1 min-h-0 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-xl shadow-gray-200/20 dark:shadow-none flex overflow-hidden">
        
        {/* Left Pane: Ticket Inbox */}
        <div className="w-1/3 border-r border-gray-100 dark:border-slate-800 flex flex-col">
          <div className="p-6 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/50">
            <h3 className="font-bold text-slate-700 dark:text-gray-300">Ticket Inbox</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {tickets.map(ticket => (
              <div 
                key={ticket.id}
                className={cn(
                  "p-6 border-b border-gray-50 dark:border-slate-800/50 cursor-pointer transition-colors border-l-4",
                  ticket.active 
                    ? "bg-brand-purple/5 border-l-brand-purple" 
                    : "hover:bg-gray-50 dark:hover:bg-slate-800/30 border-l-transparent"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className={cn("font-bold", ticket.active ? "text-brand-purple dark:text-purple-400" : "text-slate-900 dark:text-white")}>
                    {ticket.user}
                  </h4>
                  {ticket.solved && <CheckCircle2 size={16} className="text-green-500" strokeWidth={3} />}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate font-medium">{ticket.preview}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Pane: Active Conversation */}
        <div className="w-2/3 flex flex-col bg-gray-50/30 dark:bg-slate-950/20">
          
          <div className="p-6 border-b border-gray-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur flex justify-between items-center shrink-0">
             <div>
               <h3 className="font-bold text-slate-900 dark:text-white">{activeTicket?.user}</h3>
               <p className="text-xs text-brand-purple font-bold">Active Ticket #{activeTicket?.id}</p>
             </div>
             {activeTicket?.solved && (
               <span className="px-3 py-1 bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-xs font-bold rounded-full border border-green-200 dark:border-green-500/20 flex items-center gap-1">
                 <CheckCircle2 size={14} /> Solved
               </span>
             )}
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            {conversation.map((msg, idx) => (
              <div key={idx} className={cn("flex w-full", msg.role === 'admin' ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "px-6 py-4 rounded-3xl max-w-[80%] font-medium text-[15px] shadow-sm",
                  msg.role === 'admin' 
                    ? "bg-brand-purple text-white rounded-br-sm shadow-brand-purple/10" 
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-gray-200 border border-gray-100 dark:border-slate-700 rounded-bl-sm"
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 shrink-0">
             <div className="relative flex items-center">
               <input 
                 type="text" 
                 value={reply}
                 onChange={(e) => setReply(e.target.value)}
                 disabled={activeTicket?.solved}
                 placeholder={activeTicket?.solved ? "Ticket closed." : "Type your reply..."}
                 className="w-full bg-gray-100 dark:bg-slate-950 border border-transparent dark:border-slate-800 rounded-2xl py-4 pl-6 pr-36 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 text-slate-900 dark:text-white transition-all disabled:opacity-50 font-medium"
               />
               <button 
                 onClick={handleSendAndSolve}
                 disabled={activeTicket?.solved || !reply.trim()}
                 className="absolute right-2 px-6 py-2.5 bg-brand-purple text-white font-bold text-sm rounded-xl hover:bg-purple-600 transition-colors disabled:opacity-50 flex items-center gap-2"
               >
                 Send & Solve <Send size={16} />
               </button>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
