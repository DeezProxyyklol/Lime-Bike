const show = document.querySelector('#show');
const bikeList = document.querySelector('#bikeList');

const TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX3Rva2VuIjoiRTVJQU1ZVkJCQUJNVCIsImxvZ2luX2NvdW50IjoyOH0.lE6I2I4d2fvogWONMc3L38Lt0QOk0h4O7ikb17k4iMM";
const COOKIE = "_limebike-web_session=YnunelrM7MchzVsFW9l4Vq7uHgW83wXGisRVao6G4aExfgV8C5pF%2BehRdvwrjyBR9BvPtCR04vqE%2B8%2B7vhlobboeDHarfb8yTiYWCYU6XZ7a%2F4Qp0zxPKLppV5beV33qqCFFCejFTIyQkXNEnUl%2Ft7J7QumxR7K3r5JlfagH67UHJsHWG8OLAmhEvgOiz8ow146WoJhMcvy3vMWuNE1sRIQqeWGWd4aGQKwK2z9bzcu5V%2F2LGxzi8aVyqL9ZoAyi%2FiKyuWVNRqRoiyuIiHfQunUJMvd5BFR3OSCgMywZpWquAodGKdTTPz80CuPSxl3T1O5f8n9CSXQllvO42gnP9kBjtcduHEIY%2BxcTMoK1IRwED3CVkEZ%2BTj0rsYEaCgX%2BtrQ8aAADxV5pfGfMg38gMfkpb4qdO4aIKA1PGSVlWoMXKfJGGBfqr%2F0cKg2O9tkRoXVMg7AIZA%2FXCxZgGQapxl41gwo8OhFmbzvffup9OgFevscwtybwGW0ZNqmQSc4q%2FaQDPEisCVyT60N5entEhvj1e3dzcVTo%2BQ%3D%3D--ElFTrPYRgwx1pCIm--yNjpFx52cUoVvvD0qY4Vuw%3D%3D; path=/; secure; HttpOnly";

const mapData = {
  user_latitude: 0,
  user_longitude: 0,
  ne_lat: 0,
  ne_lng: 0,
  sw_lat: 0,
  sw_lng: 0,
  zoom: "16"
};

const baseurl = 'https://web-production.lime.bike/api/rider/';
const map = 'v1/views/map';

axios.defaults.withCredentials = true;

async function getVehiclesAndZones(data, token, cookie) {
  try {
    const res = await axios({
      method: 'get',
      baseURL: baseurl,
      url: map,
      headers: {
        'content-type': 'application/json',
        Accept: '/',
        'Cache-Control': 'no-cache',
        Authorization: token,
        Cookie: cookie
      },
      params: data
    });

    const bikes = res.data.data.attributes.bikes;
    return bikes;
  } catch (err) {
    console.log('Error fetching vehicles and zones:', err);
    return [];
  }
}

function transformCoords(n) {
  let nr = n;
  nr *= 100000000;
  nr = Math.floor(nr % 100000000);
  return nr;
}

function sortare(bikes, userlat, userlng) {
  userlat *= 100000000;
  userlat = Math.floor(userlat % 100000000);
  userlng *= 100000000;
  userlng = Math.floor(userlng % 100000000);

  for (let bike of bikes) {
    const lat = transformCoords(bike.attributes.latitude);
    const lng = transformCoords(bike.attributes.longitude);
    const catetax = Math.abs(userlng - lng);
    const catetay = Math.abs(userlat - lat);
    const ipotenuza = Math.sqrt(catetax + catetay) % 10000;
    bike.distance = ipotenuza;
  }

  bikes.sort((a, b) => a.distance - b.distance);
}

async function getClosestBikes(lat, lng) {
  mapData.user_latitude = lat;
  mapData.user_longitude = lng;
  getCorners(mapData);

  try {
    const bikes = await getVehiclesAndZones(mapData, TOKEN, COOKIE);
    if (Array.isArray(bikes)) {
      sortare(bikes, lat, lng);
    }
    return bikes;
  } catch (e) {
    console.error('Error getting closest bikes:', e);
    return [];
  }
}

function getCorners(mapData) {
  mapData.ne_lat = mapData.user_latitude + 0.003;
  mapData.ne_lng = mapData.user_longitude + 0.003;
  mapData.sw_lat = mapData.user_latitude - 0.003;
  mapData.sw_lng = mapData.user_longitude - 0.003;
}

function addBikes(bikes) {
  bikeList.innerHTML = ''; // clear old list
  for (let bike of bikes) {
    const node = document.createElement('li');
    const textnode = document.createTextNode(bike.attributes.plate_number);
    node.appendChild(textnode);
    bikeList.appendChild(node);
  }
}

function getLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        showPosition(position);
        resolve(position.coords);
      },
      (err) => {
        show.innerHTML = err.message;
        reject('GPS not available or permission denied');
      },
      { maximumAge: Infinity, enableHighAccuracy: true }
    );
  });
}

function showPosition(position) {
  show.innerHTML = 'Latitude: ' + position.coords.latitude + '<br> Longitude: ' + position.coords.longitude;
}

getLocation()
  .then(async (res) => {
    try {
      console.log('Fetching closest bikes...');
      const bikes = await getClosestBikes(res.latitude, res.longitude);
      console.log('Bikes data:', bikes);
      addBikes(bikes);
    } catch (e) {
      console.error(e);
    }
  })
  .catch((err) => {
    console.error('Location error:', err);
  });
