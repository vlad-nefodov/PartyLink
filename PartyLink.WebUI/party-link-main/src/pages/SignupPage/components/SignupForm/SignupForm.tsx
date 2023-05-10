import './Signup.scss';
import { FC, useState, ChangeEvent } from 'react';
import { Container, Form, Button, FloatingLabel, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Gender, ICreateData } from '../../../../services/userService/types';

export interface ISignupFormProps {
  isLoading: boolean,
  onSignup: (data: ICreateData) => void
}

export interface IDataInput {
  val: string,
  error?: string
}

export interface ISignupDataInputs {
  name: IDataInput,
  surname: IDataInput,
  gender: Gender,
  email: IDataInput,
  mobilePhone: IDataInput,
  password: IDataInput,
  passwordConfirmation: IDataInput
}

const SignupForm: FC<ISignupFormProps> = ({ onSignup, isLoading }) => {
  const [data, setData] = useState<ISignupDataInputs>({
    name: { val: "" },
    surname: { val: "" },
    gender: 0,
    email: { val: "" },
    mobilePhone: { val: "" },
    password: { val: "" },
    passwordConfirmation: { val: "" }
  });

  const onNameChangeHandle = (e: ChangeEvent<HTMLInputElement>) => {
    setData(cur => ({ ...cur, name: { val: e.target.value } }));
  }

  const onSurnameChangeHandle = (e: ChangeEvent<HTMLInputElement>) => {
    setData(cur => ({ ...cur, surname: { val: e.target.value } }));
  }

  const onGenderChangeHandle = (e: ChangeEvent<HTMLSelectElement>) => {
    setData(cur => ({ ...cur, gender: Number(e.target.value) }));
  }

  const onEmailChangeHandle = (e: ChangeEvent<HTMLInputElement>) => {
    setData(cur => ({ ...cur, email: { val: e.target.value } }));
  }

  const onMobilePhoneChangeHandle = (e: ChangeEvent<HTMLInputElement>) => {
    setData(cur => ({ ...cur, mobilePhone: { val: e.target.value } }));
  }

  const onPasswordChangeHandle = (e: ChangeEvent<HTMLInputElement>) => {
    setData(cur => ({ ...cur, password: { val: e.target.value } }));
  }

  const onPasswordConfirmationChangeHandle = (e: ChangeEvent<HTMLInputElement>) => {
    setData(cur => ({ ...cur, passwordConfirmation: { val: e.target.value } }));
  }

  const validateName = (): boolean => {
    const { name } = data;
    if (name.val.length < 2 || name.val.length > 25) {
      name.error = "Must contain from 2 to 25 characters";
      setData(cur => ({ ...cur, name }));
      return false;
    }
    const nameRegex = /^[A-Z][a-z]*$/;
    if (!nameRegex.test(name.val)) {
      name.error = "Must contain only the letters and begin with a capital";
      setData(cur => ({ ...cur, name }));
      return false;
    }
    return true;
  }

  const validateSurname = (): boolean => {
    const { surname } = data;
    if (surname.val.length < 2 || surname.val.length > 25) {
      surname.error = "Must contain from 2 to 25 characters";
      setData(cur => ({ ...cur, surname }));
      return false;
    }
    const surnameRegex = /^[A-Z][a-z]*$/;
    if (!surnameRegex.test(surname.val)) {
      surname.error = "Must contain only the letters and begin with a capital";
      setData(cur => ({ ...cur, surname }));
      return false;
    }
    return true;
  }

  const validateEmail = (): boolean => {
    const { email } = data;
    if (email.val.length < 5 || email.val.length > 50) {
      email.error = "Must contain from 5 to 50 characters";
      setData(cur => ({ ...cur, email }));
      return false;
    }
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email.val)) {
      email.error = "Must be in email format";
      setData(cur => ({ ...cur, email }));
      return false;
    }
    return true;
  }

  const validateMobilePhone = (): boolean => {
    const { mobilePhone } = data;
    if (mobilePhone.val.length < 8 || mobilePhone.val.length > 16) {
      mobilePhone.error = "Must contain from 8 to 16 characters";
      setData(cur => ({ ...cur, mobilePhone }));
      return false;
    }
    const mobilePhoneRegex = /^\+?[1-9]\d{1,16}$/;
    if (!mobilePhoneRegex.test(mobilePhone.val)) {
      mobilePhone.error = "Must be in mobile phone format";
      setData(cur => ({ ...cur, mobilePhone }));
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

  const validatePasswordConfirmation = (): boolean => {
    const { passwordConfirmation, password } = data;
    if (passwordConfirmation.val !== password.val) {
      passwordConfirmation.error = "Confirmation is different from the password";
      setData(cur => ({ ...cur, passwordConfirmation }));
      return false;
    }
    return true;
  }

  const signupHandle = () => {
    const isNameValid = validateName();
    const isSurnameValid = validateSurname();
    const isEmailValid = validateEmail();
    const isMobilePhoneValid = validateMobilePhone();
    const isPasswordValid = validatePassword();
    const isPasswordConfirmationValid = validatePasswordConfirmation();

    if (
      isNameValid &&
      isSurnameValid &&
      isEmailValid &&
      isMobilePhoneValid &&
      isPasswordValid &&
      isPasswordConfirmationValid
    ) {
      onSignup({
        name: data.name.val,
        surname: data.surname.val,
        gender: data.gender,
        email: data.email.val,
        mobilePhone: data.mobilePhone.val,
        password: data.password.val
      });
    }
  }

  return (
    <Container className="signup-form-container">
      <Form>
        <h2 className="text-center mb-4">Sign up</h2>
        <Form.Group className="mb-3">
          <FloatingLabel label="Name" className="mb-3">
            <Form.Control
              type="text"
              placeholder="Name"
              value={data.name.val}
              isInvalid={Boolean(data.name.error)}
              disabled={isLoading}
              maxLength={25}
              onChange={onNameChangeHandle} />
            <Form.Control.Feedback type='invalid'>{data.name.error}</Form.Control.Feedback>
          </FloatingLabel>
        </Form.Group>
        <Form.Group className="mb-3">
          <FloatingLabel label="Surname" className="mb-3">
            <Form.Control
              type="text"
              placeholder="Surname"
              value={data.surname.val}
              isInvalid={Boolean(data.surname.error)}
              disabled={isLoading}
              maxLength={25}
              onChange={onSurnameChangeHandle} />
            <Form.Control.Feedback type='invalid'>{data.surname.error}</Form.Control.Feedback>
          </FloatingLabel>
        </Form.Group>
        <Form.Group className="mb-3">
          <FloatingLabel label="Gender" className="mb-3">
            <Form.Select
              value={data.gender}
              onChange={onGenderChangeHandle}
              disabled={isLoading}>
              <option value={0}>Male</option>
              <option value={1}>Female</option>
              <option value={2}>Other</option>
            </Form.Select>
          </FloatingLabel>
        </Form.Group>
        <Form.Group className="mb-3">
          <FloatingLabel label="Email" className="mb-3">
            <Form.Control
              type="email"
              placeholder="Email"
              value={data.email.val}
              isInvalid={Boolean(data.email.error)}
              maxLength={50}
              disabled={isLoading}
              onChange={onEmailChangeHandle} />
            <Form.Control.Feedback type='invalid'>{data.email.error}</Form.Control.Feedback>
          </FloatingLabel>
        </Form.Group>
        <Form.Group className="mb-3">
          <FloatingLabel label="Mobile phone" className="mb-3">
            <Form.Control
              type="tel"
              placeholder="Mobile phone"
              value={data.mobilePhone.val}
              isInvalid={Boolean(data.mobilePhone.error)}
              disabled={isLoading}
              maxLength={16}
              onChange={onMobilePhoneChangeHandle} />
            <Form.Control.Feedback type='invalid'>{data.mobilePhone.error}</Form.Control.Feedback>
          </FloatingLabel>
        </Form.Group>
        <Form.Group className="mb-3">
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
        </Form.Group>
        <Form.Group className="mb-3">
          <FloatingLabel label="Password confirmation" className="mb-3">
            <Form.Control
              type="password"
              placeholder="Password confirmation"
              value={data.passwordConfirmation.val}
              isInvalid={Boolean(data.passwordConfirmation.error)}
              disabled={isLoading}
              maxLength={30}
              onChange={onPasswordConfirmationChangeHandle} />
            <Form.Control.Feedback type='invalid'>{data.passwordConfirmation.error}</Form.Control.Feedback>
          </FloatingLabel>
        </Form.Group>
        {
          isLoading ?
            <div className="mt-4 text-center">
              <Spinner variant='primary' />
            </div> :
            (<>
              <div className="d-grid">
                <Button className="mb-4 mt-2" variant="outline-primary" size="lg" onClick={signupHandle}>Sign up</Button>
              </div>
              <Form.Group>
                <div className="text-center">
                  <Form.Text>
                    {`Have an account? `}
                    <Link to="/login">Log in</Link>
                  </Form.Text>
                </div>
              </Form.Group>
            </>)
        }
      </Form>
    </Container>
  );
}

export default SignupForm;