import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './shared/Layout';
import Auth from './admin/Auth';
import Dashboard from './admin/Dashboard';
import Threats from './admin/Threats';
import Users from './admin/Users';
import Reports from './admin/Reports';
import Support from './admin/Support';
import Settings from './admin/Settings';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Apply dark mode class to root html element
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  if (!isAuthenticated) {
    return <Auth onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Layout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/threats" element={<Threats />} />
        <Route path="/users" element={<Users />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/support" element={<Support />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
}

export default App;
