import './LoadingContainer.scss';
import { Container, Spinner } from "react-bootstrap";

const LoadingContainer = () => {
  return (
    <Container className='d-flex align-items-center justify-content-center loading-container' fluid>
      <Spinner className='loading-container-spinner' variant='primary' animation='border' />
    </Container>
  );
}

export default LoadingContainer;