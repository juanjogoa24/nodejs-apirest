const express = require('express');

let Producto = require('../models/producto');
const _ = require('underscore');
let { verificaToken, verificaRole } = require('../middlewares/autenticacion');

let app = express();

//**********************

app.get('/producto', verificaToken, (req, res) => {

    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 0;

    Producto.find({ disponible: true }, 'nombre email estado google role img password')
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        //.populate('producto', 'nombre precioUni descripcion disponible')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            Producto.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    cantidad: conteo,

                    productos
                })
            }).countDocuments({ disponible: true })

        });

});

app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El id no es correcto'
                    }

                })
            }

            res.json({
                ok: true,
                producto: productoDB
            })

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
                })
            }

            res.json({
                ok: true,
                productos
            })
        });
});

app.post('/producto', [verificaToken, verificaRole], (req, res) => {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        categoria: body.categoriaid,
        usuario: req.usuario._id
    })

    producto.save((err, productoDB) => {

        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });
});

app.put('/producto/:id', [verificaToken], (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no es correcto'
                }

            })
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        //productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => {

            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                producto: productoGuardado
            })

        })

    })
})



app.delete('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {

            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El id no es correcto'
                    }

                })
            }

            productoDB.disponible = false;

            productoDB.save((err, productoBorrado) => {

                if (err) {
                    res.status(500).json({
                        ok: false,
                        err
                    })
                }

                res.json({
                    ok: true,
                    producto: productoBorrado
                })

            })

        })
        //let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
        // let disponible = false;
        // let cambiaEstado = {
        //     disponible: false
        // };

    // Producto.findByIdAndUpdate(id, cambiaEstado, {
    //         new: true,
    //         runValidators: true
    //     },
    //     (err, productoDB) => {

    //         if (err) {
    //             res.status(500).json({
    //                 ok: false,
    //                 err
    //             })
    //         }

    //         if (!productoDB) {
    //             return res.status(400).json({
    //                 ok: false,
    //                 err: {
    //                     message: 'El id no es correcto'
    //                 }

    //             })
    //         }

    //         res.json({
    //             ok: true,
    //             producto: productoDB
    //         });
    //     })
});


module.exports = app;