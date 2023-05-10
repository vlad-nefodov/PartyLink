import "./AuthLayout.scss";
import { Outlet, Navigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import { useAuth } from '../../hooks/useAuth';

const AuthLayout = () => {
  const { user } = useAuth();

  return user ? (
    <>
      <Navbar />
      <div className='auth-layout-container'>
        <Outlet />
      </div>
    </>
  ) : <Navigate to="/login" replace />
}

export default AuthLayout;