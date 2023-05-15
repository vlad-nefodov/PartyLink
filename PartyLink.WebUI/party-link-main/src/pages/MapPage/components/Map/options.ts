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
  draggableCursor: "grab",
  draggingCursor: "grabbing",
  maxZoom: 20,
  minZoom: 4,

};

export default options;