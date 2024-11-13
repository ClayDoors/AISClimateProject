const express = require('express')
const app = express()
const port = 3000
const url = "https://www.carboninterface.com/api/v1/estimates";
const bodyParser = require('body-parser'); 
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
  res.send(`Username: ${weight} Password: ${source}`);
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
