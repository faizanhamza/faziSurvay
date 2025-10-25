import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SchoolProvider } from './context/SchoolContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { SchoolManagement } from './pages/SchoolManagement';
import { Branding } from './pages/Branding';
import { Uploads } from './pages/Uploads';
import { SurveyBuilder } from './pages/SurveyBuilder';
import { Portal } from './pages/Portal';
import { DataManagement } from './pages/DataManagement';
import { useEffect } from 'react';
import { initializeDemoData } from './utils/mockData';

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    initializeDemoData();
  }, []);

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/schools"
        element={
          <ProtectedRoute allowedRoles={['superadmin']}>
            <Layout>
              <SchoolManagement />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/portal"
        element={
          <ProtectedRoute allowedRoles={['admin', 'teacher', 'viewer']}>
            <Layout>
              <Portal />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/surveys"
        element={
          <ProtectedRoute allowedRoles={['admin', 'teacher']}>
            <Layout>
              <SurveyBuilder />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/uploads"
        element={
          <ProtectedRoute allowedRoles={['admin', 'teacher']}>
            <Layout>
              <Uploads />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/branding"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout>
              <Branding />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/data"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout>
              <DataManagement />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SchoolProvider>
          <AppRoutes />
        </SchoolProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
