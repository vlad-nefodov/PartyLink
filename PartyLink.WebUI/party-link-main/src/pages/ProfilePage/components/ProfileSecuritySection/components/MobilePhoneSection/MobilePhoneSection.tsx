import { FC, ChangeEvent, useState, useEffect } from "react";
import { Row, Col, FloatingLabel, FormControl, Button } from "react-bootstrap";

export interface IMobilePhoneSectionProps {
  onSubmit: (inputs: IMobilePhoneSectionInputs) => void;
  mobilePhone: string
}

export interface IDataInput {
  val: string,
  error?: string
}

export interface IMobilePhoneSectionInputs {
  mobilePhone: IDataInput,
  passwordConfirmation: IDataInput
}

const MobilePhoneSection: FC<IMobilePhoneSectionProps> = (props) => {
  const [isDataChanged, setIsDataChanged] = useState<boolean>(false);
  const [data, setData] = useState<IMobilePhoneSectionInputs>({
    mobilePhone: { val: props.mobilePhone },
    passwordConfirmation: { val: "" }
  });

  useEffect(() => {
    if (data.mobilePhone.val != props.mobilePhone) {
      setIsDataChanged(true);
    }
    else {
      setIsDataChanged(false);
    }
  }, [data.mobilePhone]);

  const onMobilePhoneChangeHandle = (e: ChangeEvent<HTMLInputElement>) => {
    setData(cur => ({ ...cur, mobilePhone: { val: e.target.value } }));
  }

  const onPasswordConfirmationChangeHandle = (e: ChangeEvent<HTMLInputElement>) => {
    setData(cur => ({ ...cur, passwordConfirmation: { val: e.target.value } }));
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
      mobilePhone: { val: props.mobilePhone },
      passwordConfirmation: { val: "" }
    });
  }

  const onSubmitHandle = () => {
    const isMobilePhoneValid = validateMobilePhone();
    const isPasswordConfirmationValid = validatePasswordConfirmation();

    if (isMobilePhoneValid && isPasswordConfirmationValid) {
      props.onSubmit(data);
      setIsDataChanged(false);
      setData(cur => ({ ...cur, passwordConfirmation: { val: "" } }));
    }
  }

  return (
    <Row>
      <Col md={12}>
        <FloatingLabel label="Mobile phone">
          <FormControl
            type="tel"
            placeholder="Mobile phone"
            value={data.mobilePhone.val}
            isInvalid={Boolean(data.mobilePhone.error)}
            maxLength={50}
            onChange={onMobilePhoneChangeHandle} />
          <FormControl.Feedback type='invalid'>{data.mobilePhone.error}</FormControl.Feedback>
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

export default MobilePhoneSection;