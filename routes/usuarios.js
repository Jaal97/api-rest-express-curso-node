const express = require('express');
//Llamamos a joi
const Joi = require('joi');
const ruta = express.Router();



const usuarios = [
    { id: 1, nombre: 'Caspian' },
    { id: 2, nombre: 'Shadow' },
    { id: 3, nombre: 'Pelusa' }
]

ruta.get('/', (req, res) => {
    res.send(usuarios);
});

//Con los : sabe que es un parametro
ruta.get('/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    //En caso de que no exista el usuario
    if (!usuario) res.status(404).send('El usuario no fue encontrado');
    //Si encuentra el usuario
    res.send(usuario);

});

ruta.post('/', (req, res) => {
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
ruta.put('/:id', (req, res) =>{
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

ruta.delete('/:id', (req, res) => {
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

module.exports = ruta;