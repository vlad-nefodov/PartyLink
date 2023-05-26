import './EventSidebar.scss';
import { FC } from 'react';
import { FaRegSurprise } from "react-icons/fa";
import SidebarEventItem from './components/SidebarEventItem/SidebarEventItem';
import { EventUserRole, IEventResponse } from '../../../../services/eventService/eventService';
import LoadingContainer from '../../../../components/LoadingContainer/LoadingContainer';
import { useAuth } from '../../../../hooks/useAuth';
import SearchPanel, { ShowEvents } from './components/SearchPanel/SearchPanel';

export interface IEventSidebarProps {
  events?: IEventResponse[],
  loadingEventsIds: string[],
  selectedEvent?: IEventResponse,
  showEvents: ShowEvents,
  onJoinClick: (event: IEventResponse) => void,
  onLeaveClick: (event: IEventResponse) => void,
  onEditClick: (event: IEventResponse) => void,
  onViewClick: (event: IEventResponse) => void,
  onSelectEvent: (event: IEventResponse) => void
  onShowEventsChanged: (showEvents: ShowEvents) => void,
  onSearch: (input: string) => void
}

const EventSidebar: FC<IEventSidebarProps> = (props) => {
  if (!props.events) {
    return <div className='sidebar-container'><LoadingContainer /></div>
  }

  const { user } = useAuth();

  return (
    <div className="sidebar-container">
      <SearchPanel
        showEvents={props.showEvents}
        onShowEventsChanged={props.onShowEventsChanged}
        onSearch={props.onSearch} />
      <div className="event-items-container pt-3 ps-3 pe-3">
        {props.events?.length === 0 ?
          <div className="d-flex justify-content-center align-items-center h-100"><FaRegSurprise className='me-2' size="24px" />Not found events</div>
          : props.events.map(e => {
            return <div key={e.id} className='pb-3'>
              <SidebarEventItem
                isLoading={props.loadingEventsIds.includes(e.id)}
                isSelected={e.id === props.selectedEvent?.id}
                event={e}
                isJoined={e.usersRoles.some(ur => ur.userId === user?.id)}
                userRole={e.ownerUser.id === user?.id ? EventUserRole.Owner : EventUserRole.Participant}
                startsAt={new Date(e.startsAt)}
                endsAt={new Date(e.endsAt)}
                title={e.title}
                tags={e.tags.map(t => t.title)}
                onJoinClick={props.onJoinClick}
                onLeaveClick={props.onLeaveClick}
                onEditClick={props.onEditClick}
                onViewClick={props.onViewClick}
                onSelect={props.onSelectEvent}
              />
            </div>
          })
        }
      </div>
    </div>
  );
}

export default EventSidebar;