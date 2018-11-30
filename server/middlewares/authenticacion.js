const jwt = require("jsonwebtoken");



// Verificar Token //
let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;

        next();

    });

};

// Verifica AdminRoles //
let verificaAdmin_Role = (req, res, next) => {

    let rolUsuario = req.usuario.role;

    if (rolUsuario !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario indicado no tiene autorización para realizar esa modificación'
            }
        });
    }

    next();

};


let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;

        next();

    });

};


module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
};