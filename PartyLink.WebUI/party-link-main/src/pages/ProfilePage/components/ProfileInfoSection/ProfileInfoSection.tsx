import './ProfileInfoSection.scss'
import { FaRegIdCard } from "react-icons/fa";
import { FC, useState, useEffect, ChangeEvent } from 'react';
import { Form, FloatingLabel, Button, Container, Row, Col } from 'react-bootstrap';
import { Gender } from '../../../../services/userService/types';

export interface IProfileInfoSectionProps {
  onSubmit: (inputs: IProfileInfoInputs) => void;
  name: string,
  surname: string,
  gender: Gender
}

export interface IDataInput {
  val: string,
  error?: string
}

export interface IProfileInfoInputs {
  name: IDataInput,
  surname: IDataInput,
  gender: Gender
}

const ProfileInfoSection: FC<IProfileInfoSectionProps> = (props) => {
  const [isDataChanged, setIsDataChanged] = useState<boolean>(false);
  const [data, setData] = useState<IProfileInfoInputs>({
    name: { val: props.name },
    surname: { val: props.surname },
    gender: props.gender
  });

  useEffect(() => {
    if (
      data.name.val != props.name ||
      data.surname.val != props.surname ||
      data.gender != props.gender
    ) {
      setIsDataChanged(true);
    }
    else {
      setIsDataChanged(false);
    }
  }, [data]);

  const onNameChangeHandle = (e: ChangeEvent<HTMLInputElement>) => {
    setData(cur => ({ ...cur, name: { val: e.target.value } }));
  }

  const onSurnameChangeHandle = (e: ChangeEvent<HTMLInputElement>) => {
    setData(cur => ({ ...cur, surname: { val: e.target.value } }));
  }

  const onGenderChangeHandle = (e: ChangeEvent<HTMLSelectElement>) => {
    setData(cur => ({ ...cur, gender: Number(e.target.value) }));
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

  const onCancelHandle = () => {
    setData({
      name: { val: props.name },
      surname: { val: props.surname },
      gender: props.gender
    });
  }

  const onSubmitHandle = () => {
    const isNameValid = validateName();
    const isSurnameValid = validateSurname();

    if (isNameValid && isSurnameValid) {
      props.onSubmit(data);
      setIsDataChanged(false);
    }
  }

  return (
    <Container>
      <Row>
        <Col md={12} className='mb-2'>
          <h5><FaRegIdCard size="14px" className='mb-1' /> Personal info</h5>
        </Col>
      </Row>
      <Row className='ps-2 pe-2'>
        <Col md={12} className='mb-3'>
          <FloatingLabel label="Name">
            <Form.Control
              type="text"
              placeholder="Name"
              value={data.name.val}
              isInvalid={Boolean(data.name.error)}
              maxLength={25}
              onChange={onNameChangeHandle} />
            <Form.Control.Feedback type='invalid'>{data.name.error}</Form.Control.Feedback>
          </FloatingLabel>
        </Col>
        <Col md={12} className='mb-3'>
          <FloatingLabel label="Surname">
            <Form.Control
              type="text"
              placeholder="Surname"
              value={data.surname.val}
              isInvalid={Boolean(data.surname.error)}
              maxLength={25}
              onChange={onSurnameChangeHandle} />
            <Form.Control.Feedback type='invalid'>{data.surname.error}</Form.Control.Feedback>
          </FloatingLabel>
        </Col>
        <Col md={12}>
          <FloatingLabel label="Gender">
            <Form.Select
              value={data.gender}
              onChange={onGenderChangeHandle}>
              <option value={0}>Male</option>
              <option value={1}>Female</option>
              <option value={2}>Other</option>
            </Form.Select>
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
      </Row >
    </Container >
  );
}

export default ProfileInfoSection;