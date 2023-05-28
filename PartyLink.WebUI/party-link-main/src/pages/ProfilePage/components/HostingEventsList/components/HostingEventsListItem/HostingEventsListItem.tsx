import './HostingEventsListItem.scss'
import { FC } from 'react';
import { FaUserFriends } from "react-icons/fa";
import { IEventResponse } from '../../../../../../services/eventService/eventService';
import { useNavigate } from 'react-router-dom';

export interface IHostingEventsListItemProps {
  event: IEventResponse
}

const HostingEventsListItem: FC<IHostingEventsListItemProps> = ({ event }) => {
  const navigate = useNavigate();
  return (
    <div className='hosting-events-list-item d-flex align-items-center justify-content-between' onClick={() => navigate(`/event/${event.id}`)}>
      <h5 className='m-0 text-truncate'>{event.title}</h5>
      <div className='d-flex justify-content-center align-items-center'>
        <FaUserFriends className='me-1 mt-1' size="20px" />
        <h6 className='m-0'>{event.participantsCount}</h6>
      </div>
    </div>
  );
}

export default HostingEventsListItem;