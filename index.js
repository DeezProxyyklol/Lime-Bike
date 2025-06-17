const express = require('express');
const path = require('path');
const { getClosestBikes } = require('./exec/getZonesAndBikes');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(express.static('public'));
app.use(cors({ origin: "*" }));

// Set EJS as the view engine
app.set('view engine', 'ejs');
// Use absolute path for the views folder
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  // Render the "home.ejs" view (no extension needed here)
  res.render('home');
});

app.get('/coords', async (req, res) => {
  console.log('Uite coordonatele la un prost sa-i dai ddos:');
  console.log(req.query);
  const bikes = await getClosestBikes(req.query.lat, req.query.lng);
  console.log(bikes);
  res.json(bikes);
});

app.get('/kanye', async (req, res) => {
  console.log('Un kan head aici');
  const quote = await axios.get('https://api.kanye.rest');
  console.log(quote.data);
  res.json(quote.data);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`working on port ${PORT}`);
});
