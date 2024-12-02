const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
require('dotenv').config();

const apikey = process.env.CIAPI_KEY;
const gapikey = process.env.GAPI_KEY;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Serve index.html as a form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
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

    // Render the EJS template and pass the JSON data
    const pounds = carbonEstimate.data.attributes.carbon_lb;
    res.send(`  <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Carbon Estimate</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #f0f8ff;
          color: #333;
        }
        h1 {
          font-size: 2.5em;
          margin-bottom: 20px;
        }
        a {
          text-decoration: none;
          color: white;
          background-color: #007bff;
          padding: 10px 20px;
          border-radius: 5px;
          font-size: 1em;
          transition: background-color 0.3s;
        }
        a:hover {
          background-color: #0056b3;
        }
      </style>
    </head>
    <body>
      <h1>Your package is estimate to cause ${pounds} pounds of carbon dioxide to be released into the atmosphere.</h1>
      <a href="/">Go back</a>
    </body>
    </html>`);
  } catch (error) {
    console.error("Error occurred:", error.message);
    console.error("Stack Trace:", error.stack);
    res.status(500).send({ error: `An error occurred: ${error.message}` });

  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
