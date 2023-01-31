// Llamado a express
const debug = require('debug')('app:inicio');
//const dbDebug = require('debug')('app:db');
const express = require('express');
const config = require('config');
//const logger = require('./logger');
const morgan = require('morgan');
const req = require('express/lib/request');



const usuarios = require('./routes/usuarios');


//Instanciar el elemento
const app = express(); //Incluso podria recibir parametros

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use('/api/usuarios', usuarios);

//Configuración de entornos
console.log('Aplicación: ' + config.get('nombre'));
console.log('BD server: ' + config.get('configDB.host'));


//Uso de middleware de terceros - Morgan
if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    //console.log('Morgan habilitado');
    debug('Morgan esta habilitado.');
}

//Trabajos con la base de datos
debug('Conectando con la bd...');


//app.use(logger);

// app.use((req, res, next) => {
//     console.log('Autenticando....');
//     next();
// });



//Indicarle a la aplicacion cuales van a ser los metodos que vamos a implementar y estos a su vez van a tener una ruta asignada.

//metodos que podemos tener

//app.get(); //peticion de datos
//app.post(); // envio
//app.put(); //actualizacion
//app.delete(); // eliminacion

//Solo usaremos get de ejemplo, le vamos a enviar información al cliente
app.get('/', (req, res) => {
    res.send('Hola desde Express.');
});



//Indicarle sobre que puerto va a escuchar este servidor 

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}...`);
});

