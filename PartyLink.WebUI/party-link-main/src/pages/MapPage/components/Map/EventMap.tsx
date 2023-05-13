import './EventMap.scss';
import { FC } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { IEventResponse } from '../../../../services/eventService/eventService';
import options from './options';
import styles from './styles';
import LoadingContainer from '../../../../components/LoadingContainer/LoadingContainer';
import EventMarker from './components/EventMarker/EventMarker';

export interface IEventMapProps {
  isLoading: boolean,
  events?: IEventResponse[]
}

const EventMap: FC<IEventMapProps> = ({ isLoading, events }) => {

  if (isLoading) {
    return <LoadingContainer />;
  }

  const getAllEventMarkers = () => {
    return events?.map(e => <EventMarker key={e.id} event={e} />);
  }

  return (
    <GoogleMap mapContainerClassName='map-container' options={{ ...options, styles }}>
      {getAllEventMarkers()}
    </GoogleMap>
  );
}

export default EventMap;