import './LoginPage.scss';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ILoginData } from '../../services/authService/types';
import { ToastContainer, toast } from 'react-toastify';
import { AxiosError } from 'axios';
import LoginForm from './components/LoginForm/LoginForm';

function LoginPage() {
  const { loginMutation } = useAuth();
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);

  const showError = (message: string) => {
    toast.error(message);
  }

  const hideError = () => {
    toast.dismiss();
  }

  const handleLogin = (data: ILoginData) => {
    hideError();
    setIsLoginLoading(true);
    loginMutation.mutate(data, {
      onError: (error) => {
        let message = "Service is not available, try again later.";
        const axiosError = error as AxiosError;

        if (axiosError?.response?.status === 401)
          message = "Wrong login or password.";
        else
          message = "No connection, try again later.";

        setTimeout(() => {
          setIsLoginLoading(false);
          showError(message);
        }, 1000);
      }
    });
  }

  return (
    <div className='login-page-container'>
      <LoginForm onLogin={handleLogin} isLoading={isLoginLoading} />
      <ToastContainer
        position="top-center"
        limit={1}
        autoClose={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        theme="colored"
        closeButton={false}
      />
    </div>
  );
}

export default LoginPage;