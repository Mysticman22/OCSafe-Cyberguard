import { useState } from 'react';
import { Search, Plus, MoreVertical, Smartphone, Laptop, Server } from 'lucide-react';
import { cn } from '../shared/utils';

export default function Users() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', device: 'MacBook Pro 16', type: 'laptop', sub: 'Enterprise', status: 'Active' },
    { id: 2, name: 'Alice Smith', device: 'iPhone 15 Pro', type: 'mobile', sub: 'Premium', status: 'Active' },
    { id: 3, name: 'Bob Wilson', device: 'Dell XPS 15', type: 'laptop', sub: 'Standard', status: 'Inactive' },
    { id: 4, name: 'Sarah Connor', device: 'Server Node Alpha', type: 'server', sub: 'Enterprise', status: 'Active' },
  ]);

  const toggleStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
  };

  const getSubStyle = (sub) => {
    switch (sub) {
      case 'Enterprise': return 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400';
      case 'Premium': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400';
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.device.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Device Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Monitor and manage connected enterprise devices.</p>
        </div>
        <button className="px-6 py-3.5 rounded-2xl bg-brand-purple hover:bg-purple-600 text-white font-bold transition-colors shadow-lg shadow-brand-purple/20 flex items-center gap-2">
          <Plus size={20} strokeWidth={3} />
          Add User
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-slate-800 shadow-xl shadow-gray-200/20 dark:shadow-none">
        
        {/* Toolbar */}
        <div className="flex justify-between items-center mb-8">
          <div className="relative w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search users or devices..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 text-slate-900 dark:text-white transition-all font-medium"
            />
          </div>
          <div className="text-sm font-bold text-gray-400 dark:text-gray-500">
            {users.length} Devices Connected
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-slate-800">
                <th className="pb-6 w-1/4">User Name</th>
                <th className="pb-6">Device Name</th>
                <th className="pb-6">Subscription</th>
                <th className="pb-6">Status</th>
                <th className="pb-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="group hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  
                  {/* Avatar & Name */}
                  <td className="py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white text-[15px]">{user.name}</span>
                    </div>
                  </td>

                  {/* Device */}
                  <td className="py-6">
                    <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 font-medium">
                      {user.type === 'laptop' && <Laptop size={18} />}
                      {user.type === 'mobile' && <Smartphone size={18} />}
                      {user.type === 'server' && <Server size={18} />}
                      <span>{user.device}</span>
                    </div>
                  </td>

                  {/* Subscription Pill */}
                  <td className="py-6">
                    <span className={cn("px-4 py-1.5 rounded-full text-xs font-bold", getSubStyle(user.sub))}>
                      {user.sub}
                    </span>
                  </td>

                  {/* Live Status Toggle Pill */}
                  <td className="py-6">
                    <button 
                      onClick={() => toggleStatus(user.id)}
                      className={cn(
                        "flex flex-row items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all border",
                        user.status === 'Active' 
                          ? "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-500 border-green-200 dark:border-green-500/20" 
                          : "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-500 border-red-200 dark:border-red-500/20"
                      )}
                    >
                      <span className={cn(
                        "w-1.5 h-1.5 rounded-full animate-pulse",
                        user.status === 'Active' ? "bg-green-500" : "bg-red-500"
                      )}></span>
                      {user.status}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-6 text-right">
                    <button className="p-2 text-gray-400 hover:text-brand-purple transition-colors rounded-xl hover:bg-purple-50 dark:hover:bg-purple-500/10">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
