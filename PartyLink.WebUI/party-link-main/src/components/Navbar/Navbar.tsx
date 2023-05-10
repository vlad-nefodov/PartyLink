import './Navbar.scss';
import { FaUserCircle, FaSignInAlt } from "react-icons/fa";
import { useQuery } from 'react-query';
import { Navbar as BNavbar, Container, NavDropdown, Modal, Button, Image } from 'react-bootstrap';
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
      <Container fluid className="ps-5 pe-5">
        <BNavbar.Brand className='navbar-custom-brand' onClick={goToMap}>PartyLink</BNavbar.Brand>
        <BNavbar.Collapse className='justify-content-end'>
          <NavDropdown title={<ProfileImage />} align="end">
            <NavDropdown.Item onClick={goToProfile}>
              <FaUserCircle className='navbar-dropdown-item-icon' />Profile
            </NavDropdown.Item>
            <NavDropdown.Item onClick={showModal}>
              <FaSignInAlt className='navbar-dropdown-item-icon' />Log out
            </NavDropdown.Item>
            <LogoutModal show={isShowModal} onCancel={hideModal} onSubmit={logoutHandle} />
          </NavDropdown>
        </BNavbar.Collapse>
      </Container>
    </BNavbar>
  )
}

export default Navbar;