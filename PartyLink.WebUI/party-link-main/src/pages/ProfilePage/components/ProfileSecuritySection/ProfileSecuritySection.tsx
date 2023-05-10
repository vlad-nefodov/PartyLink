import './ProfileSecuritySection.scss'
import { FaShieldAlt } from "react-icons/fa";
import { FC } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { IEmailSectionInputs } from './components/EmailSection/EmailSection';
import { IMobilePhoneSectionInputs } from './components/MobilePhoneSection/MobilePhoneSection';
import EmailSection from './components/EmailSection/EmailSection';
import MobilePhoneSection from './components/MobilePhoneSection/MobilePhoneSection';
import PasswordSection, { IPasswordSectionInputs } from './components/PasswordSection/PasswordSection';

export interface IProfileSecuritySectionProps {
  onEmailSubmit: (inputs: IEmailSectionInputs) => void,
  onMobilePhoneSubmit: (inputs: IMobilePhoneSectionInputs) => void,
  onPasswordSubmit: (inputs: IPasswordSectionInputs) => void,
  email: string,
  mobilePhone: string
}

const ProfileSecuritySection: FC<IProfileSecuritySectionProps> = (props) => {
  return (
    <Container>
      <Row>
        <Col md={12} className='mb-2'>
          <h5><FaShieldAlt size="14px" className='mb-1' /> Security</h5>
        </Col>
      </Row>
      <Row className='ps-2 pe-2'>
        <Col md={12} className='mb-3'>
          <EmailSection {...props} onSubmit={props.onEmailSubmit} />
        </Col>
        <Col md={12} className='mb-3'>
          <MobilePhoneSection {...props} onSubmit={props.onMobilePhoneSubmit} />
        </Col>
        <Col md={12} className='mb-3'>
          <PasswordSection {...props} onSubmit={props.onPasswordSubmit} />
        </Col>
      </Row >
    </Container >
  );
}

export default ProfileSecuritySection;