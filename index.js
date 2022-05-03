const express = require('express')
const { getClosestBikes } = require('./exec/getZonesAndBikes')
const app = express()

app.use(express.static('public'))

app.set('view engine', 'ejs')
app.set('views', 'views')

app.get('/', (req, res) => {
  res.render('home.ejs')
})

app.get('/coords', async (req, res) => {
  console.log(`Uite coordonatele la un prost sa-i dai ddos:`)
  console.log(req.query)
  const bikes = await getClosestBikes(req.query.lat, req.query.lng)
  console.log(bikes)
  res.json(bikes)
})

app.listen(3000, ()=>
{
  console.log(`working on port 3000`)
})





