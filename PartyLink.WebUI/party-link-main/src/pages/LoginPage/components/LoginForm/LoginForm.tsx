import './LoginForm.scss'
import { FC, useState, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, FloatingLabel, Container, Spinner } from 'react-bootstrap';
import { ILoginData } from '../../../../services/authService/types';

export interface ILoginFormProps {
  isLoading: boolean,
  onLogin: (data: ILoginData) => void
}

export interface IDataInput {
  val: string,
  error?: string
}

export interface ILoginDataInputs {
  login: IDataInput,
  password: IDataInput
}

const LoginForm: FC<ILoginFormProps> = ({ isLoading, onLogin }) => {
  const [data, setData] = useState<ILoginDataInputs>({
    login: { val: "" },
    password: { val: "" }
  });

  const onLoginChangeHandle = (e: ChangeEvent<HTMLInputElement>) => {
    setData(cur => ({ ...cur, login: { val: e.target.value } }));
  }

  const onPasswordChangeHandle = (e: ChangeEvent<HTMLInputElement>) => {
    setData(cur => ({ ...cur, password: { val: e.target.value } }));
  }

  const validateLogin = (): boolean => {
    const { login } = data;
    if (login.val.length < 2 || login.val.length > 50) {
      login.error = "Must contain from 2 to 50 characters";
      setData(cur => ({ ...cur, login }));
      return false;
    }
    const loginRegex = /^(?!\s*$)([+\d][-+\d\s()]*\d|\w+@\w+\.\w{2,})$/;
    if (!loginRegex.test(login.val)) {
      login.error = "Must be an email or phone number";
      setData(cur => ({ ...cur, login }));
      return false;
    }
    return true;
  }

  const validatePassword = (): boolean => {
    const { password } = data;
    if (password.val.length < 8 || password.val.length > 30) {
      password.error = "Must contain from 8 to 30 characters";
      setData(cur => ({ ...cur, password }));
      return false;
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[^\s]+$/;
    if (!passwordRegex.test(password.val)) {
      password.error = "Must contain letters, numbers and no spaces";
      setData(cur => ({ ...cur, password }));
      return false;
    }
    return true;
  }

  const loginHandle = () => {
    const isLoginValid = validateLogin();
    const isPasswordValid = validatePassword();

    if (isLoginValid && isPasswordValid) {
      onLogin({ login: data.login.val, password: data.password.val });
    }
  };

  return (
    <Container className="login-form-container">
      <Form>
        <h2 className="text-center mb-4">Log in</h2>
        <FloatingLabel label="Email / Phone" className="mb-3">
          <Form.Control
            type="email"
            placeholder="Email / Phone"
            value={data.login.val}
            isInvalid={Boolean(data.login.error)}
            disabled={isLoading}
            maxLength={50}
            onChange={onLoginChangeHandle} />
          <Form.Control.Feedback type='invalid'>{data.login.error}</Form.Control.Feedback>
        </FloatingLabel>
        <FloatingLabel label="Password" className="mb-3">
          <Form.Control
            type="password"
            placeholder="Password"
            value={data.password.val}
            isInvalid={Boolean(data.password.error)}
            disabled={isLoading}
            maxLength={30}
            onChange={onPasswordChangeHandle} />
          <Form.Control.Feedback type='invalid'>{data.password.error}</Form.Control.Feedback>
        </FloatingLabel>
        {
          isLoading ?
            <div className="mt-4 text-center">
              <Spinner variant='primary' />
            </div> :
            (<>
              <div className="d-grid">
                <Button className="mb-4 mt-2" variant="outline-primary" size='lg' onClick={loginHandle}>Log in</Button>
              </div>
              <Form.Group>
                <div className="text-center">
                  <Form.Text>
                    {`Don't have an account? `}
                    <Link to="/signup">Sign up</Link>
                  </Form.Text>
                </div>
              </Form.Group>
            </>)
        }
      </Form>
    </Container>
  );
}

export default LoginForm;