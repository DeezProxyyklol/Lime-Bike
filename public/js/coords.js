const show = document.querySelector('#show');
const bikeList = document.querySelector('#bikeList');

function showPosition(position) {
  show.innerHTML = `Latitude: ${position.latitude}<br>Longitude: ${position.longitude}`;
}

function addBikes(bikes) {
  bikeList.innerHTML = ''; // clear previous list
  bikes.forEach(bike => {
    const li = document.createElement('li');
    li.textContent = bike.attributes.plate_number || 'Unknown bike';
    bikeList.appendChild(li);
  });
}

async function fetchBikes(lat, lng) {
  try {
    const response = await axios.get('/coords', { params: { lat, lng } });
    if (Array.isArray(response.data)) {
      addBikes(response.data);
    } else {
      show.innerHTML += '<br>No bikes found nearby.';
    }
  } catch (error) {
    show.innerHTML = 'Error fetching bikes.';
    console.error(error);
  }
}

function getLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => resolve(position.coords),
      err => reject(err),
      { enableHighAccuracy: true }
    );
  });
}

async function init() {
  try {
    const coords = await getLocation();
    showPosition(coords);
    await fetchBikes(coords.latitude, coords.longitude);
  } catch (err) {
    show.innerHTML = `Could not get location: ${err.message}`;
  }
}

init();
