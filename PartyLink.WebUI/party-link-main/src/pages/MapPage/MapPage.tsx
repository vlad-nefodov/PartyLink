import './MapPage.scss';
import { useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { IEventLocation, eventService } from '../../services/eventService/eventService';
import EventSidebar from './components/EventSidebar/EventSidebar';
import EventMap from './components/Map/EventMap';
import CreateEventModal, { ICreateData } from './components/CreateEventModal/CreateEventModal';
import { geocodeService } from '../../services/geocodeService/geocodeService';

function MapPage() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_PUBLIC_MAP_API_KEY
  });
  const queryClient = useQueryClient();
  const { data: eventsData, isLoading: isEventsLoading } = useQuery("getAllEvents", eventService.getAll);

  const {
    mutate: createEventAddressMutation,
    data: createEventAddress,
    isLoading: isCreateEventAddressLoading
  } = useMutation("getAddressFromLocation",
    async (location: IEventLocation) => {
      return await geocodeService.getAddressFromLocation(location);
    });

  const {
    mutate: createEventMutation,
    isLoading: isCreateEventLoading
  } = useMutation("createEvent", eventService.create, {
    onSuccess: () => queryClient.invalidateQueries('getAllEvents')
  });


  const [mapZoom, setMapZoom] = useState<number>(6);
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>({ lat: 49.842957, lng: 24.031111 });
  const [selectedEventId, setSelectedEventId] = useState<string>();
  const [createEventLocation, setCreateEventLocation] = useState<google.maps.LatLngLiteral>();

  const selectEventHandle = (id: string) => {
    setSelectedEventId(id);
  }

  const onCreateEventHandle = (location: google.maps.LatLngLiteral) => {
    setCreateEventLocation(location);
    createEventAddressMutation({
      latitude: location.lat,
      longitude: location.lng
    });
  }

  const onCreateEventModalCreateHandle = (data: ICreateData) => {
    createEventMutation({
      location: {
        latitude: createEventLocation?.lat as number,
        longitude: createEventLocation?.lng as number
      },
      startsAt: data.startsAt.val,
      endsAt: data.endsAt.val,
      title: data.title.val,
      description: data.description.val,
      tags: data.tags.map(t => ({ title: t.val }))
    }, {
      onSuccess: () => setCreateEventLocation(undefined)
    })
  }

  const onCreateEventModalCancelHandle = () => {
    setCreateEventLocation(undefined);
  }


  return (
    <div className="map-page-container">
      <EventSidebar />
      <EventMap
        events={eventsData}
        isLoading={!isLoaded && isEventsLoading}
        center={mapCenter}
        zoom={mapZoom}
        onCreateEvent={onCreateEventHandle}
        selectedEventId={selectedEventId}
        onSelectEvent={selectEventHandle} />
      {
        !isCreateEventAddressLoading ?
          <CreateEventModal
            isLoading={isCreateEventAddressLoading || isCreateEventLoading}
            createEventAddress={createEventAddress as string}
            show={Boolean(createEventLocation)}
            onCreate={onCreateEventModalCreateHandle}
            onCancel={onCreateEventModalCancelHandle} /> : null
      }
    </div>
  );
}

export default MapPage;