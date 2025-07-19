import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/Layout/Navbar';
import { AuthForm } from './components/Auth/AuthForm';
import { Dashboard } from './pages/Dashboard';
import { Sheets } from './pages/Sheets';
import Upload from './pages/Upload';
import SheetView from './pages/SheetView';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/auth" />;
};

const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Routes>
        <Route path="/auth" element={!user ? <AuthForm /> : <Navigate to="/" />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Navbar />
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/sheets" element={<Sheets />} />
                  <Route path="/upload" element={<Upload />} />
                  <Route path="/sheet/:id" element={<SheetView />} />
                </Routes>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;