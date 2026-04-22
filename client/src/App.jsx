import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import ClientDetail from './pages/ClientDetail';
import Bills from './pages/Bills';
import Settings from './pages/Settings';
import RecycleBin from './pages/RecycleBin';

// ProtectedRoute: Checks for JWT in localStorage
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// PublicOnlyRoute: Redirects to /dashboard if already logged in
const PublicOnlyRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  const token = localStorage.getItem('token');

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* Root Path Logic */}
        <Route 
          path="/" 
          element={token ? <Navigate to="/dashboard" replace /> : <Landing />} 
        />

        {/* Public Auth Routes */}
        <Route path="/login" element={
          <PublicOnlyRoute><Login /></PublicOnlyRoute>
        } />
        <Route path="/signup" element={
          <PublicOnlyRoute><Signup /></PublicOnlyRoute>
        } />
        
        {/* Protected Professional Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/recycle-bin" element={
          <ProtectedRoute><RecycleBin /></ProtectedRoute>
        } />
        <Route path="/clients/:id" element={
          <ProtectedRoute><ClientDetail /></ProtectedRoute>
        } />
        <Route path="/bills" element={
          <ProtectedRoute><Bills /></ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute><Settings /></ProtectedRoute>
        } />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
