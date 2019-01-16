// Requires
var express = require('express');

//Inicializar variables
var app = express();

var Hospital = require('../models/hospital');
var Medicos = require('../models/medico');
var Usuario = require('../models/usuario');


//Busqueda por colección
app.get('/coleccion/:tabla/:termino', (req, res) => {

    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {
        case 'medicos':
            promesa = buscarMedicos(busqueda, regex).then(medicos => {
                res.status(200).json({
                    ok: true,
                    medicos
                });
            });
            break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex).then(hospitales => {
                res.status(200).json({
                    ok: true,
                    hospitales
                });
            });
            break;
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex).then(usuarios => {
                res.status(200).json({
                    ok: true,
                    usuarios
                });
            });
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda son usuarios, medicos y hospitales',
                error: 'Tabla incorrecta'
            });
            break;
    }

});


//Busqueda general  
//Rutas
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
            buscarHospitales(busqueda, regex),
            buscarMedicos(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });

        });


});


function buscarHospitales(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regex }, (err, hospitales) => {

            if (err) {
                reject('Error al cargar hospitales', err);
            } else {
                resolve(hospitales);
            }

        });

    });

}

function buscarMedicos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Medicos.find({ nombre: regex }, (err, medicos) => {

            if (err) {
                reject('Error al cargar Medicos', err);
            } else {
                resolve(medicos);
            }

        });

    });

}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Error al cargar Usuarios', err);
                } else {
                    resolve(usuarios);
                }


            });

    });

}


module.exports = app;