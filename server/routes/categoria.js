const express = require('express');

let Categoria = require('../models/categoria');

let { verificaToken, verificaRole } = require('../middlewares/autenticacion');
// const categoria = require('../models/categoria');

let app = express();

app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        // nos sirve para poder mostrar los datos de un documento asociado
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                categorias
            })

        });

});

app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no es correcto'
                }

            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    });

});

app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });
    //console.log('body::', categoria);
    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
})

app.put('/categoria/:id', [verificaToken, verificaRole], (req, res) => {

    let id = req.params.id;
    let body = (req.body);

    let descCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, descCategoria, {
            new: true,
            runValidators: true
        },
        (err, categoriaDB) => {

            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                categoria: categoriaDB
            });
        })
});

app.delete('/categoria/:id', [verificaToken, verificaRole], (req, res) => {

    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
        }

        if (!categoriaBorrada) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            message: 'Categoria borrada',
            categoria: categoriaBorrada
        })
    })

});


module.exports = app;