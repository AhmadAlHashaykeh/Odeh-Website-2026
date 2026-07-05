import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import AuthLoadingScreen from '../components/AuthLoadingScreen';

export function ProtectedRoute() {
  const { authenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <AuthLoadingScreen />;
  }

  if (!authenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export function GuestRoute() {
  const { authenticated, loading } = useAuth();
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname ?? '/admin/dashboard';

  if (loading) {
    return <AuthLoadingScreen />;
  }

  if (authenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}
