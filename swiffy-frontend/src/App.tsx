import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoginResponse } from '@/api/userApi';

import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './components/LoginPage';
import BookingList from './components/BookingList';
import Confirmation from './components/Confirmation';
import PaymentPage from './pages/PaymentPage';
import BookingForm from './components/form';
import { RegisterPage } from './components/Register';
import { BookingUpdateProvider } from './store/BookingUpdateContext';
import { useAuthStore } from '@/store/useAuthStore';

const App: React.FC = () => {
  const { isAuthenticated, setIsAuthenticated, checkAuthFromStorage } = useAuthStore();

  useEffect(() => {
    checkAuthFromStorage();
  }, [checkAuthFromStorage]);

  const handleLoginSuccess = (data: LoginResponse) => {
    setIsAuthenticated(true);
    if (data.user?.id) {
      useAuthStore.getState().setUserId(data.user.id);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('isAuthenticated');
  };

  return (
    <Router>
      <BookingUpdateProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar onLogout={handleLogout} isAuthenticated={isAuthenticated} />
          <Routes>
            <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<Navigate to="/nouvelle-reservation" replace />} />
            
            <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
              <Route path="/nouvelle-reservation" element={<BookingForm />} />
              <Route path="/mes-reservations" element={<BookingList />} />
              <Route path="/confirmation" element={<Confirmation />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/modifier-reservation/:id" element={<BookingForm />} />
            </Route>
          </Routes>
          <ToastContainer />
        </div>
      </BookingUpdateProvider>
    </Router>
  );
};

export default App;
