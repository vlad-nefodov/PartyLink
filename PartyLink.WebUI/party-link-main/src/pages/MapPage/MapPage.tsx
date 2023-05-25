import './MapPage.scss';
import { useState, useRef, useCallback } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { IEventLocation, IEventResponse, eventService } from '../../services/eventService/eventService';
import EventSidebar from './components/EventSidebar/EventSidebar';
import EventMap from './components/Map/EventMap';
import CreateEventModal, { ICreateData } from '../../components/CreateEventModal/CreateEventModal';
import { geocodeService } from '../../services/geocodeService/geocodeService';
import UpdateEventModal, { IUpdateData } from '../../components/UpdateEventModal/UpdateEventModal';

function MapPage() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_PUBLIC_MAP_API_KEY
  });
  const queryClient = useQueryClient();
  const { data: eventsData, isLoading: isEventsLoading } = useQuery("getAllEvents", eventService.getAll);

  const {
    mutate: eventAddressMutation,
    data: eventAddress,
    isLoading: isEventAddressLoading
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

  const {
    mutate: updateEventMutation,
    isLoading: isUpdateEventLoading
  } = useMutation("updateEvent", eventService.update, {
    onSuccess: () => queryClient.invalidateQueries('getAllEvents')
  });

  const {
    mutateAsync: joinEventMutationAsync
  } = useMutation("joinEvent", eventService.join);

  const {
    mutateAsync: leaveEventMutationAsync
  } = useMutation("leaveEvent", eventService.leave);

  const {
    mutate: deleteEventMutation,
    isLoading: isDeleteEventLoading
  } = useMutation("deleteEvent", eventService.delete, {
    onSuccess: () => queryClient.invalidateQueries('getAllEvents')
  });


  const mapRef = useRef<google.maps.Map>();

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const [mapZoom, setMapZoom] = useState<number>(6);
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>({ lat: 49.842957, lng: 24.031111 });
  const [loadingEventsIds, setLoadingEventsIds] = useState<string[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<IEventResponse>();
  const [createEventLocation, setCreateEventLocation] = useState<google.maps.LatLngLiteral>();
  const [eventToUpdate, setEventToUpdate] = useState<IEventResponse>();

  const selectEventHandle = (event: IEventResponse) => {
    setSelectedEvent(event);
  }

  const onCreateEventHandle = (location: google.maps.LatLngLiteral) => {
    setCreateEventLocation(location);
    eventAddressMutation({
      latitude: location.lat,
      longitude: location.lng
    });
  }

  const onUpdateEventHandle = (event: IEventResponse) => {
    event.startsAt = new Date(event.startsAt);
    event.endsAt = new Date(event.endsAt);
    setEventToUpdate(event);
    eventAddressMutation({
      latitude: event.location.latitude,
      longitude: event.location.longitude
    });
  }

  const onJoinEventHandle = async (event: IEventResponse) => {
    setLoadingEventsIds(cur => [...cur, event.id]);

    await joinEventMutationAsync(event.id);

    await queryClient.refetchQueries('getAllEvents');
    await queryClient.refetchQueries('getAllEvents');
    setLoadingEventsIds(cur => cur.filter(i => i !== event.id));
  }

  const onLeaveEventHandle = async (event: IEventResponse) => {
    setLoadingEventsIds(cur => [...cur, event.id]);

    leaveEventMutationAsync(event.id);

    await queryClient.refetchQueries('getAllEvents');
    await queryClient.refetchQueries('getAllEvents');
    setLoadingEventsIds(cur => cur.filter(i => i !== event.id));
  }

  const onViewEventHandle = (event: IEventResponse) => {
    if (mapRef.current) {
      mapRef.current.setZoom(12);
      mapRef.current.panTo({
        lat: event.location.latitude,
        lng: event.location.longitude
      });
    }
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

  const onUpdateEventModalUpdateHandle = (data: IUpdateData) => {
    updateEventMutation({
      id: eventToUpdate?.id as string,
      location: {
        latitude: eventToUpdate?.location.latitude as number,
        longitude: eventToUpdate?.location.longitude as number
      },
      startsAt: data.startsAt.val,
      endsAt: data.endsAt.val,
      title: data.title.val,
      description: data.description.val,
      tags: data.tags.map(t => ({ title: t.val }))
    }, {
      onSuccess: () => setEventToUpdate(undefined)
    })
  }

  const onUpdateEventModalCancelHandle = () => {
    setEventToUpdate(undefined);
  }

  const onDeleteEventModalUpdateHandle = (data: IEventResponse) => {
    deleteEventMutation(data.id, {
      onSuccess: () => setEventToUpdate(undefined)
    })
  }

  return (
    <div className="map-page-container">
      <EventSidebar
        events={eventsData}
        loadingEventsIds={loadingEventsIds}
        selectedEvent={selectedEvent}
        onEditClick={onUpdateEventHandle}
        onViewClick={onViewEventHandle}
        onJoinClick={onJoinEventHandle}
        onLeaveClick={onLeaveEventHandle}
        onSelectEvent={selectEventHandle} />
      <EventMap
        events={eventsData}
        isLoading={!isLoaded && isEventsLoading}
        center={mapCenter}
        zoom={mapZoom}
        onCreateEvent={onCreateEventHandle}
        selectedEvent={selectedEvent}
        onSelectEvent={selectEventHandle}
        onLoad={onMapLoad} />
      {
        !isEventAddressLoading ?
          <CreateEventModal
            isLoading={isCreateEventLoading}
            createEventAddress={eventAddress as string}
            show={Boolean(createEventLocation)}
            onCreate={onCreateEventModalCreateHandle}
            onCancel={onCreateEventModalCancelHandle} /> : null
      }
      {
        !isEventAddressLoading && eventToUpdate ?
          <UpdateEventModal
            event={eventToUpdate as IEventResponse}
            isLoading={isUpdateEventLoading || isDeleteEventLoading}
            eventAddress={eventAddress as string}
            show={Boolean(eventToUpdate)}
            onUpdate={onUpdateEventModalUpdateHandle}
            onDelete={onDeleteEventModalUpdateHandle}
            onCancel={onUpdateEventModalCancelHandle} /> : null
      }
    </div>
  );
}

export default MapPage;