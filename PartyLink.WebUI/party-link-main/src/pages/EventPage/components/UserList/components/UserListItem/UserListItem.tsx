import './UserListItem.scss'
import { FC } from 'react';
import { FaCrown } from "react-icons/fa";
import { EventUserRole, IEventUserResponse } from '../../../../../../services/eventService/eventService';
import { useNavigate } from 'react-router-dom';
import { Image } from 'react-bootstrap';

export interface IUserListItemProps {
  user: IEventUserResponse
}

const UserListItem: FC<IUserListItemProps> = ({ user }) => {
  const navigate = useNavigate();
  return (
    <div className='user-list-item d-flex align-items-center justify-content-between' onClick={() => navigate(`/profile/${user.id}`)}>
      <div className='d-flex align-items-center'>
        <div className='user-list-item-avatar me-2'>
          <Image
            className='avatar-image'
            src={user?.avatar?.base64Image ??
              `https://eu.ui-avatars.com/api/?name=${user.name}+${user.surname}&size=55&background=E6E7E8&font-size=0.4&rounded=true&format=svg`}
            alt="Profile image"
            roundedCircle
          />
        </div>
        <h5 className='m-0 text-truncate'>{`${user.name} ${user.surname}`}</h5>
      </div>
      {user.eventUserRole === EventUserRole.Owner ? <FaCrown className='me-1' size="20px" color="#FFC61C" /> : null}
    </div>
  );
}

export default UserListItem;