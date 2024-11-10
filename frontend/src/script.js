const apiUrl = "http://localhost:4000";
let map;
let markers = [];
let startLocation, destinationLocation;
let directionsService, directionsRenderer;
let startAutocomplete, destinationAutocomplete;

// Initialize the Google Map
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 43.6532, lng: -79.3832 }, // Default to Toronto, ON
    zoom: 10,
  });

  // Initialize Directions service and renderer
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    polylineOptions: {
      strokeColor: "#00FF00", // Change the line color to green
      strokeWeight: 3,        // Line thickness
    },
  });

  directionsRenderer.setMap(map); // Attach the renderer to the map

  // Initialize Autocomplete for input fields
  startAutocomplete = new google.maps.places.Autocomplete(document.getElementById("startAutocomplete"));
  destinationAutocomplete = new google.maps.places.Autocomplete(document.getElementById("destinationAutocomplete"));

  // Add listener to handle place selection for start location
  startAutocomplete.addListener('place_changed', () => {
    const place = startAutocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) {
      alert("No details available for input: '" + place.name + "'");
      return;
    }

    // Set start location and update map
    startLocation = place.geometry.location;
    map.panTo(startLocation);
    addMarker(startLocation, "Start Location");
    document.getElementById("start-location").textContent = startLocation;
  });

  // Add listener to handle place selection for destination location
  destinationAutocomplete.addListener('place_changed', () => {
    const place = destinationAutocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) {
      alert("No details available for input: '" + place.name + "'");
      return;
    }

    // Set destination location and update map
    destinationLocation = place.geometry.location;
    map.panTo(destinationLocation);
    addMarker(destinationLocation, "Destination Location");
    document.getElementById("destination-location").textContent = destinationLocation;
    
    // Draw the route (green line) if both start and destination locations are set
    if (startLocation && destinationLocation) {
      calculateRoute();
    }
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
      
      // Draw the route (green line) between start and destination
      calculateRoute();
    }
  });
}

// Add marker to map
function addMarker(location, title) {
  const marker = new google.maps.Marker({
    position: location,
    map: map,
    title: title,
  });
  markers.push(marker);
}

// Calculate the route (way) between the start and destination
function calculateRoute() {
  if (!startLocation || !destinationLocation) {
    alert("Please select both a start and destination location on the map.");
    return;
  }

  const request = {
    origin: startLocation,
    destination: destinationLocation,
    travelMode: google.maps.TravelMode.DRIVING, // or you can choose other modes like WALKING, BICYCLING, or TRANSIT
  };

  directionsService.route(request, (result, status) => {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsRenderer.setDirections(result); // Show the route on the map
    } else {
      alert("Error fetching directions: " + status);
    }
  });
}

// Calculate footprint with the selected coordinates
async function calculateFootprint() {
  if (!startLocation || !destinationLocation) {
      alert("Please select both a start and destination location on the map.");
      return;
  }

  const start = `${startLocation.lat()},${startLocation.lng()}`;
  const destination = `${destinationLocation.lat()},${destinationLocation.lng()}`;
  const transportationMethod = document.getElementById("transportationMethod").value;

  if (!transportationMethod) {
      alert("Please select a transportation method.");
      return;
  }

  const requestData = {
      start: start,
      destination: destination,
      method: transportationMethod
  };

  try {
      const response = await fetch(`${apiUrl}/api/map/calculate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData)
      });

      const result = await response.json();

      if (response.ok) {
          document.getElementById('results').style.display = 'block';
          document.getElementById('result-content').innerHTML = `
              <p>Distance: ${result.distance} km</p>
              <p>Carbon Footprint: ${result.footprint} kg CO₂</p>
              <p><strong>Suggestion:</strong> ${result.suggestion}</p>
          `;

      } else {
          alert(result.message || "Error fetching data.");
      }
  } catch (error) {
      console.error("Error:", error);
      alert("There was an error processing your request.");
  }
}


// Reset the map to initial state
function resetMap() {
  startLocation = null;
  destinationLocation = null;
  
  // Remove markers from the map
  markers.forEach(marker => marker.setMap(null));
  markers = [];

  // Clear directions
  directionsRenderer.set('directions', null);

  // Clear the displayed start and destination locations
  document.getElementById("start-location").textContent = "";
  document.getElementById("destination-location").textContent = "";
}

// Add event listener to close the results section
document.getElementById("close-btn").addEventListener("click", () => {
  document.getElementById('results').style.display = 'none';
  resetMap(); // Reset the map when the results section is closed
});


// Define the closeResults function
function closeResults() {
  document.getElementById('results').style.display = 'none';
  resetMap(); // Reset the map when the results section is closed
    
  // Clear the autocomplete input fields
  document.getElementById("startAutocomplete").value = "";
  document.getElementById("destinationAutocomplete").value = "";
}
