const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son: ' + tiposValidos.join(', ') + '.'
            }
        });
    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');

    let extension = nombreCortado[nombreCortado.length - 1];

    let extensiones = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensiones.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son: ' + extensiones.join(', ') + '.'
            }
        });
    }

    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else if (tipo === 'productos') {
            imagenProducto(id, res, nombreArchivo);
        }

    });

});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuario) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        borraArchivo(usuario.img, 'usuarios');

        usuario.img = nombreArchivo;

        usuario.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });

        });

    });

}

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, producto) => {

        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!producto) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        borraArchivo(producto.img, 'productos');

        producto.img = nombreArchivo;

        producto.save((err, productoGuardado) => {

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });

        });

    });
}

function borraArchivo(nombreImagen, tipo) {
    let pathUrl = path.resolve(__dirname, `../../uploads/${ tipo }/${nombreImagen}`);
    if (fs.existsSync(pathUrl)) {
        fs.unlinkSync(pathUrl);
    }
}

module.exports = app;