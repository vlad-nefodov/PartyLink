import './EventMarker.scss';
import { useState } from 'react';
import { FaUserFriends } from "react-icons/fa";
import { FC } from 'react';
import { OverlayViewF } from '@react-google-maps/api';
import { IEventResponse } from '../../../../../../services/eventService/eventService';
import { useAuth } from '../../../../../../hooks/useAuth';

export interface IEventMarkerProps {
  event: IEventResponse,
  isSelected?: boolean,
  onSelect: () => void
}

const EventMarker: FC<IEventMarkerProps> = ({ event, isSelected, onSelect }) => {
  const { user } = useAuth();

  const [zIndex, setZIndex] = useState<number>(isSelected ? 1 : 0);
  const getPixelPositionOffset = (width: number, height: number) => ({
    x: -(width / 2),
    y: -height - 10
  });

  const getStyle = () => {
    if (isSelected)
      return 'event-marker-container-selected';
    else if (event.ownerUser.id === user?.id)
      return 'event-marker-container-owner';
    else if (event.usersRoles.some(ur => ur.userId === user?.id))
      return 'event-marker-container-participant';
    else
      return 'event-marker-container-view';
  }

  const onMouseEnterHandle = () => {
    setZIndex(2);
  }

  const onMouseLeaveHandle = () => {
    setZIndex(isSelected ? 1 : 0);
  }

  return (
    <OverlayViewF
      position={{
        lat: event.location.latitude,
        lng: event.location.longitude
      }}
      mapPaneName="overlayMouseTarget"
      getPixelPositionOffset={getPixelPositionOffset}
      zIndex={zIndex}
    >
      <div className={getStyle()}
        onMouseEnter={onMouseEnterHandle}
        onMouseLeave={onMouseLeaveHandle}
        onClick={onSelect}>
        <h5 className='m-0'><FaUserFriends size="20px" className='me-1' />{event.participantsCount}</h5>
      </div>
    </OverlayViewF>
  )
}

export default EventMarker;