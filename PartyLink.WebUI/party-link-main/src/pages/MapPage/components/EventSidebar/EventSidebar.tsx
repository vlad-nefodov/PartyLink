import './EventSidebar.scss';
import { FC } from 'react';
import { Container } from "react-bootstrap";
import SidebarEventItem from './components/SidebarEventItem/SidebarEventItem';
import { EventUserRole, IEventResponse } from '../../../../services/eventService/eventService';
import LoadingContainer from '../../../../components/LoadingContainer/LoadingContainer';
import { useAuth } from '../../../../hooks/useAuth';

export interface IEventSidebarProps {
  events?: IEventResponse[],
  loadingEventsIds: string[],
  selectedEvent?: IEventResponse,
  onJoinClick: (event: IEventResponse) => void,
  onLeaveClick: (event: IEventResponse) => void,
  onEditClick: (event: IEventResponse) => void,
  onViewClick: (event: IEventResponse) => void,
  onSelectEvent: (event: IEventResponse) => void
}

const EventSidebar: FC<IEventSidebarProps> = ({ events, loadingEventsIds, selectedEvent, onJoinClick, onLeaveClick, onEditClick, onViewClick, onSelectEvent }) => {
  if (!events) {
    return <div className='sidebar-container'><LoadingContainer /></div>
  }

  const { user } = useAuth();

  return (
    <Container className="sidebar-container pt-3 ps-3 pe-3">
      {events.map(e => {
        return <div key={e.id} className='pb-3'>
          <SidebarEventItem
            isLoading={loadingEventsIds.includes(e.id)}
            isSelected={e.id === selectedEvent?.id}
            event={e}
            isJoined={e.usersRoles.some(ur => ur.userId === user?.id)}
            userRole={e.ownerUser.id === user?.id ? EventUserRole.Owner : EventUserRole.Participant}
            startsAt={new Date(e.startsAt)}
            endsAt={new Date(e.endsAt)}
            title={e.title}
            tags={e.tags.map(t => t.title)}
            onJoinClick={onJoinClick}
            onLeaveClick={onLeaveClick}
            onEditClick={onEditClick}
            onViewClick={onViewClick}
            onSelect={onSelectEvent}
          />
        </div>
      })}
    </Container>
  );
}

export default EventSidebar;