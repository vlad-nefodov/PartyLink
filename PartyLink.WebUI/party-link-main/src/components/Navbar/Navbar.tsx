import './Navbar.scss';
import { IoNotificationsOutline } from "react-icons/io5";
import { FaBookmark, FaUserCircle, FaFire, FaSignInAlt } from "react-icons/fa";
import { useQuery } from 'react-query';
import { Navbar as BNavbar, Container, NavDropdown, Row, Col, Image } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { IByIdResponse } from "../../services/userService/types";
import { userService } from '../../services/userService/userService';
import LogoutModal from './components/LogoutModal/LogoutModal';

const Navbar = () => {
  const [isShowModal, setIsShowModal] = useState(false);
  const showModal = () => setIsShowModal(true);
  const hideModal = () => setIsShowModal(false);

  const { user, logoutMutation } = useAuth();
  const { data } = useQuery<IByIdResponse>('userByIdProfilePage', () => userService.getById(user?.id as string));

  const navigate = useNavigate();
  const goToMap = () => navigate('/');
  const goToProfile = () => navigate('/profile');


  const logoutHandle = () => {
    logoutMutation.mutate();
  }

  const ProfileImage = () => (
    <Image
      className='navbar-profile-image'
      src={
        data?.avatar?.base64Image ??
        `https://eu.ui-avatars.com/api/?name=${data?.name}+${data?.surname}&size=40&background=E6E7E8&font-size=0.4&rounded=true&format=svg`
      }
      alt="Profile image"
      roundedCircle
    />
  )

  return (
    <BNavbar bg='light' className='navbar-custom'>
      <Container>
        <BNavbar.Brand className='navbar-custom-brand' onClick={goToMap}>PartyLink</BNavbar.Brand>
        <BNavbar.Collapse className='justify-content-end'>
          <Row className='justify-content-end align-items-center'>
            <Col xs="auto" className='p-0'>
              <IoNotificationsOutline size="24px" className='navbar-custom-icon' />
            </Col>
            <Col xs="auto">
              <NavDropdown title={<ProfileImage />} align={{ xxl: "start" }}>
                <NavDropdown.Item className='navbar-dropdown-item' onClick={goToProfile}>
                  <FaUserCircle className='navbar-dropdown-item-icon' />Profile
                </NavDropdown.Item>
                <NavDropdown.Item className='navbar-dropdown-item'>
                  <FaFire className='navbar-dropdown-item-icon' />My events
                </NavDropdown.Item>
                <NavDropdown.Item className='navbar-dropdown-item'>
                  <FaBookmark className='navbar-dropdown-item-icon' />Bookmarks
                </NavDropdown.Item>
                <NavDropdown.Item className='navbar-dropdown-item' onClick={showModal}>
                  <FaSignInAlt className='navbar-dropdown-item-icon' />Log out
                </NavDropdown.Item>
                <LogoutModal show={isShowModal} onCancel={hideModal} onSubmit={logoutHandle} />
              </NavDropdown>
            </Col>
          </Row>
        </BNavbar.Collapse>
      </Container>
    </BNavbar>
  )
}

export default Navbar;