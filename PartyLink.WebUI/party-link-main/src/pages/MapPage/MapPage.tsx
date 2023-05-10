import './MapPage.scss';
import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';
import LoadingContainer from '../../components/LoadingContainer/LoadingContainer';

function MapPage() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_PUBLIC_MAP_API_KEY
  });

  if (!isLoaded) {
    return <LoadingContainer />;
  }

  const center: google.maps.LatLngLiteral = { lat: 49.842957, lng: 24.031111 };
  const options: google.maps.MapOptions = {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: true,
    restriction: {
      latLngBounds: {
        north: 85,
        south: -85,
        west: -180,
        east: 180,
      },
      strictBounds: true
    },
    zoom: 12,
    maxZoom: 20,
    minZoom: 4
  }

  return (
    <GoogleMap center={center} mapContainerClassName="map-container" options={options}>
      <MarkerF position={center} />
    </GoogleMap>
  );
}

export default MapPage;