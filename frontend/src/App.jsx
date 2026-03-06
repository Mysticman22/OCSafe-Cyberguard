import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { isAuthenticated, getCurrentUser, clearToken } from './api/auth';

// General Auth & Public
import Landing from './pages/Landing';
import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';

// Admin Dashboard
import Layout from './shared/Layout';
import AdminDashboard from './admin/Dashboard';
import Threats from './admin/Threats';
import AdminUsers from './admin/Users';
import Reports from './admin/Reports';
import Support from './admin/Support';
import AdminSettings from './admin/Settings';

// User Dashboard
import UserLayout from './user/UserLayout';
import UserDashboard from './user/UserDashboard';
import UserPerformance from './user/UserPerformance';
import UserEndpoints from './user/UserEndpoints';
import UserNetwork from './user/UserNetwork';
import UserProfile from './user/UserProfile';

function ProtectedRoute({ children, requiredRole }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/signin', { replace: true });
      return;
    }

    getCurrentUser().then((userData) => {
      if (!userData) {
        clearToken();
        navigate('/signin', { replace: true });
        return;
      }
      if (requiredRole && userData.role !== requiredRole) {
        // Wrong role - redirect to correct dashboard
        navigate(userData.role === 'admin' ? '/admin/dashboard' : '/user/dashboard', { replace: true });
        return;
      }
      setUser(userData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return children;
}

function AdminApp() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  return (
    <Layout isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)}>
      <Routes>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="threats" element={<Threats />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="reports" element={<Reports />} />
        <Route path="support" element={<Support />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </Layout>
  );
}

function UserApp() {
  return (
    <UserLayout>
      <Routes>
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="performance" element={<UserPerformance />} />
        <Route path="endpoints" element={<UserEndpoints />} />
        <Route path="network" element={<UserNetwork />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </UserLayout>
  );
}

function RoleBasedRedirect() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/signin', { replace: true });
      return;
    }

    getCurrentUser().then((userData) => {
      if (!userData) {
        navigate('/signin', { replace: true });
        return;
      }
      navigate(userData.role === 'admin' ? '/admin/dashboard' : '/user/dashboard', { replace: true });
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return null;
}

function App() {
  return (
    <Routes>
      {/* Public Auth Pages */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Admin Dashboard - Protected (admin role only) */}
      <Route path="/admin/*" element={
        <ProtectedRoute requiredRole="admin">
          <AdminApp />
        </ProtectedRoute>
      } />

      {/* User Dashboard - Protected (user role only) */}
      <Route path="/user/*" element={
        <ProtectedRoute requiredRole="user">
          <UserApp />
        </ProtectedRoute>
      } />

      {/* Public Pages */}
      <Route path="/" element={<Landing />} />

      {/* Role-based redirect helper */}
      <Route path="/dashboard" element={<RoleBasedRedirect />} />
      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  );
}

export default App;
