let map;
let markers = [];
let startLocation, destinationLocation;
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 43.6532, lng: -79.3832 }, // Default to Toronto, ON
      zoom: 10,
    });
  
    // Add click event listener on map
    map.addListener("click", (event) => {
      if (!startLocation) {
        // Set start location on first click
        startLocation = event.latLng;
        addMarker(startLocation, "Start Location");
        document.getElementById("start-location").textContent = startLocation;
      } else if (!destinationLocation) {
        // Set destination on second click
        destinationLocation = event.latLng;
        addMarker(destinationLocation, "Destination Location");
        document.getElementById("destination-location").textContent = destinationLocation;
      }
    });
  }

  function addMarker(location, title) {
    const marker = new google.maps.Marker({
      position: location,
      map: map,
      title: title,
    });
    markers.push(marker);
  }


  