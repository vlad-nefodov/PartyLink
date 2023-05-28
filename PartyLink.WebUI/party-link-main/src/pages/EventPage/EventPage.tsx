import './EventPage.scss'
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Container, Row, Col, Button, Spinner, Badge } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { FaAlignLeft, FaCalendarAlt, FaGlobe, FaMapMarkerAlt, FaPencilAlt, FaSignOutAlt, FaTags } from "react-icons/fa";
import { HiPlus } from 'react-icons/hi';
import { EventUserRole, IEventResponse, IEventUserResponse, IFullEventResponse, eventService } from '../../services/eventService/eventService';
import { IUpdateData } from '../../components/UpdateEventModal/UpdateEventModal';
import { geocodeService } from '../../services/geocodeService/geocodeService';
import LoadingContainer from '../../components/LoadingContainer/LoadingContainer';
import UpdateEventModal from '../../components/UpdateEventModal/UpdateEventModal';
import UserList from './components/UserList/UserList';

const EventPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const {
    data: eventData,
    isLoading: eventDataIsLoading,
    isFetching: eventDataIsFetching
  } = useQuery<IFullEventResponse>("getEventById", () => eventService.getById(id as string), {
    refetchOnWindowFocus: false
  });

  const {
    data: eventAddress,
    isLoading: isEventAddressLoading
  } = useQuery(["getAddressFromLocation", eventData], () => {
    return geocodeService.getAddressFromLocation({
      latitude: eventData?.location.latitude as number,
      longitude: eventData?.location.longitude as number
    });
  });

  if (eventData) {
    eventData.startsAt = new Date(eventData.startsAt);
    eventData.endsAt = new Date(eventData.endsAt);
  }

  const {
    mutate: updateEventMutation,
    isLoading: isUpdateEventLoading
  } = useMutation("updateEvent", eventService.update, {
    onSuccess: () => queryClient.invalidateQueries('getEventById')
  });

  const {
    mutate: joinEventMutation,
    isLoading: joinEventIsLoading
  } = useMutation("joinEvent", eventService.join);

  const {
    mutate: leaveEventMutation,
    isLoading: leaveEventIsLoading
  } = useMutation("leaveEvent", eventService.leave);

  const {
    mutate: deleteEventMutation,
    isLoading: isDeleteEventLoading
  } = useMutation("deleteEvent", eventService.delete, {
    onSuccess: () => navigate("/")
  });

  if (eventDataIsLoading || isEventAddressLoading) {
    return <LoadingContainer />
  }

  const showSuccess = (message: string) => {
    toast.success(message);
  }

  const onUpdateEventModalUpdateHandle = (data: IUpdateData) => {
    updateEventMutation({
      id: eventData?.id as string,
      location: {
        latitude: eventData?.location.latitude as number,
        longitude: eventData?.location.longitude as number
      },
      startsAt: data.startsAt.val,
      endsAt: data.endsAt.val,
      title: data.title.val,
      description: data.description.val,
      tags: data.tags.map(t => ({ title: t.val }))
    }, {
      onSuccess: () => {
        queryClient.refetchQueries('getAllEvents');
        setIsEdit(false);
        showSuccess(`${data.title.val} was updated!`);
      }
    })
  }

  const onDeleteEventModalUpdateHandle = (data: IEventResponse) => {
    deleteEventMutation(data.id);
  }

  const onUpdateEventModalCancelHandle = () => {
    setIsEdit(false);
  }

  const onEditClickHandle = () => {
    if (eventData) {
      eventData.startsAt = new Date(eventData.startsAt);
      eventData.endsAt = new Date(eventData.endsAt);
      setIsEdit(true);
    }
  }

  const onJoinClickHandle = () => {
    if (eventData) {
      joinEventMutation(eventData.id, {
        onSuccess: () => {
          queryClient.invalidateQueries('getEventById');
          queryClient.invalidateQueries('getAllEvents');
          showSuccess(`Joined ${eventData.title}`);
        }
      });
    }
  }

  const onLeaveClickHandle = () => {
    if (eventData) {
      leaveEventMutation(eventData.id, {
        onSuccess: () => {
          queryClient.invalidateQueries('getEventById');
          queryClient.invalidateQueries('getAllEvents');
          showSuccess(`Left ${eventData.title}`);
        }
      });
    }
  }

  const EventButton = () => {
    if (joinEventIsLoading || leaveEventIsLoading || eventDataIsFetching) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ width: "75px" }}>
          <Spinner animation='border' variant='secondary' />
        </div>
      );
    }

    const eventUser = eventData?.participants.find(eu => eu.id === user?.id);

    switch (eventUser?.eventUserRole) {
      case EventUserRole.Owner:
        return (
          <Button variant="success" className='ps-2 pe-3 d-flex align-items-center' onClick={onEditClickHandle}>
            <FaPencilAlt style={{ marginRight: "6px" }} size="14px" />Edit
          </Button>
        );
      case EventUserRole.Participant:
        return (
          <Button variant="secondary" className='ps-2 pe-2 d-flex align-items-center' onClick={onLeaveClickHandle}>
            <FaSignOutAlt style={{ marginRight: "5px" }} size="14px" />Leave
          </Button>
        );
      default:
        return (
          <Button variant="danger" className='ps-2 pe-3 d-flex align-items-center' onClick={onJoinClickHandle}>
            <HiPlus className='me-1' size="16px" />Join
          </Button>
        );
    }
  }

  const getDateTime = (date: Date) => {
    let dateTime = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}, `;
    const minutes = date.getMinutes();
    const hours = date.getHours();

    dateTime += hours >= 12
      ? `${hours - 12}:${minutes.toString().padStart(2, '0')} PM`
      : `${hours}:${minutes.toString().padStart(2, '0')} AM`;

    return dateTime;
  }

  return (
    <div className='event-page-container'>
      <div className='sandwiched-page-background' />
      <Container className='sandwiched-page'>
        <Container className='sandwiched-page-overflow-container'>
          <Container className='sandwiched-event-page-container'>
            <Row className='align-items-center mb-2'>
              <Col xs="auto">
                <div className='d-flex align-items-center'>
                  <FaGlobe className='mt-1 me-2' size="24px" />
                  <h1 className='m-0'>{eventData?.title}</h1>
                </div>
              </Col>
              <Col xs="auto">
                <div className='mt-2'>
                  <EventButton />
                </div>
              </Col>
            </Row>
            <Row className='justify-content-start'>
              <Col className='mt-4' xs={12} md={8}>
                <Row className='event-page-section'>
                  <Col className='mb-3' xs={12}>
                    <h5 className='m-1'><FaCalendarAlt size="14px" className='mb-1 me-1' />Starts at</h5>
                    <div className='m-0 ps-2'>{getDateTime(eventData?.startsAt as Date)}</div>
                  </Col>
                  <Col className='mb-3' xs={12}>
                    <h5 className='m-1'><FaCalendarAlt size="14px" className='mb-1 me-1' />Ends at</h5>
                    <div className='m-0 ps-2'>{getDateTime(eventData?.endsAt as Date)}</div>
                  </Col>
                  <Col className='mb-2' xs={12}>
                    <h5 className='m-1'><FaMapMarkerAlt size="14px" className='mb-1 me-1' />Address</h5>
                    <div className='m-0 ps-2'>{eventAddress}</div>
                  </Col>
                  <Col className='mb-3' xs={12}>
                    <h5 className='m-2'><FaTags size="14px" className='mb-1 me-1' />Tags</h5>
                    <div className='m-0 ps-2'>{eventData?.tags.map((t, i) => <Badge key={i} bg="secondary" className='me-1'>{t.title}</Badge>)}</div>
                  </Col>
                  <Col xs={12}>
                    <h5 className='m-1'><FaAlignLeft size="14px" className='mb-1 me-1' />Description</h5>
                    <div className='m-0 ps-2 text-break'>{eventData?.description}</div>
                  </Col>
                </Row>
              </Col>
              <Col className='mt-4' xs={12} md={4}>
                <div className='event-page-section'>
                  <UserList users={eventData?.participants} />
                </div>
              </Col>
            </Row>
          </Container>
        </Container>
      </Container>
      {
        !isEventAddressLoading && !eventDataIsLoading && isEdit ?
          <UpdateEventModal
            event={eventData as any}
            isLoading={isUpdateEventLoading || isDeleteEventLoading}
            eventAddress={eventAddress as string}
            show={isEdit}
            onUpdate={onUpdateEventModalUpdateHandle}
            onDelete={onDeleteEventModalUpdateHandle}
            onCancel={onUpdateEventModalCancelHandle} /> : null
      }
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme='colored'
      />
    </div>
  );
}

export default EventPage;