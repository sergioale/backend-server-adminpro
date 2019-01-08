// Requires
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken')

var SEED = require('../config/config').SEED;

//Inicializar variables
var app = express();
var Usuario = require('../models/usuario');

app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {


        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                errors: err
            });
        }

        if (!usuarioBD) {
            res.status(400).json({
                ok: true,
                mensaje: 'Credenciales incorrectas - email',
                body
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            return res.status(400).json({
                ok: true,
                mensaje: 'Credenciales incorrectas - password',
                body
            });
        }

        //Crear token
        usuarioBD.password = ':)';
        var token = jwt.sign({ usuario: usuarioBD }, SEED, { expiresIn: 14400 })

        res.status(200).json({
            ok: true,
            mensaje: usuarioBD,
            token,
            id: usuarioBD._id
        });
    });

});

module.exports = app;