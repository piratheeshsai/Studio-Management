import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import UsersPage from './pages/users/UsersPage';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import ChangePasswordPage from './pages/auth/ChangePasswordPage';
import CreateRolePage from './pages/roles/CreateRolePage';
import EditRolePage from './pages/roles/EditRolePage';

function App() {
  return (
    <AuthProvider>
      <Toaster position="bottom-right" richColors />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> {/* Keep register public or move it */}
          <Route path="/change-password" element={<ChangePasswordPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/roles/create" element={<CreateRolePage />} />
              <Route path="/roles/:id/edit" element={<EditRolePage />} />
            </Route>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
