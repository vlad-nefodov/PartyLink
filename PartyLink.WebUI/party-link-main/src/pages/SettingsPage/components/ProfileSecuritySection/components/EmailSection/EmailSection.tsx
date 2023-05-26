import { FC, ChangeEvent, useState, useEffect } from "react";
import { Row, Col, FloatingLabel, FormControl, Button } from "react-bootstrap";

export interface IEmailSectionProps {
  onSubmit: (inputs: IEmailSectionInputs) => void;
  email: string
}

export interface IDataInput {
  val: string,
  error?: string
}

export interface IEmailSectionInputs {
  email: IDataInput,
  passwordConfirmation: IDataInput
}

const EmailSection: FC<IEmailSectionProps> = (props) => {
  const [isDataChanged, setIsDataChanged] = useState<boolean>(false);
  const [data, setData] = useState<IEmailSectionInputs>({
    email: { val: props.email },
    passwordConfirmation: { val: "" }
  });

  useEffect(() => {
    if (data.email.val != props.email) {
      setIsDataChanged(true);
    }
    else {
      setIsDataChanged(false);
    }
  }, [data.email]);

  const onEmailChangeHandle = (e: ChangeEvent<HTMLInputElement>) => {
    setData(cur => ({ ...cur, email: { val: e.target.value } }));
  }

  const onPasswordConfirmationChangeHandle = (e: ChangeEvent<HTMLInputElement>) => {
    setData(cur => ({ ...cur, passwordConfirmation: { val: e.target.value } }));
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

  const validatePasswordConfirmation = (): boolean => {
    const { passwordConfirmation } = data;
    if (passwordConfirmation.val.length < 8 || passwordConfirmation.val.length > 30) {
      passwordConfirmation.error = "Must contain from 8 to 30 characters";
      setData(cur => ({ ...cur, passwordConfirmation }));
      return false;
    }
    const passwordConfirmationRegex = /^(?=.*[A-Za-z])(?=.*\d)[^\s]+$/;
    if (!passwordConfirmationRegex.test(passwordConfirmation.val)) {
      passwordConfirmation.error = "Must contain letters, numbers and no spaces";
      setData(cur => ({ ...cur, passwordConfirmation }));
      return false;
    }
    return true;
  }

  const onCancelHandle = () => {
    setData({
      email: { val: props.email },
      passwordConfirmation: { val: "" }
    });
  }

  const onSubmitHandle = () => {
    const isEmailValid = validateEmail();
    const isPasswordConfirmationValid = validatePasswordConfirmation();

    if (isEmailValid && isPasswordConfirmationValid) {
      props.onSubmit(data);
      setIsDataChanged(false);
      setData(cur => ({ ...cur, passwordConfirmation: { val: "" } }));
    }
  }

  return (
    <Row>
      <Col md={12}>
        <FloatingLabel label="Email">
          <FormControl
            type="email"
            placeholder="Email"
            value={data.email.val}
            isInvalid={Boolean(data.email.error)}
            maxLength={50}
            onChange={onEmailChangeHandle} />
          <FormControl.Feedback type='invalid'>{data.email.error}</FormControl.Feedback>
        </FloatingLabel>
      </Col>
      <Col md={12} className='mt-3' hidden={!isDataChanged}>
        <FloatingLabel label="Password confirmation">
          <FormControl
            type="password"
            placeholder="Password confirmation"
            value={data.passwordConfirmation.val}
            isInvalid={Boolean(data.passwordConfirmation.error)}
            maxLength={30}
            onChange={onPasswordConfirmationChangeHandle} />
          <FormControl.Feedback type='invalid'>{data.passwordConfirmation.error}</FormControl.Feedback>
        </FloatingLabel>
      </Col>
      <Col md={12} className='mt-3' hidden={!isDataChanged}>
        <Row className='justify-content-end'>
          <Col xs={3}>
            <div className="d-grid">
              <Button variant="outline-secondary" size="sm" onClick={onCancelHandle}>Cancel</Button>
            </div>
          </Col>
          <Col xs={3}>
            <div className="d-grid">
              <Button variant="primary" size="sm" onClick={onSubmitHandle}>Submit</Button>
            </div>
          </Col>
        </Row>
        <div className='form-controls-separator' hidden={!isDataChanged} />
      </Col>
    </Row>
  );
}

export default EmailSection;