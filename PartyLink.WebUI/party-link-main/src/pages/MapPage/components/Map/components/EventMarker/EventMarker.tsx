import './EventMarker.scss';
import { FaUserFriends } from "react-icons/fa";
import { FC } from 'react';
import { OverlayViewF } from '@react-google-maps/api';
import { IEventResponse } from '../../../../../../services/eventService/eventService';

export interface IEventMarkerProps {
  event: IEventResponse
}

const EventMarker: FC<IEventMarkerProps> = ({ event }) => {
  const getPixelPositionOffset = (width: number, height: number) => ({
    x: -(width / 2),
    y: -height - 10
  });

  return (
    <OverlayViewF
      position={{
        lat: event.location.latitude,
        lng: event.location.longitude
      }}
      mapPaneName="overlayMouseTarget"
      getPixelPositionOffset={getPixelPositionOffset}
    >
      <div className='event-marker-container'>
        <h5 className='m-0'><FaUserFriends size="20px" className='me-1' />{event.participantsCount}</h5>
      </div>
    </OverlayViewF>
  )
}

export default EventMarker;