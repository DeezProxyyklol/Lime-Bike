const show = document.querySelector( '#show' )
const bikeList = document.querySelector( '#bikeList' )
const TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX3Rva2VuIjoiRTVJQU1ZVkJCQUJNVCIsImxvZ2luX2NvdW50IjoyOH0.lE6I2I4d2fvogWONMc3L38Lt0QOk0h4O7ikb17k4iMM"
const COOKIE = "_limebike-web_session=YnunelrM7MchzVsFW9l4Vq7uHgW83wXGisRVao6G4aExfgV8C5pF%2BehRdvwrjyBR9BvPtCR04vqE%2B8%2B7vhlobboeDHarfb8yTiYWCYU6XZ7a%2F4Qp0zxPKLppV5beV33qqCFFCejFTIyQkXNEnUl%2Ft7J7QumxR7K3r5JlfagH67UHJsHWG8OLAmhEvgOiz8ow146WoJhMcvy3vMWuNE1sRIQqeWGWd4aGQKwK2z9bzcu5V%2F2LGxzi8aVyqL9ZoAyi%2FiKyuWVNRqRoiyuIiHfQunUJMvd5BFR3OSCgMywZpWquAodGKdTTPz80CuPSxl3T1O5f8n9CSXQllvO42gnP9kBjtcduHEIY%2BxcTMoK1IRwED3CVkEZ%2BTj0rsYEaCgX%2BtrQ8aAADxV5pfGfMg38gMfkpb4qdO4aIKA1PGSVlWoMXKfJGGBfqr%2F0cKg2O9tkRoXVMg7AIZA%2FXCxZgGQapxl41gwo8OhFmbzvffup9OgFevscwtybwGW0ZNqmQSc4q%2FaQDPEisCVyT60N5entEhvj1e3dzcVTo%2BQ%3D%3D--ElFTrPYRgwx1pCIm--yNjpFx52cUoVvvD0qY4Vuw%3D%3D; path=/; secure; HttpOnly"
// cors( {
//   origin: "*"
// } )
const mapData = {
  "user_latitude": 0,
  "user_longitude": 0,
  "ne_lat": 0,
  "ne_lng": 0,
  "sw_lat": 0,
  "sw_lng": 0,
  "zoom": "16"
}

const baseurl = 'https://web-production.lime.bike/api/rider/'
const map = 'v1/views/map'

axios.defaults.withCredentials = true;

async function getKanyeQuotes() {
  console.log( `Un kan head aici` )
  const qoute = await axios.get( 'https://api.kanye.rest' )
  console.log( qoute.data )
}


async function getVehiclesAndZones( data, token, cookie ) {
  try {
    const res = await axios( {
      method: 'get',
      baseURL: baseurl,
      url: map,
      headers: {
        'content-type': 'application/json',
        "Accept": "/",
        "Cache-Control": "no-cache",
        Authorization: token,
        Cookie: cookie
      },
      params: data
    } )
    console.log( 'Am datele in get zones' )
    try {
      const bikes = res.data.data.attributes.bikes
      return new Promise( resolve => {
        resolve( bikes )
      } )
    } catch ( e ) {
      console.log( `eroare in get zones la sortare sau scriere in fiesiere`, e )
    }
    console.log( {
      ...res,
      data: 'gol lol'
    } )
  } catch ( err ) {
    console.log( `Ceva nu-i ok in get zones` )
    console.log( err )
  }
}

function transformCoords( n ) {
  let nr = n
  nr *= 100000000
  nr = Math.floor( nr % 100000000 )
  return nr
}

function sortare( bikes, userlat, userlng ) {
  return new Promise( resolve => {
    userlat *= 100000000
    userlat = Math.floor( userlat % 100000000 )
    userlng *= 100000000
    userlng = Math.floor( userlng % 100000000 )

    for ( let bike of bikes ) {
      const lat = transformCoords( bike.attributes.latitude )
      const lng = transformCoords( bike.attributes.longitude )
      const catetax = Math.abs( userlng - lng )
      const catetay = Math.abs( userlat - lat )
      const ipotenuza = Math.sqrt( catetax + catetay ) % 10000
      bike.distance = ipotenuza
    }

    bikes.sort( ( a, b ) => a.distance - b.distance )

    for ( let bike of bikes ) {
      console.log( bike.attributes.plate_number )
      console.log( bike.distance )
    }
    resolve()
  } )
}


async function getClosestBikes( lat, lng ) {
  mapData.user_latitude = lat
  mapData.user_longitude = lng
  getCorners( mapData )
  return new Promise( async ( resolve, reject ) => {
    try {
      const bikes = await getVehiclesAndZones( mapData, TOKEN, COOKIE )
      if ( typeof bikes == 'array' )
        await sortare( bikes, lat, lng )
      resolve( bikes )
    } catch ( e ) {
      reject( e )
    }
  } )
}

function getCorners( mapData ) {
  mapData.ne_lat = mapData.user_latitude + 0.003
  mapData.ne_lng = mapData.user_longitude + 0.003
  mapData.sw_lat = mapData.user_latitude - 0.003
  mapData.sw_lng = mapData.user_longitude - 0.003
}


async function getBikes( params ) {
  return new Promise( async ( resolve, reject ) => {
    try {
      const response = await axios.get( '/coords', {
        params: params
      } )
      resolve( response )
    } catch ( e ) {
      reject( e )

    }
  } )
}


function getLocation() {
  return new Promise( ( resolve, reject ) => {
    navigator.geolocation.getCurrentPosition(
      position => {
        showPosition( position )
        resolve( position.coords )
      },
      err => {
        show.innerHTML = err.message
        reject( `nuj cplm nu-ti merge gpsu sau cv` )
      }, {
        maximumAge: Infinity,
        enableHighAccuracy: true
      }
    )
  } )
}

function showPosition( position ) {
  show.innerHTML =
    'Latitude: ' +
    position.coords.latitude +
    '<br> Longitude :' +
    position.coords.longitude
}

function addBikes( bikes ) {
  for ( let bike of bikes ) {
    const node = document.createElement( 'li' )
    const textnode = document.createTextNode( bike.attributes.plate_number )
    node.appendChild( textnode )
    bikeList.appendChild( node )
  }
}

getLocation().then( async res => {
  try {
    console.log( `mamata e foarte prosast glumedsc, o iubesti tu, dar ue nu` )
    const bikes = getClosestBikes( res.latitude, res.longitude )
    console.log( `uite kktuiile de date` )
    console.log( bikes.data )
    // addBikes( bikes.data )
  } catch ( e ) {
    console.log( e )
  }
} )