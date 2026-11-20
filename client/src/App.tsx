import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { ProgramsPage } from './pages/public/ProgramsPage';
import { ClassesPage } from './pages/public/ClassesPage';
import { ServicesPage } from './pages/public/ServicesPage';
import { PricingPage } from './pages/public/PricingPage';
import { TrainersPage } from './pages/public/TrainersPage';
import { GalleryPage } from './pages/public/GalleryPage';
import { ContactPage } from './pages/public/ContactPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Admin Pages
import { AdminLayout } from './layouts/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { CustomerManagement } from './pages/admin/CustomerManagement';
import { CustomerDetail } from './pages/admin/CustomerDetail';
import { TrainerManagement } from './pages/admin/TrainerManagement';
import { MembershipManagement } from './pages/admin/MembershipManagement';
import { PaymentManagement } from './pages/admin/PaymentManagement';
import { AttendanceManagement } from './pages/admin/AttendanceManagement';
import { WorkoutManagement } from './pages/admin/WorkoutManagement';
import { DietManagement } from './pages/admin/DietManagement';
import { EnquiryManagement } from './pages/admin/EnquiryManagement';
import { ExpenseManagement } from './pages/admin/ExpenseManagement';
import { ReportManagement } from './pages/admin/ReportManagement';
import { GymSettingsPage } from './pages/admin/GymSettingsPage';

// Portals
import { CustomerPortal } from './pages/customer/CustomerPortal';
import { TrainerPortal } from './pages/trainer/TrainerPortal';

// Role Guard
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const ProtectedCustomerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const ProtectedTrainerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isTrainer, isAdmin } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!isTrainer && !isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <Routes>
              {/* Public Multi-Page Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/programs" element={<ProgramsPage />} />
              <Route path="/classes" element={<ClassesPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/trainers" element={<TrainersPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* Authentication */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Admin Management System */}
              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout />
                  </ProtectedAdminRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="customers" element={<CustomerManagement />} />
                <Route path="customers/:id" element={<CustomerDetail />} />
                <Route path="trainers" element={<TrainerManagement />} />
                <Route path="memberships" element={<MembershipManagement />} />
                <Route path="payments" element={<PaymentManagement />} />
                <Route path="attendance" element={<AttendanceManagement />} />
                <Route path="workouts" element={<WorkoutManagement />} />
                <Route path="diets" element={<DietManagement />} />
                <Route path="enquiries" element={<EnquiryManagement />} />
                <Route path="expenses" element={<ExpenseManagement />} />
                <Route path="reports" element={<ReportManagement />} />
                <Route path="settings" element={<GymSettingsPage />} />
              </Route>

              {/* Customer Self-Service Portal */}
              <Route
                path="/portal"
                element={
                  <ProtectedCustomerRoute>
                    <CustomerPortal />
                  </ProtectedCustomerRoute>
                }
              />

              {/* Trainer Portal */}
              <Route
                path="/trainer"
                element={
                  <ProtectedTrainerRoute>
                    <TrainerPortal />
                  </ProtectedTrainerRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};
