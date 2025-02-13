let markers = [];

let hostPrefix = `${window.location.protocol}//${window.location.host}`

function fillResults(result) {
  let divEl = document.getElementById("collect-results");
  if (!divEl)
    return;

  while (divEl.hasChildNodes())
    divEl.removeChild(divEl.firstChild);
  for (let res of result) {
    let orderId = res.orderid;
    fetch(`${hostPrefix}/get_order_by_id`, 
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({orderid: orderId})
      })
    .then(response => response.json())
    .then(result => {
      const row = document.createElement("div");
      row.setAttribute("class", "row");
      {
        const name = document.createElement("h2");
        name.innerHTML = result.User_Name;
        row.appendChild(name);

        const collection = document.createElement("p");
        collection.innerHTML = `<b>Collection:</b> ${result.Day}: ${result.Time_Slot}`;
        row.appendChild(collection);

        const numBottles = document.createElement("p");
        numBottles.innerHTML = `<b># Bottles:</b> ${result.Bottles_25 + result.Bottles_15}`;
        row.appendChild(numBottles);

        const totalValue = document.createElement("p");
        totalValue.innerHTML = `<b>Total value:</b> ${result.Bottles_25 * 0.25 + result.Bottles_15 * 0.15}`;
        row.appendChild(totalValue);

        {
          const detailsForm = document.createElement("form");
          detailsForm.setAttribute("action", "order_details");
          detailsForm.setAttribute("method", "GET");

          detailsForm.innerHTML = `<input type="hidden" name="orderid" value="${orderId}"><input type="submit" value="See Details">`;
          row.appendChild(detailsForm);
        }
      }
      divEl.appendChild(row);
    });
  }
}

// Geolocation documentation snippet from https://www.w3schools.com/js/js_api_geolocation.asp
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(pos => {
    // Original fetch example from https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    fetch(`${hostPrefix}/find_orders_for_collection`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({latitude: pos.coords.latitude, longitude: pos.coords.longitude, dist: 1200})
      }) // TODO: change to proper domain name instead of hardcoded localhost one
      .then(response => response.json())
      .then(result => {
        let maxDist = 0;
        for (let m of result) {
          const marker = new mapboxgl.Marker().setLngLat([m.longitude, m.latitude]).addTo(map);
          markers.push(marker);
          if (m.dist > maxDist)
            maxDist = m.dist;
        }
        // zoomlevel is meters/pixels
        // Zoom values are calculated from baseline values from
        // this documentation page: https://docs.mapbox.com/help/glossary/zoom-level/
        // maxDist is multiplied by 2 because we need half of the canvas
        // 0.5 is subtracted, so we'll not clamp these markers on borders.
        let horzZoom = Math.log2(60000 * 800 / (maxDist * 2.0)) - 0.5;
        let vertZoom = Math.log2(60000 * 600 / (maxDist * 2.0)) - 0.5;
        let zoomLevel = Math.min(Math.max(Math.min(horzZoom, vertZoom), 1), 15);
        map.flyTo({center: [pos.coords.longitude, pos.coords.latitude], zoom: zoomLevel});
        fillResults(result);
      });
  });
}

// update map contents on the move end
map.on('moveend', () => {
  let bounds = map.getBounds();
  let ne = bounds.getNorthEast();
  let sw = bounds.getSouthWest();
  fetch(`${hostPrefix}/find_orders_for_collection_bounds`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ne: {lat: ne.lat, lng: ne.lng}, sw: {lat: sw.lat, lng: sw.lng}})
    })
  .then(response => response.json())
  .then(result => {
    for (let marker of markers)
      marker.remove();
    markers.splice(0, markers.length); // empty the array
    for (let m of result) {
      const marker = new mapboxgl.Marker().setLngLat([m.longitude, m.latitude]).addTo(map);
      markers.push(marker);
    }
    fillResults(result);
  });
});

