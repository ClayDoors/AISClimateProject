const express = require('express')
const app = express()
const port = 3000
const url = "https://www.carboninterface.com/api/v1/estimates";
const bodyParser = require('body-parser'); 
require('dotenv').config();
const apikey= process.env.CIAPI_KEY;
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'))

app.get('/', (req, res) => {
    
    res.render('index.html');
})
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});
app.post('/', (req, res) => {
  let destination = req.body.destination;
  let source = req.body.source;
  let weight = req.body.weight;
  const url = "https://www.carboninterface.com/api/v1/estimates"; // Replace with the actual endpoint URL

data = {
  "type": "shipping",
      "weight_value": weight,
      "weight_unit": "lb",
      "distance_value": 277,
      "distance_unit": "mi",
      "transport_method": "truck"
};

fetch(url, {
  method: "POST",
  headers: {
    "Authorization": apikey, // Replace with your actual token if dynamic
    "Content-Type": "application/json"
  },
  body: JSON.stringify(data)
})
.then(response => {
  if (!response.ok) {
    throw new Error("Network response was not ok " + response.statusText);
  }
  return response.json();
})
.then(data => res.send(data))
.catch(error => console.error("There was a problem with the fetch operation:", error));
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
