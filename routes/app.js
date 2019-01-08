// Requires
var express = require('express');

//Inicializar variables
var app = express();

//Rutas
app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Petición correcta'
    })
});


module.exports = app;