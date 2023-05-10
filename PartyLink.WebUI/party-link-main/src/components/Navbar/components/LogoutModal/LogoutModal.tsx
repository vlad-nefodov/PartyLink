import './LogoutModal.scss';
import { FC } from 'react';
import { Modal, Button } from "react-bootstrap";

export interface ILogoutModalProps {
  show: boolean,
  onCancel: () => void,
  onSubmit: () => void
}

const LogoutModal: FC<ILogoutModalProps> = ({ show, onCancel, onSubmit }) => {
  return (
    <Modal className='logout-modal' size='sm' show={show} onHide={onCancel}>
      <Modal.Body>
        Do you really want to leave?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" size='sm' onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" size='sm' onClick={onSubmit}>
          Leave
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default LogoutModal;