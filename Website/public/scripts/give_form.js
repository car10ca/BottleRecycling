// TODO: allow to drop pin on map for better user experience
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(pos => {
    let latInput = document.getElementById("latitude");
    let lonInput = document.getElementById("longitude");
    if (latInput != null && lonInput != null) {
      latInput.value = pos.coords.latitude;
      lonInput.value = pos.coords.longitude;
    }
  })
}

