import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import HomePage from './pages/HomePage';
import ResourcesPage from './pages/ResourcesPage';
import AddResourcePage from './pages/AddResourcePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import Inventory from './pages/Inventory';
import Recipes from './pages/Recipes';
import MealPlanning from './pages/MealPlanning';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import VerifyCodePage from './pages/VerifyCodePage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import GoogleAuthSuccess from './pages/GoogleAuthSuccess';
import Logs from './pages/Logs';
import ReceiptUpload from './pages/ReceiptUpload';

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {isAuthenticated && <Navigation />}
      <Routes>
        {isAuthenticated ? (
          // Authenticated routes
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/meal-planning" element={<MealPlanning />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/receipt-upload" element={<ReceiptUpload />} />
            <Route path="/add-resource" element={<AddResourcePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          // Unauthenticated routes - redirect to login
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/verify-code" element={<VerifyCodePage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;