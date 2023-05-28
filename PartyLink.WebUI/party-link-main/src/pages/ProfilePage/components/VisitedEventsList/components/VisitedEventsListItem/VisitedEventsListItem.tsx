import './VisitedEventsListItem.scss'
import { FC } from 'react';
import { FaCrown, FaUser } from "react-icons/fa";
import { IEventResponse } from '../../../../../../services/eventService/eventService';

export interface IVisitedEventsListItemProps {
  isOwner?: boolean,
  event: IEventResponse
}

const VisitedEventsListItem: FC<IVisitedEventsListItemProps> = ({ isOwner, event }) => {
  return (
    <div className='visited-events-list-item d-flex align-items-center justify-content-between'>
      <h5 className='m-0 text-truncate pe-2'>{event.title}</h5>
      <div className='d-flex align-items-center'>
        {isOwner ? <FaCrown size="20px" /> : <FaUser size="20px" />}
      </div>
    </div>
  );
}

export default VisitedEventsListItem;