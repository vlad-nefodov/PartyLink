import './ParticipatingEventsList.scss';
import { FC } from 'react';
import { FaFire, FaRegSadTear } from "react-icons/fa";
import { IEventResponse } from '../../../../services/eventService/eventService';
import ParticipatingEventsListItem from './components/ParticipatingEventsListItem/ParticipatingEventsListItem';

export interface IParticipatingEventsListProps {
  userId?: string,
  events?: IEventResponse[]
}

const ParticipatingEventsList: FC<IParticipatingEventsListProps> = ({ userId, events }) => {
  const participatingEvents = events?.filter(e =>
    new Date(e.endsAt) >= new Date() &&
    e.usersRoles.map(ur => ur.userId).includes(userId as string)
  );

  return (
    <div className='d-flex flex-column h-100'>
      <div className="d-flex align-items-center">
        <FaFire className="me-1" size="16px" color="#F04D5D" />
        <h4 className="mb-0 me-2">Participating</h4>
        <h2 className="m-0">{participatingEvents?.length}</h2>
      </div>
      <div className='mt-1 mb-3 form-controls-separator' />
      {
        participatingEvents?.length
          ?
          <div className='pb-2 flex-grow-1 participating-list pe-2'>
            {participatingEvents.map(e => <ParticipatingEventsListItem key={e.id} event={e} />)}
          </div>
          :
          <div className="pt-2 pb-4 d-flex flex-grow-1 justify-content-center align-items-center">
            <FaRegSadTear className='me-2' size="24px" />It's empty
          </div>
      }
    </div>
  );
}

export default ParticipatingEventsList;