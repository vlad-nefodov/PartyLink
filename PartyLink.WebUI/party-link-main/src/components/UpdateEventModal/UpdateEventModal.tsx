import './UpdateEventModal.scss';
import { FC, useState, ChangeEvent } from 'react';
import { FaFire, FaMapMarkerAlt, FaTags, FaCalendarAlt, FaAlignLeft, FaGlobe, FaPencilAlt, FaArrowRight } from "react-icons/fa";
import { Modal, Button, Container, Row, Col, FormControl, FormGroup, FormLabel } from "react-bootstrap";
import { DatePicker, Multiselect } from 'react-widgets/cjs';
import LoadingContainer from '../LoadingContainer/LoadingContainer';
import { IEventResponse } from '../../services/eventService/eventService';

export interface IDataInput {
  val: string,
  error?: string
}

export interface IDateDataInput {
  val: Date,
  error?: string
}

export interface IUpdateData {
  startsAt: IDateDataInput,
  endsAt: IDateDataInput,
  address: IDataInput,
  title: IDataInput,
  description: IDataInput,
  tags: IDataInput[]
}

export interface IUpdateEventModalProps {
  event: IEventResponse
  isLoading: boolean,
  show: boolean,
  eventAddress: string,
  onCancel: () => void,
  onUpdate: (data: IUpdateData) => void,
  onDelete: (data: IEventResponse) => void
}

