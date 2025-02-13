let myLocMarker = new mapboxgl.Marker().setLngLat(map.getCenter()).addTo(map).setDraggable(true);

// Update form coordinates
function updateFormCoordinates(lat, lon) {
  let latInput = document.getElementById("latitude");
  let lonInput = document.getElementById("longitude");
  if (latInput != null && lonInput != null) {
    latInput.value = lat;
    lonInput.value = lon;
  }
}

// Populate form with new coordinates
myLocMarker.on("dragend", () => {
  const coords = myLocMarker.getLngLat();
  updateFormCoordinates(coords.lat, coords.lng);
});

// Functionality for geolocation button
let findButton = document.getElementById("geoloc_button");
if (findButton) {
  findButton.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        myLocMarker.setLngLat([pos.coords.longitude, pos.coords.latitude]);
        map.flyTo({center: [pos.coords.longitude, pos.coords.latitude], zoom: 16});
        updateFormCoordinates(pos.coords.latitude, pos.coords.longitude);
      })
    }
  });
}
