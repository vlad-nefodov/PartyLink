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
    <Modal className='logout-modal' show={show} onHide={onCancel}>
      <Modal.Body>
        <Modal.Title>Do you really want to leave?</Modal.Title>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSubmit}>
          Leave
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default LogoutModal;