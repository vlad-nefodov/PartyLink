const options: google.maps.MapOptions = {
  mapTypeId: "roadmap",
  disableDefaultUI: true,
  zoomControl: true,
  restriction: {
    latLngBounds: {
      north: 85,
      south: -85,
      west: -180,
      east: 180,
    },
    strictBounds: true
  },
  zoom: 6,
  maxZoom: 20,
  minZoom: 4,
  center: { lat: 49.842957, lng: 24.031111 }
};

export default options;