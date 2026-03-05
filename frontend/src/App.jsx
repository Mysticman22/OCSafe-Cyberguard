import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';
import UserLayout from './user/UserLayout';
import UserDashboard from './user/UserDashboard';
import UserPerformance from './user/UserPerformance';
import UserEndpoints from './user/UserEndpoints';
import UserNetwork from './user/UserNetwork';
import UserProfile from './user/UserProfile';

function App() {
  return (
    <Routes>
      {/* General Auth Pages */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* User Dashboard */}
      <Route path="/user/*" element={
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
      } />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/user/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
    </Routes>
  );
}

export default App;