const UpdateEventModal: FC<IUpdateEventModalProps> = (props) => {
  const minEventTime = 35;
  const currentDate = new Date();
  const minStartsTime = new Date(currentDate.getTime() + 10 * 60000);
  const minOffsetEventTime = new Date(currentDate.getTime() + (10 + minEventTime) * 60000);

  const tagsTiles = props.event.tags.map(t => t.title);
  const defaultTags = ["Drinks", "Music", "Sport", "Pets", "Outdoors"];

  const startsAt = props.event.startsAt.getTime() < currentDate.getTime() ?
    minStartsTime :
    props.event.startsAt;

  const endsAt = props.event.endsAt.getTime() < startsAt.getTime() + minEventTime * 60000 ?
    minOffsetEventTime :
    props.event.endsAt;

  const [data, setData] = useState<IUpdateData>({
    startsAt: { val: startsAt },
    endsAt: { val: endsAt },
    address: { val: props.eventAddress },
    title: { val: props.event.title },
    description: { val: props.event.description },
    tags: tagsTiles.map(t => ({ val: t }))
  });

  const onStartsAtChangeHandle = (date: Date | null | undefined) => {
    setData(cur => ({
      ...cur,
      startsAt: { val: date as Date },
      endsAt: { val: new Date(date?.getTime() as number + minEventTime * 60000) },
    }));
  }
  const onEndsAtChangeHandle = (date: Date | null | undefined) => {
    setData(cur => ({ ...cur, endsAt: { val: date as Date } }));
  }
  const onTitleChangeHandle = (e: ChangeEvent<HTMLInputElement>) => {
    setData(cur => ({ ...cur, title: { val: e.target.value } }));
  }
  const onAddressChangeHandle = (e: ChangeEvent<HTMLInputElement>) => {
    setData(cur => ({ ...cur, address: { val: e.target.value } }));
  }
  const onDescriptionChangeHandle = (e: ChangeEvent<HTMLInputElement>) => {
    setData(cur => ({ ...cur, description: { val: e.target.value } }));
  }
  const onTagsChangeHandle = (items: string[]) => {
    const tags: IDataInput[] = items.map(i => ({ val: i }));
    setData(cur => ({ ...cur, tags }));
  }
  const onTagCreateHandle = (value: string) => {
    setData(cur => ({ ...cur, tags: [...cur.tags, { val: value }] }));
  }

  const onUpdateHandle = () => {
    props.onUpdate(data);
  }

  return (
    <Modal className='event-update-modal' show={props.show} onHide={props.onCancel}>
      <Modal.Header>
        <Modal.Title className='ms-3'><FaFire size="20px" className='me-2 mb-2' />Edit event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.isLoading ? <div className='pt-5'><LoadingContainer /></div> :
          <Container className='ps-4 pe-4 pt-2'>
            <Row className='mb-3'>
              <Col md={6}>
                <FormGroup>
                  <FormLabel><FaCalendarAlt size="12px" className='mb-1 me-1' />Starts at</FormLabel>
                  <DatePicker
                    selectIcon={<FaPencilAlt size="12px" />}
                    messages={{
                      dateButton: "",
                      moveBack: "",
                      moveForward: ""
                    }}
                    timeInputProps={{
                      noClearButton: true
                    }}
                    includeTime
                    min={minStartsTime}
                    value={data.startsAt.val}
                    onChange={onStartsAtChangeHandle}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <FormLabel><FaCalendarAlt size="12px" className='mb-1 me-1' />Ends at</FormLabel>
                  <DatePicker
                    selectIcon={<FaPencilAlt size="12px" />}
                    messages={{
                      dateButton: "",
                      moveBack: "",
                      moveForward: ""
                    }}
                    timeInputProps={{
                      noClearButton: true
                    }}
                    includeTime
                    min={minOffsetEventTime}
                    value={data.endsAt.val}
                    onChange={onEndsAtChangeHandle}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row className='mb-3' hidden={!Boolean(data.address.val)}>
              <Col md={12}>
                <FormGroup>
                  <FormLabel><FaMapMarkerAlt size="12px" className='mb-1 me-1' />Address</FormLabel>
                  <FormControl
                    readOnly
                    placeholder=''
                    defaultValue={data.address.val}
                    onChange={onAddressChangeHandle}
                  />
                  <FormControl.Feedback type='invalid'>{data.address.error}</FormControl.Feedback>
                </FormGroup>
              </Col>
            </Row>
            <Row className='mb-3'>
              <Col md={12}>
                <FormGroup>
                  <FormLabel><FaGlobe size="12px" className='mb-1 me-1' />Title</FormLabel>
                  <FormControl
                    type="text"
                    placeholder='Enter title...'
                    value={data.title.val}
                    isInvalid={Boolean(data.title.error)}
                    maxLength={80}
                    onChange={onTitleChangeHandle}
                  />
                  <FormControl.Feedback type='invalid'>{data.title.error}</FormControl.Feedback>
                </FormGroup>
              </Col>
            </Row>
            <Row className='mb-3'>
              <Col md={12}>
                <FormGroup>
                  <FormLabel><FaTags size="12px" className='me-1' />Tags</FormLabel>
                  <Multiselect
                    placeholder='Add tags...'
                    allowCreate="onFilter"
                    messages={{
                      emptyList: () => <>Entering...</>,
                      emptyFilter: () => <>Entering...</>,
                      createOption: (_, searchTerm) => <div className='pt-2 pb-2'><FaArrowRight className='me-3' />{searchTerm}</div>,
                    }}
                    value={data.tags.map(t => t.val)}
                    data={defaultTags}
                    onChange={onTagsChangeHandle}
                    onCreate={onTagCreateHandle}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row className='mb-3'>
              <Col md={12}>
                <FormGroup>
                  <FormLabel><FaAlignLeft size="12px" className='mb-1 me-1' />Description</FormLabel>
                  <FormControl
                    as="textarea"
                    placeholder='Describe your event...'
                    type="text"
                    value={data.description.val}
                    isInvalid={Boolean(data.description.error)}
                    maxLength={200}
                    onChange={onDescriptionChangeHandle}
                  />
                  <FormControl.Feedback type='invalid'>{data.description.error}</FormControl.Feedback>
                </FormGroup>
              </Col>
            </Row>
          </Container >
        }
      </Modal.Body>
      <Modal.Footer className="d-flex">
        <Button variant="outline-danger" className='ps-3 pe-3' size='sm' disabled={props.isLoading} onClick={() => props.onDelete(props.event)}>
          Delete
        </Button>
        <div className="ms-auto">
          <Button variant="outline-secondary" className='ps-3 pe-3 me-2' size='sm' disabled={props.isLoading} onClick={props.onCancel}>
            Cancel
          </Button>
          <Button variant="success" className='ps-3 pe-3' size='sm' disabled={props.isLoading} onClick={onUpdateHandle}>
            Update
          </Button>
        </div>
      </Modal.Footer>
    </Modal >
  );
}

export default UpdateEventModal;