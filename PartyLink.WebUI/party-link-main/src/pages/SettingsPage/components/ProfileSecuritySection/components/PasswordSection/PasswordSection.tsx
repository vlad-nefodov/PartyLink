import { FC, ChangeEvent, useState, useEffect } from "react";
import { Row, Col, FloatingLabel, FormControl, Button } from "react-bootstrap";

export interface IPasswordSectionProps {
  onSubmit: (inputs: IPasswordSectionInputs) => void;
}

export interface IDataInput {
  val: string,
  error?: string
}

export interface IPasswordSectionInputs {
  password: IDataInput,
  passwordConfirmation: IDataInput
}

const PasswordSection: FC<IPasswordSectionProps> = (props) => {
  const [isDataChanged, setIsDataChanged] = useState<boolean>(false);
  const [data, setData] = useState<IPasswordSectionInputs>({
    password: { val: "" },
    passwordConfirmation: { val: "" }
  });

  useEffect(() => {
    if (data.password.val != "") {
      setIsDataChanged(true);
    }
    else {
      setIsDataChanged(false);
    }
  }, [data.password]);

  const onPasswordChangeHandle = (e: ChangeEvent<HTMLInputElement>) => {
    setData(cur => ({ ...cur, password: { val: e.target.value } }));
  }

  const onPasswordConfirmationChangeHandle = (e: ChangeEvent<HTMLInputElement>) => {
    setData(cur => ({ ...cur, passwordConfirmation: { val: e.target.value } }));
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
      password: { val: "" },
      passwordConfirmation: { val: "" }
    });
  }

  const onSubmitHandle = () => {
    const isPasswordValid = validatePassword();
    const isPasswordConfirmationValid = validatePasswordConfirmation();

    if (isPasswordValid && isPasswordConfirmationValid) {
      props.onSubmit(data);
      setIsDataChanged(false);
      setData({
        password: { val: "" },
        passwordConfirmation: { val: "" }
      });
    }
  }

  return (
    <Row>
      <Col md={12}>
        <FloatingLabel label="New password">
          <FormControl
            type="password"
            placeholder="New password"
            value={data.password.val}
            isInvalid={Boolean(data.password.error)}
            maxLength={50}
            onChange={onPasswordChangeHandle} />
          <FormControl.Feedback type='invalid'>{data.password.error}</FormControl.Feedback>
        </FloatingLabel>
      </Col>
      <Col md={12} className='mt-3' hidden={!isDataChanged}>
        <FloatingLabel label="Current password">
          <FormControl
            type="password"
            placeholder="Current password"
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
      </Col>
    </Row>
  );
}

export default PasswordSection;