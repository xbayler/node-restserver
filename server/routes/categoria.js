const express = require('express');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/authenticacion');

const app = express();
const Categoria = require('../models/categoria');

// Mostrar todas las categorias //
app.get('/categoria', (req, res) => {

    Categoria.find()
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });

        });

});


// Mostrar una categoria por ID //
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoria) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoria || categoria === undefined || categoria === null) {

            return res.status(400).json({
                ok: false,
                err: `No se ha encontrado ninguna categoria con el id: ${ id }`
            });

        }

        res.json({
            ok: true,
            categoria
        });

    });

});


// Crear nueva categoria //
app.post('/categoria', verificaToken, (req, res) => {

    let usuario = req.usuario;
    let descripcion = req.body.descripcion;

    let categoria = new Categoria();

    categoria.usuario = usuario._id;
    categoria.descripcion = descripcion;

    categoria.save((err, categoria) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria
        });

    });

});


// Actualizar categoria //
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let descripcion = {
        descripcion: req.body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descripcion, { new: true, runValidators: true }, (err, categoria) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (categoria === null) {
            return res.status(400).json({
                ok: false,
                err: 'No se ha encontrado la categoria con el id indicado.'
            });
        }

        res.json({
            ok: true,
            categoria
        });

    });

});


// Eliminar categoria //
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoria) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (categoria === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada.'
                }
            });
        }

        res.json({
            ok: true,
            categoria
        });

    });

});




module.exports = app;