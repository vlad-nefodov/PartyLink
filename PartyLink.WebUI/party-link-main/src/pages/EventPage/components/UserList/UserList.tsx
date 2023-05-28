import './UserList.scss';
import { FC } from 'react';
import { FaUserFriends, FaRegSadTear } from "react-icons/fa";
import { IEventUserResponse } from '../../../../services/eventService/eventService';
import UserListItem from './components/UserListItem/UserListItem';

export interface IUserListProps {
  users?: IEventUserResponse[]
}

const UserList: FC<IUserListProps> = ({ users }) => {
  return (
    <div className='d-flex flex-column user-list-container mb-1'>
      <div className="d-flex align-items-center ps-2 pe-2 mb-2">
        <FaUserFriends className="me-1" size="18px" style={{ marginTop: "2px" }} />
        <h5 className="mb-0 me-1">Participants</h5>
        <h3 className="m-0">{users?.length}</h3>
      </div>
      {
        users?.length
          ?
          <div className='pt-1 ps-2 pe-2 flex-grow-1 user-list'>
            {users.map(u => <UserListItem key={u.id} user={u} />)}
          </div>
          :
          <div className="pt-2 pb-3 d-flex justify-content-center align-items-center flex-grow-1">
            <FaRegSadTear className='me-2' size="24px" />It's empty
          </div>
      }
    </div>
  );
}

export default UserList;