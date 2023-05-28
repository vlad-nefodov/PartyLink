import './SidebarEventItem.scss';
import { FC, useRef, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Badge, Row, Col, Button, Spinner } from 'react-bootstrap';
import { FaCalendarAlt, FaRegClock, FaPencilAlt, FaSignOutAlt } from "react-icons/fa";
import { MdOutlineMyLocation } from "react-icons/md";
import { HiPlus } from "react-icons/hi";
import { EventUserRole, IEventResponse } from "../../../../../../services/eventService/eventService";

export interface ISidebarEventItemProps {
  event: IEventResponse,
  isSelected?: boolean,
  isJoined: boolean,
  isLoading?: boolean,
  userRole: EventUserRole,
  startsAt: Date,
  endsAt: Date,
  title: string,
  tags: string[],
  onJoinClick: (event: IEventResponse) => void,
  onLeaveClick: (event: IEventResponse) => void,
  onEditClick: (event: IEventResponse) => void,
  onViewClick: (event: IEventResponse) => void,
  onSelect: (event: IEventResponse) => void
}

const SidebarEventItem: FC<ISidebarEventItemProps> = (props) => {
  const navigate = useNavigate();
  const goToEvent = () => navigate(`/event/${props.event.id}`);

  const cardRef = useRef<HTMLDivElement>();

  if (cardRef.current && props.isSelected) {
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  const getFormattedTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    if (hours >= 12) {
      return `${hours - 12}:${minutes.toString().padStart(2, '0')} PM`;
    }
    return `${hours}:${minutes.toString().padStart(2, '0')} AM`;
  }

  const onEditClickHandle = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    props.onEditClick(props.event)
  }

  const onLeaveClickHandle = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    props.onLeaveClick(props.event)
  }

  const onJoinClickHandle = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    props.onJoinClick(props.event)
  }

  const onViewClickHandle = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    props.onViewClick(props.event)
  }

  const EventButton = () => {
    if (props.isLoading) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ minWidth: 'BUTTON_WIDTH', minHeight: 'BUTTON_HEIGHT' }}>
          <Spinner animation='border' variant='secondary' />
        </div>
      );
    }

    switch (props.userRole) {
      case EventUserRole.Owner:
        return (
          <Button variant="success" className='ps-2 pe-2 d-flex align-items-center' size='sm' onClick={onEditClickHandle}>
            <FaPencilAlt style={{ marginRight: "6px" }} size="14px" />Edit
          </Button>
        );
      case EventUserRole.Participant:
        if (props.isJoined) {
          return (
            <Button variant="secondary" className='ps-2 pe-2 d-flex align-items-center' size='sm' onClick={onLeaveClickHandle}>
              <FaSignOutAlt style={{ marginRight: "5px" }} size="14px" />Leave
            </Button>
          );
        }
      default:
        return (
          <Button variant="danger" className='ps-2 pe-2 d-flex align-items-center' size='sm' onClick={onJoinClickHandle}>
            <HiPlus className='me-1' size="16px" />Join
          </Button>
        );
    }
  }

  return (
    <Card
      ref={cardRef as any}
      className={props.isSelected ? "sidebar-event-item-selected" : "sidebar-event-item"}
      onMouseEnter={() => props.onSelect(props.event)}
      onClick={goToEvent}>
      <Card.Header className='d-flex justify-content-between'>
        <Col xs="auto">
          <FaCalendarAlt size="12px" className='mb-1 me-1' />{props.startsAt.toDateString()}
        </Col>
        <Col xs="auto">
          <FaRegClock size="12px" className='mb-1 me-1' />{getFormattedTime(props.startsAt)}
        </Col>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col>
            <Card.Title className='d-flex'>
              <div className='text-wrap text-break' style={{ paddingTop: "2px" }}>{props.title}</div>
            </Card.Title>
            <div className='mb-2'>
              {props.tags.map((t, i) => <Badge key={i} bg="secondary" className='me-1'>{t}</Badge>)}
            </div>
          </Col>
          <Col xs="auto" className='d-flex flex-column justify-content-center'>
            <Row className='mb-2'>
              <Col xs={12}>
                <div className='d-grid'>
                  <EventButton />
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <div className='d-grid'>
                  <Button variant="outline-primary" className='ps-2 pe-2 d-flex align-items-center' size='sm' onClick={onViewClickHandle}>
                    <MdOutlineMyLocation className='me-1' size="16px" />View
                  </Button>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card.Body >
    </Card >
  )
}

export default SidebarEventItem;