const express = require('express')
const path = require('path')
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
    request_header = req.get('token')
    if (request_header == 'ulima'){
      res.send('Ok')
    }else{
      res.status(500).send('=(')
    }
    // con
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))