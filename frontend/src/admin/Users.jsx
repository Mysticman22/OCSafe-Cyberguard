import { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, Laptop } from 'lucide-react';
import { cn } from '../shared/utils';
import { getUsers, getDevices } from '../api/auth';

export default function Users() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [u, d] = await Promise.all([getUsers(), getDevices()]);
        setUsers(Array.isArray(u) ? u : []);
        setDevices(Array.isArray(d) ? d : []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchData();
  }, []);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400';
      case 'superadmin': return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400';
    }
  };

  const filtered = users.filter(u =>
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Team Members</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Manage users and connected devices in your organization.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-slate-800 shadow-xl shadow-gray-200/20 dark:shadow-none">
          {/* Toolbar */}
          <div className="flex justify-between items-center mb-8">
            <div className="relative w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 text-slate-900 dark:text-white transition-all font-medium"
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-gray-400">
                {users.length} Users &middot; {devices.length} Devices
              </span>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-slate-800">
                  <th className="pb-6">User</th>
                  <th className="pb-6">Email</th>
                  <th className="pb-6">Role</th>
                  <th className="pb-6">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-16 text-center text-gray-400 font-medium">
                      {searchTerm ? 'No users match your search.' : 'No users in your organization yet.'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((user) => (
                    <tr key={user.id} className="group hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                            {(user.email || '?').charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {user.email?.split('@')[0] || 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td className="py-5 text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {user.email}
                      </td>
                      <td className="py-5">
                        <span className={cn("px-4 py-1.5 rounded-full text-xs font-bold uppercase", getRoleBadge(user.role))}>
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="py-5 text-sm text-gray-400 font-medium">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : '--'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Devices Section */}
          {devices.length > 0 && (
            <div className="mt-10 pt-8 border-t border-gray-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Connected Devices</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {devices.map((device) => (
                  <div key={device.id} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <Laptop size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{device.hostname || `Device ${device.id}`}</p>
                      <p className="text-xs text-gray-400">{device.os_type || 'Unknown OS'}</p>
                    </div>
                    <span className={cn("w-2.5 h-2.5 rounded-full",
                      device.status === 'active' ? "bg-green-500" : "bg-gray-300"
                    )}></span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
