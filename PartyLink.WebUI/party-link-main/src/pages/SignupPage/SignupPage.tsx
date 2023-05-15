import './SignupPage.scss';
import { useState } from 'react';
import { Container } from 'react-bootstrap';
import { useMutation } from 'react-query';
import { ICreateData } from '../../services/userService/types';
import { userService } from '../../services/userService/userService';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { AxiosError } from 'axios';
import SignupForm from './components/SignupForm/SignupForm';

function SignupPage() {
  const signupMutation = useMutation("createUser", userService.create);
  const [isSignupLoading, setIsSignupLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const showError = (message: string) => {
    toast.error(message);
  }

  const showSignupConfirmation = () => {
    toast.success("Profile created",
      {
        hideProgressBar: false,
        autoClose: 2000,
      }
    );
  }

  const hideToasts = () => {
    toast.dismiss();
  }

  const handleSignup = (data: ICreateData) => {
    hideToasts();
    setIsSignupLoading(true);
    signupMutation.mutate(data, {
      onSuccess: () => {
        setTimeout(() => {
          setIsSignupLoading(false);
          showSignupConfirmation();
          setTimeout(() => {
            navigate("login", { replace: true });
          }, 3000);
        }, 1000);
      },
      onError: (error) => {
        let message = "Service is not available, try again later.";
        const axiosError = error as AxiosError;

        if (axiosError?.response?.status === 409) {
          const data = axiosError?.response?.data;
          if (data?.hasOwnProperty("email"))
            message = "Email already in use.";
          else if (data?.hasOwnProperty("mobilePhone"))
            message = "Mobile phone already in use.";
          else if (data?.hasOwnProperty("password"))
            message = "Password already in use.";
        }
        else
          message = "No connection, try again later.";

        setTimeout(() => {
          setIsSignupLoading(false);
          showError(message);
        }, 1000);
      }
    });
  }

  return (
    <Container className='signup-page-container'>
      <SignupForm onSignup={handleSignup} isLoading={isSignupLoading} />
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
    </Container>
  );
}

export default SignupPage;