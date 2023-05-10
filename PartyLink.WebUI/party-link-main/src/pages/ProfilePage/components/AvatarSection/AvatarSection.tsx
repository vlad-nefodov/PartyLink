import './AvatarSection.scss'
import { FaPencilAlt } from "react-icons/fa";
import { FC, useRef, ChangeEvent } from "react";
import { Container, Image, Row, Col } from "react-bootstrap";
import { IAvatar } from '../../../../services/userService/types';

export interface IAvatarSectionProps {
  name: string,
  surname: string,
  avatar: IAvatar | null
  onSelectFile: (file: File) => void
}

const AvatarSection: FC<IAvatarSectionProps> = ({ name, surname, avatar, onSelectFile }) => {
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const uploadHandle = () => {
    avatarInputRef.current?.click();
  };

  const onSelectedFileChangeHandle = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    onSelectFile(file as File);
  }

  return (
    <Container>
      <Row>
        <Col xs="auto">
          <input ref={avatarInputRef} className="d-none" type="file" onChange={onSelectedFileChangeHandle} />
          <div className="avatar-control" onClick={uploadHandle}>
            <Image
              className='avatar-image'
              src={avatar?.base64Image ?? `https://eu.ui-avatars.com/api/?name=${name}+${surname}&size=55&background=E6E7E8&font-size=0.4&rounded=true&format=svg`}
              alt="Profile image"
              roundedCircle
            />
            <div className="avatar-overlay">
              <FaPencilAlt size="14px" className="avatar-overlay-icon" />
            </div>
          </div>
        </Col>
        <Col xs="auto" className='d-flex align-items-end justify-content-center'>
          <h3>{name + " " + surname}</h3>
        </Col>
      </Row>
      <div className='form-controls-separator' />
    </Container>
  );
}

export default AvatarSection;