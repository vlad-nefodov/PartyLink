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

  const styles: google.maps.MapTypeStyle[] = [
    {
      "featureType": "administrative",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#6195a0"
        }
      ]
    },
    {
      "featureType": "administrative.province",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "landscape",
      "elementType": "geometry",
      "stylers": [
        {
          "lightness": "0"
        },
        {
          "saturation": "0"
        },
        {
          "color": "#f5f5f2"
        },
        {
          "gamma": "1"
        }
      ]
    },
    {
      "featureType": "landscape.man_made",
      "elementType": "all",
      "stylers": [
        {
          "lightness": "-3"
        },
        {
          "gamma": "1.00"
        }
      ]
    },
    {
      "featureType": "landscape.natural.terrain",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#bae5ce"
        },
        {
          "visibility": "on"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "all",
      "stylers": [
        {
          "saturation": -100
        },
        {
          "lightness": 45
        },
        {
          "visibility": "simplified"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "simplified"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#fac9a9"
        },
        {
          "visibility": "simplified"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text",
      "stylers": [
        {
          "color": "#4e4e4e"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#787878"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "simplified"
        }
      ]
    },
    {
      "featureType": "transit.station.airport",
      "elementType": "labels.icon",
      "stylers": [
        {
          "hue": "#0a00ff"
        },
        {
          "saturation": "-77"
        },
        {
          "gamma": "0.57"
        },
        {
          "lightness": "0"
        }
      ]
    },
    {
      "featureType": "transit.station.rail",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#43321e"
        }
      ]
    },
    {
      "featureType": "transit.station.rail",
      "elementType": "labels.icon",
      "stylers": [
        {
          "hue": "#ff6c00"
        },
        {
          "lightness": "4"
        },
        {
          "gamma": "0.75"
        },
        {
          "saturation": "-68"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "all",
      "stylers": [
        {
          "color": "#eaf6f8"
        },
        {
          "visibility": "on"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#c7eced"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "lightness": "-49"
        },
        {
          "saturation": "-53"
        },
        {
          "gamma": "0.79"
        }
      ]
    }
  ];

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
    minZoom: 4,
    styles
  }

  return (
    <GoogleMap center={center} mapContainerClassName="map-container" options={options}>
      <MarkerF position={center} />
    </GoogleMap>
  );
}

export default MapPage;