const express = require('express');
const { getClosestBikes } = require('./exec/getZonesAndBikes');
const cors = require('cors');
const app = express();

app.use(express.static('public'));
app.use(cors({ origin: '*' }));

// Set view engine and views directory (relative to root)
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
  res.render('home');  // no need for '.ejs' here
});

app.get('/coords', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Missing lat or lng query params' });
    }
    const bikes = await getClosestBikes(parseFloat(lat), parseFloat(lng));
    res.json(bikes);
  } catch (e) {
    console.error('Error in /coords:', e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
