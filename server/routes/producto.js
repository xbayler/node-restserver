const express = require('express');
const { verificaToken } = require('../middlewares/authenticacion');

let app = express();
let Producto = require('../models/producto');

app.get('/producto', verificaToken, (req, res) => {
    // trae todos los productos
    // populate: usuario categoria
    // paginado

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;

    desde = Number(desde);
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .sort('nombre')
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });

        });
});


app.get('/producto/:id', verificaToken, (req, res) => {
    //populate

    let id = req.params.id;

    Producto.findById(id)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, producto) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (producto === null) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se ha encontrado ningun producto con el id indicado'
                    }
                });
            }

            res.json({
                ok: true,
                producto
            });

        });

});


app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });

        });

});



app.post('/producto', verificaToken, (req, res) => {

    // grabar el usuario
    // grabar una categoria del listado

    let idUsuario = req.usuario._id;
    let body = req.body;



    let producto = new Producto({
        nombre: body.nombre,
        precio: body.precio,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: idUsuario
    });

    producto.save((err, producto) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto
        });

    });

});


app.put('/producto/:id', verificaToken, (req, res) => {

    // actualizar producto

    let id = req.params.id;

    let body = req.body;

    let producto = {
        nombre: body.nombre,
        precio: body.precio,
        descripcion: body.descripcion
    }

    Producto.findByIdAndUpdate(id, producto, { new: true, runValidators: true }, (err, producto) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!producto) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se ha actualizado el producto porque no se ha encontrado ningun producto con el id indicado'
                }
            });
        }

        res.json({
            ok: true,
            producto
        });

    });

});


app.delete('/producto/:id', verificaToken, (req, res) => {

    // cambiar disponible

    let id = req.params.id;

    let disponible = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, disponible, { new: true }, (err, producto) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!producto) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se ha encontrado ningun producto con el id indicado.'
                }
            });
        }

        res.json({
            ok: true,
            producto
        });

    });

});

module.exports = app;