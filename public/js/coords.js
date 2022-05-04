const show = document.querySelector( '#show' )
const bikeList = document.querySelector( '#bikeList' )

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
  const bikes = await getBikes( {
    lat: res.latitude,
    lng: res.longitude
  } )
  addBikes( bikes.data )
  console.log( bikes.data )
} )