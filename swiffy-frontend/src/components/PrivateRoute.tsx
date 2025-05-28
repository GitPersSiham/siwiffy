import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface PrivateRouteProps {
  isAuthenticated: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ isAuthenticated }) => {
  const location = useLocation();

  if (!isAuthenticated) {
    const returnPath = location.pathname === '/payment' ? '/nouvelle-reservation' : location.pathname;
    return <Navigate to="/login" state={{ from: { pathname: returnPath } }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;


