const express = require('express')
const path = require('path')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')

// database, models

var Schema = mongoose.Schema
mongoose.connect('mongodb://localhost:27017/access')

var User = mongoose.model('users',
  new Schema(
    {
      user:  String,
      pass:  String,
    }
  )
)

// aplicación

const PORT = process.env.PORT || 5000
var cors = require('cors')

function aletaorio(min, max){
	return Math.floor(Math.random() * max) + min;
}

function hexAleatorio(){
	var random = aletaorio(0, 16777215)
	if (random < 0){
	  random = 0xFFFFFFFF + random + 1
	}
	return random.toString(16).toUpperCase()
}

function enArreglo(arreglo, valor) {
	var posicion = arreglo.indexOf(valor)
	var rpta = false
	if(posicion != -1){
		rpta = true
	}
	return rpta
}

function generarAleatorios(filas){
  var arreglo = [];
	for (var i = 0; i < filas * filas; i++) {
		var continuar = true;
		while(continuar == true){
			var temp = aletaorio(1, 151);
			if(enArreglo(arreglo, temp) == false){
				continuar = false;
				arreglo.push(temp);
			}
		}
  }
  return arreglo
}

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(cors())
  .use(bodyParser())
  //.use(bodyParser.json())
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/hello', function(req, res) {
    res.send('hello world');
  })
  .get('/generator', function(req, res) {
    var filas = req.query.filas
    var borde = Boolean(req.query.borde)
    var relleno = Boolean(req.query.relleno)
    var rpta = {
      aleatorios: null, 
      borde: null,
      relleno: null,
    }
    if (filas <= 12){
      rpta.aleatorios = generarAleatorios(filas)
      if (borde){
        rpta.borde = hexAleatorio()
      }
      if (relleno){
        rpta.relleno = hexAleatorio()
      }
    }
    res.send(JSON.stringify(rpta))
  })
  .post('/user/access', function(req, res){
    // validar csrf
    if (req.get('token') == 'ulima'){
      // validar usuario
      User.find({
        user: req.body.user,
        pass: req.body.pass,
      }, function(err, documents){
        if (err){
          var rpta = JSON.parse({
            'tipo_mensaje': 'error',
            'mensaje': [
              'Se ha producido un error en validar el usuario',
              err.toString()
            ]
          })
          res.status(500).send(rpta)
        }else{
          if(documents.length == 0){
            res.send('0')
          }else{
            res.send('1')
          }
        }
      })
    }else{
      res.status(500).send('=(')
    }
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
