import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Layout = () => {
  const { user } = useAuth();

  return !user ? <Outlet /> :
    <Navigate to="/" replace />
}

export default Layout;