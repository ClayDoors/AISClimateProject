const express = require('express');
const app = express();
const port = process.env.PORT || 3000;3000;
const bodyParser = require('body-parser');
require('dotenv').config();

const apikey = process.env.CIAPI_KEY;
const gapikey = process.env.GAPI_KEY;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

app.post('/', async (req, res) => {
  try {
    const destination = req.body.destination;
    const source = req.body.source;
    const weight = req.body.weight;

    const gurl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${source}&destinations=${destination}&key=${gapikey}`;
    const distanceResponse = await fetch(gurl);
    if (!distanceResponse.ok) {
      throw new Error("Failed to fetch distance: " + distanceResponse.statusText);
    }

    const distanceData = await distanceResponse.json();
    const km = distanceData.rows[0].elements[0].distance.value / 1000;

    const carbonData = {
      type: "shipping",
      weight_value: weight,
      weight_unit: "lb",
      distance_value: km,
      distance_unit: "km",
      transport_method: "truck",
    };

    const carbonResponse = await fetch("https://www.carboninterface.com/api/v1/estimates", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apikey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(carbonData),
    });

    if (!carbonResponse.ok) {
      throw new Error("Failed to fetch carbon estimate: " + carbonResponse.statusText);
    }

    const carbonEstimate = await carbonResponse.json();
    res.send(carbonEstimate);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ error: "An error occurred while processing your request." });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
