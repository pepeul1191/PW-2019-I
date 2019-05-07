const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
var cors = require('cors')

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(cors())
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/hello', function(req, res) {
    res.send('hello world');
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))