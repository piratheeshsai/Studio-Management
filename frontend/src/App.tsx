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
import PackagesPage from './pages/packages/PackagesPage';
import ClientsPage from './pages/clients/ClientsPage';
import ShootsPage from './pages/shoots/ShootsPage';
import ShootDetailsPage from './pages/shoots/ShootDetailsPage';
import SettingsPage from './pages/settings/SettingsPage';

import { useTheme } from './context/ThemeContext';

function App() {
  const { theme } = useTheme();

  return (
    <AuthProvider>
      <Toaster position="bottom-right" richColors style={{ zIndex: 9999 }} theme="light" />
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
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/shoots" element={<ShootsPage />} />
              <Route path="/shoots/:id" element={<ShootDetailsPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/packages" element={<PackagesPage />} />
              <Route path="/settings" element={<SettingsPage />} />
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
