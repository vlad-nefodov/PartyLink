import './MapPage.scss';
import { useLoadScript } from '@react-google-maps/api';
import { useQuery } from 'react-query';
import { IEventResponse, eventService } from '../../services/eventService/eventService';
import EventSidebar from './components/EventSidebar/EventSidebar';
import EventMap from './components/Map/EventMap';

function MapPage() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_PUBLIC_MAP_API_KEY
  });

  const { data: eventsData, isLoading: isEventsLoading } = useQuery("getAllEvents", eventService.getAll);

  return (
    <div className="map-page-container">
      <EventSidebar />
      <EventMap events={eventsData} isLoading={!isLoaded && isEventsLoading} />
    </div>
  );
}

export default MapPage;