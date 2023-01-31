// Llamado a express
const debug = require('debug')('app:inicio');
//const dbDebug = require('debug')('app:db');
const express = require('express');
const config = require('config');
//const logger = require('./logger');
const morgan = require('morgan');
const req = require('express/lib/request');

//Llamamos a joi
const Joi = require('joi');



//Instanciar el elemento
const app = express(); //Incluso podria recibir parametros

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

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

const usuarios = [
    { id: 1, nombre: 'Caspian' },
    { id: 2, nombre: 'Shadow' },
    { id: 3, nombre: 'Pelusa' }
]

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

app.get('/api/usuarios', (req, res) => {
    res.send(usuarios);
});

//Con los : sabe que es un parametro
app.get('/api/usuarios/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    //En caso de que no exista el usuario
    if (!usuario) res.status(404).send('El usuario no fue encontrado');
    //Si encuentra el usuario
    res.send(usuario);

});

app.post('/api/usuarios', (req, res) => {
    const schema = Joi.object({
        nombre: Joi.string()
            .min(3)
            .required()
    });
    const { error, value } = validarUsuario(req.body.nombre);
    if (!error) {
        const usuario = {
            id: usuarios.length + 1,
            nombre: value.nombre
        };
        usuarios.push(usuario);
        res.send(usuario);
    }else{
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
    }

});

//Recibimos el id para saber cual ubjeto vamos a modificar
app.put('/api/usuarios/:id', (req, res) =>{
    let usuario = existeUsuario(req.params.id)
    //En caso de que no exista el usuario
    if (!usuario){
        res.status(404).send('El usuario no fue encontrado');
        return;
    } 

    const { error, value } = validarUsuario(req.body.nombre);
    if (error) {
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
        return; //Para que no continue con la compilación
    }

    usuario.nombre = value.nombre;
    res.send(usuario);
});

app.delete('/api/usuarios/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id)
    //En caso de que no exista el usuario
    if (!usuario){
        res.status(404).send('El usuario no fue encontrado');
        return;
    }
    
    //Para ver el indice
    const index = usuarios.indexOf(usuario);

    //Eliminando el usuario solo hay que colocarle uno
    usuarios.splice(index, 1);

    res.send(usuarios);
});

//Indicarle sobre que puerto va a escuchar este servidor 

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}...`);
});

//Para validar si existe el usuario
const existeUsuario = (id) =>{
    return (usuarios.find(u => u.id === parseInt(id)));
}

//Para validar el nombre del usuario 
const validarUsuario = (nom) =>{
    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });

    return (schema.validate({ nombre: nom }));
}