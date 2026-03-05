import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { cn } from './utils';

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', content: 'OCsafe AI online. How can I assist with your administration tasks today?' }
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [chatHistory, isOpen, isTyping]);

  const handleSend = () => {
    if (!message.trim()) return;

    const userMsg = message;
    setMessage('');
    
    // Add User Message
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    
    // Trigger Typing
    setIsTyping(true);

    // Simulate AI Response after 1 second
    setTimeout(() => {
      setIsTyping(false);
      setChatHistory(prev => [...prev, { 
        role: 'ai', 
        content: `Acknowledged: "${userMsg}". System logs are being analyzed. No critical anomalies detected at this time.` 
      }]);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end pointer-events-none">
      
      {/* Chat Window */}
      <div 
        className={cn(
          "mb-4 w-[380px] h-[500px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-brand-purple/20 border border-gray-100 dark:border-slate-800 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right pointer-events-auto",
          isOpen ? "scale-100 opacity-100 blur-none" : "scale-50 opacity-0 blur-md hidden"
        )}
      >
        {/* Header */}
        <div className="p-4 bg-brand-purple text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm">Cyberguard AI</h3>
              <p className="text-[10px] text-purple-200 uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> Active
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-slate-950/50">
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={cn("flex w-full", msg.role === 'ai' ? "justify-start" : "justify-end")}>
              <div className={cn(
                "flex gap-2 max-w-[85%]",
                msg.role === 'ai' ? "flex-row" : "flex-row-reverse"
              )}>
                <div className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-1">
                  {msg.role === 'ai' ? (
                    <div className="bg-brand-purple/10 text-brand-purple rounded-full p-1"><Bot size={12} /></div>
                  ) : (
                    <div className="bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-gray-300 rounded-full p-1"><User size={12} /></div>
                  )}
                </div>
                <div className={cn(
                  "px-4 py-3 rounded-2xl text-[14px] shadow-sm font-medium",
                  msg.role === 'ai'
                    ? "bg-white dark:bg-slate-800 text-slate-700 dark:text-gray-200 rounded-tl-sm border border-gray-100 dark:border-slate-800"
                    : "bg-brand-purple text-white rounded-tr-sm"
                )}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
             <div className="flex w-full justify-start">
               <div className="flex gap-2 max-w-[85%]">
                 <div className="shrink-0 w-6 h-6 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center mt-1 p-1">
                   <Bot size={12} />
                 </div>
                 <div className="px-5 py-4 bg-white dark:bg-slate-800 rounded-2xl rounded-tl-sm border border-gray-100 dark:border-slate-800 flex items-center gap-1 shadow-sm">
                   <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                   <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                   <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></span>
                 </div>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 shrink-0">
          <div className="relative flex items-center">
            <input 
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Cyberguard AI..."
              className="w-full bg-gray-100 dark:bg-slate-950 border-none rounded-2xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 text-slate-900 dark:text-white"
            />
            <button 
              onClick={handleSend}
              disabled={!message.trim()}
              className="absolute right-2 p-2 bg-brand-purple text-white rounded-xl hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:hover:bg-brand-purple"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-brand-purple/30 transition-all duration-300 pointer-events-auto hover:scale-105 active:scale-95",
          isOpen 
            ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 rotate-90" 
            : "bg-brand-purple text-white hover:bg-purple-600"
        )}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

    </div>
  );
}
