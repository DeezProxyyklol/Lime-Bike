const express = require( 'express' )
const {
  getClosestBikes
} = require( './exec/getZonesAndBikes' )
const axios = require( 'axios' )
const app = express()
const cors = require( 'cors' )
app.use( express.static( 'public' ) )
app.use( cors( {
  origin: "*"
} ) )

app.set( 'view engine', 'ejs' )
app.set( 'views', 'views' )

app.get( '/', ( req, res ) => {
  res.render( 'home.ejs' )
} )

app.get( '/coords', async ( req, res ) => {
  console.log( `Uite coordonatele la un prost sa-i dai ddos:` )
  console.log( req.query )
  const bikes = await getClosestBikes( req.query.lat, req.query.lng )
  console.log( bikes )
  res.json( bikes )
  // res.json( [ `u suck lol`, req.query ] )
} )

app.get( '/kanye', async ( req, res ) => {
  console.log( `Un kan head aici` )
  const qoute = await axios.get( 'https://api.kanye.rest' )
  console.log( qoute.data )
  res.json( qoute.data )
} )

const PORT = process.env.PORT || 3000

app.listen( PORT, () => {
  console.log( `working on port ${PORT}` )
} )