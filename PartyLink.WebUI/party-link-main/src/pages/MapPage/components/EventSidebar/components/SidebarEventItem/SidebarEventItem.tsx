import './SidebarEventItem.scss';
import { FC } from 'react';
import { Card, Badge, Row, Col, Button } from 'react-bootstrap';
import { FaCalendarAlt, FaRegClock, FaPencilAlt, FaSignOutAlt } from "react-icons/fa";
import { MdOutlineMyLocation } from "react-icons/md";
import { HiPlus } from "react-icons/hi";
import { EventUserRole, IEventResponse } from "../../../../../../services/eventService/eventService";

export interface ISidebarEventItemProps {
  event: IEventResponse,
  isSelected?: boolean,
  isJoined: boolean,
  userRole: EventUserRole
  startsAt: Date,
  endsAt: Date,
  title: string,
  tags: string[],
  onJoinClick: (event: IEventResponse) => void,
  onLeaveClick: (event: IEventResponse) => void,
  onEditClick: (event: IEventResponse) => void,
  onSelect: (eventId: string) => void
}

const SidebarEventItem: FC<ISidebarEventItemProps> = (props) => {
  const getFormattedTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    if (hours >= 12) {
      return `${hours - 12}:${minutes.toString().padStart(2, '0')} PM`;
    }
    return `${hours}:${minutes.toString().padStart(2, '0')} AM`;
  }

  const getPrimaryButton = () => {
    switch (props.userRole) {
      case EventUserRole.Owner:
        return (
          <Button variant="success" className='ps-2 pe-2 d-flex align-items-center' size='sm' onClick={() => props.onEditClick(props.event)}>
            <FaPencilAlt style={{ marginRight: "6px" }} size="14px" />Edit
          </Button>
        );
      case EventUserRole.Participant:
        if (props.isJoined) {
          return (
            <Button variant="secondary" className='ps-2 pe-2 d-flex align-items-center' size='sm' onClick={() => props.onLeaveClick(props.event)}>
              <FaSignOutAlt style={{ marginRight: "5px" }} size="14px" />Leave
            </Button>
          );
        }
        else {
          return (
            <Button variant="danger" className='ps-2 pe-2 d-flex align-items-center' size='sm' onClick={() => props.onJoinClick(props.event)}>
              <HiPlus className='me-1' size="16px" />Join
            </Button>
          )
        }
    }
  }

  return (
    <Card
      className={props.isSelected ? "sidebar-event-item-selected" : "sidebar-event-item"}
      onMouseEnter={() => props.onSelect(props.event.id)}>
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
                  {getPrimaryButton()}
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <div className='d-grid'>
                  <Button variant="outline-primary" className='ps-2 pe-2 d-flex align-items-center' size='sm'>
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