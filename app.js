const express = require('express')
const app = express()
const port = 3000
const url = "https://www.carboninterface.com/api/v1/estimates";
app.use(express.static('public'))

app.get('/', (req, res) => {
    
    res.render('index.html');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
