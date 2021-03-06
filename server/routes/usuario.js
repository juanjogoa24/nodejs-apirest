const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');

const { verificaToken, verificaRole } = require('../middlewares/autenticacion');
//const usuario = require('../models/usuario');

const app = express();

app.get('/usuario', verificaToken, (req, res) => {

    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 0;

    Usuario.find({ estado: true }, 'nombre email estado google role img password')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            };
            Usuario.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    cantidad: conteo,
                    usuarios
                })
            }).countDocuments({ estado: true })

        });

});

app.post('/usuario', [verificaToken, verificaRole], (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.put('/usuario/:id', [verificaToken, verificaRole], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true
        },
        (err, usuarioDB) => {

            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                usuario: usuarioDB
            });
        })
});

app.delete('/usuario/:id', [verificaToken, verificaRole], (req, res) => {

    let id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
        }
        if (!usuarioBorrado) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    })

});

app.delete('/usuario2/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    //let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    let estado = false;
    let cambiaEstado = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, cambiaEstado, {
            new: true,
            runValidators: true
        },
        (err, usuarioDB) => {

            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                usuario: usuarioDB
            });
        })
});


module.exports = app;