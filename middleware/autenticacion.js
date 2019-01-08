var jwt = require('jsonwebtoken')
var SEED = require('../config/config').SEED;


// Verificar token
exports.verificaToken = function(req, res, next) {

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            res.status(401).json({
                ok: false,
                mensaje: 'Token no valido',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next();

    });
}