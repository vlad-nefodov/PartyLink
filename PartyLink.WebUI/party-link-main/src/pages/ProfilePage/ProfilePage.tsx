import './ProfilePage.scss'
import { Container, Image, Row, Col } from 'react-bootstrap'
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { userService } from '../../services/userService/userService';
import { IByIdResponse } from '../../services/userService/types';
import LoadingContainer from '../../components/LoadingContainer/LoadingContainer';
import { IEventResponse, eventService } from '../../services/eventService/eventService';
import ParticipatingEventsList from './components/ParticipatingEventsList/ParticipatingEventsList';
import HostingEventsList from './components/HostingEventsList/HostingEventsList';
import VisitedEventsList from './components/VisitedEventsList/VisitedEventsList';

const ProfilePage = () => {
  const { id } = useParams();
  const {
    data: userData,
    isLoading: userDataIsLoading
  } = useQuery<IByIdResponse>(['userByIdSettingsPage', id], () => userService.getById(id as string));

  const {
    data: eventsData,
    isLoading: eventsIsLoading
  } = useQuery<IEventResponse[]>("getAllEvents", eventService.getAll);

  if (userDataIsLoading || eventsIsLoading) {
    return <LoadingContainer />
  }

  return (
    <div className='profile-page-container'>
      <div className='sandwiched-page-background' />
      <Container className='sandwiched-page'>
        <Container className='sandwiched-page-overflow-container'>
          <Container className='sandwiched-profile-page-container'>
            <Row className='align-items-center'>
              <Col xs="auto">
                <div className='profile-avatar'>
                  <Image
                    className='avatar-image'
                    src={userData?.avatar?.base64Image ??
                      `https://eu.ui-avatars.com/api/?name=${userData?.name}+${userData?.surname}&size=55&background=E6E7E8&font-size=0.4&rounded=true&format=svg`}
                    alt="Profile image"
                    roundedCircle
                  />
                </div>
              </Col>
              <Col>
                <h1 className='mb-4'>{`${userData?.name} ${userData?.surname}`}</h1>
              </Col>
            </Row>
            <Row className='justify-content-center align-items-stretch'>
              <Col className='mt-4 d-flex'>
                <div className='events-list'>
                  <ParticipatingEventsList userId={id} events={eventsData} />
                </div>
              </Col>
              <Col className='mt-4 d-flex'>
                <div className='events-list'>
                  <HostingEventsList userId={id} events={eventsData} />
                </div>
              </Col>
              <Col className='mt-4'>
                <div className='events-list'>
                  <VisitedEventsList userId={id} events={eventsData} />
                </div>
              </Col>
            </Row>
          </Container>
        </Container>
      </Container>
    </div>
  );
}

export default ProfilePage;