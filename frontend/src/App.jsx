import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      /**
       * Instradamento basato sul ruolo dell'utente.
       */
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {user?.ruolo === 'admin' ? <AdminDashboard /> : <UserDashboard />}
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

function App() {
  // L'AuthProvider ora è SOLO nel main.jsx, come da best practice!
  return <AppRoutes />;
}

export default App;