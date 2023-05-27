import './HostingEventsList.scss';
import { FC } from 'react';
import { FaCrown, FaRegSadTear } from "react-icons/fa";
import { IEventResponse } from '../../../../services/eventService/eventService';
import HostingEventsListItem from './components/HostingEventsListItem/HostingEventsListItem';

export interface IHostingEventsListProps {
  userId?: string,
  events?: IEventResponse[]
}

const HostingEventsList: FC<IHostingEventsListProps> = ({ userId, events }) => {
  const hostingEvents = events?.filter(e =>
    new Date(e.endsAt) >= new Date() &&
    e.ownerUser.id === userId
  );

  return (
    <div className='d-flex flex-column'>
      <div className="d-flex align-items-center">
        <FaCrown className="me-1" size="16px" color="#FFC61C" />
        <h4 className="mb-0 me-2">Hosting</h4>
        <h2 className="m-0">{hostingEvents?.length}</h2>
      </div>
      <div className='mt-1 mb-3 form-controls-separator' />
      {
        hostingEvents?.length
          ?
          <div className='pb-2 flex-grow-1 hosting-list pe-2'>
            {hostingEvents.map(e => <HostingEventsListItem event={e} />)}
          </div>
          :
          <div className="pt-2 pb-3 d-flex justify-content-center align-items-center">
            <FaRegSadTear className='me-2' size="24px" />It's empty
          </div>
      }
    </div>
  );
}

export default HostingEventsList;