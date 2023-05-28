import './VisitedEventsList.scss';
import { FC } from 'react';
import { FaCheck, FaRegSadTear } from "react-icons/fa";
import { IEventResponse } from '../../../../services/eventService/eventService';
import VisitedEventsListItem from './components/VisitedEventsListItem/VisitedEventsListItem';

export interface IVisitedEventsListProps {
  userId?: string,
  events?: IEventResponse[]
}

const VisitedEventsList: FC<IVisitedEventsListProps> = ({ userId, events }) => {
  const visitedEvents = events?.filter(e =>
    new Date(e.endsAt) < new Date() &&
    e.usersRoles.map(ur => ur.userId).includes(userId as string)
  );

  return (
    <div className='d-flex flex-column'>
      <div className="d-flex align-items-center">
        <FaCheck className="me-1" size="16px" color="#299663" />
        <h4 className="mb-0 me-2">Visited</h4>
        <h2 className="m-0">{visitedEvents?.length}</h2>
      </div>
      <div className='mt-1 mb-3 form-controls-separator' />
      {
        visitedEvents?.length
          ?
          <div className='pb-2 flex-grow-1 visited-list pe-2'>
            {visitedEvents.map(e => <VisitedEventsListItem key={e.id} isOwner={e.ownerUser.id === userId} event={e} />)}
          </div>
          :
          <div className="pt-2 pb-3 d-flex justify-content-center align-items-center">
            <FaRegSadTear className='me-2' size="24px" />It's empty
          </div>
      }
    </div>
  );
}

export default VisitedEventsList;