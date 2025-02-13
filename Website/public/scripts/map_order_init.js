
let myLocMarker = new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map);
map.flyTo({center: [longitude, latitude], zoom: 16});

