import './EventMap.scss';
import { FC, MouseEvent } from 'react';
import { IoMdAddCircle } from "react-icons/io";
import { GoogleMap, OverlayViewF } from '@react-google-maps/api';
import { IEventResponse } from '../../../../services/eventService/eventService';
import { useState } from 'react';
import options from './options';
import styles from './styles';
import LoadingContainer from '../../../../components/LoadingContainer/LoadingContainer';
import EventMarker from './components/EventMarker/EventMarker';


export interface IEventMapProps {
  isLoading: boolean,
  center: google.maps.LatLngLiteral,
  zoom: number,
  events?: IEventResponse[],
  selectedEvent?: IEventResponse,
  onCreateEvent: (location: google.maps.LatLngLiteral) => void,
  onSelectEvent: (id: IEventResponse) => void,
  onLoad?: (map: google.maps.Map) => void | Promise<void>
}

const EventMap: FC<IEventMapProps> = ({ isLoading, center, zoom, events, selectedEvent, onCreateEvent, onSelectEvent, onLoad }) => {
  if (isLoading) {
    return <LoadingContainer />;
  }
  const [createEventLocation, setCreateEventLocation] = useState<google.maps.LatLngLiteral | null>(null);

  const getAllEventMarkers = () => {
    return events?.map(e => {
      if (e.id === selectedEvent?.id) {
        return <EventMarker key={e.id} event={e} onSelect={() => onSelectEvent(e)} isSelected />
      }

      return <EventMarker key={e.id} event={e} onSelect={() => onSelectEvent(e)} />
    });
  }

  const onClickHandle = (e: google.maps.MapMouseEvent) => {
    e.domEvent.preventDefault();
    e.domEvent.stopPropagation();
    setCreateEventLocation(null);
  }

  const onRightClickHandle = (e: google.maps.MapMouseEvent) => {
    e.domEvent.preventDefault();
    e.domEvent.stopPropagation();
    setCreateEventLocation(e.latLng?.toJSON() as google.maps.LatLngLiteral);
  }

  const onCreateEventHandler = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCreateEvent(createEventLocation as google.maps.LatLngLiteral);
    setCreateEventLocation(null);
  }

  const getPixelPositionOffset = (width: number, height: number) => ({
    x: -(width / 2),
    y: -height - 10
  });

  return (
    <GoogleMap
      mapContainerClassName='map-container'
      center={center}
      zoom={zoom}
      options={{ ...options, styles }}
      onClick={onClickHandle}
      onRightClick={onRightClickHandle}
      onLoad={onLoad}
    >
      {getAllEventMarkers()}
      {!createEventLocation ? null :
        <OverlayViewF
          position={createEventLocation}
          mapPaneName="overlayMouseTarget"
          getPixelPositionOffset={getPixelPositionOffset}
          zIndex={3}
        >
          <div className='create-event-marker-container' onClick={onCreateEventHandler}>
            <h6 className='m-0'><IoMdAddCircle size="18px" className='me-1 mb-1' />Create event</h6>
          </div>
        </OverlayViewF>
      }
    </GoogleMap>
  );
}

export default EventMap;