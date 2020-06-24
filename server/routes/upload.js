const express = require('express');
const fileUpload = require('express-fileupload');
const { json } = require('body-parser');
const app = express();
const Usuario = require('../models/usuario');
let Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

app.post('/upload', function(req, res) {

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningun archivo'
                }
            });
    }

    // es el nombre que se va usar para el archivo en el cliente:
    // como key se llamara: archivo
    let archivo = req.files.archivo;

    let nombreArchivo = archivo.name.split('.');
    let extension = nombreArchivo[nombreArchivo.length - 1]
        //validacion de extensiones
    let extensionValidas = ['png', 'jpg', 'gif', 'jpeg']

    if (extensionValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: ' La extension es invalida'

            }
        })
    }
    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${archivo.name}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            message: 'Imagen subida'
        });

    });

})

app.post('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningun archivo'
                }
            });
    }

    //validar tipos
    let tipoValidos = ['productos', 'usuarios'];
    if (tipoValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son' + tipoValidos.join(' '),
                //ext: extension
            }
        })
    }

    // es el nombre que se va usar para el archivo en el cliente:
    // como key se llamara: archivo
    let archivo = req.files.archivo;

    let nombreArchivo = archivo.name.split('.');
    let extension = nombreArchivo[nombreArchivo.length - 1]
        //validacion de extensiones
    let extensionValidas = ['png', 'jpg', 'gif', 'jpeg']

    if (extensionValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: ' La extension es invalida'

            }
        })
    }

    //cambiar nombre del archivo
    let nombre = `${id}-${new Date().getMilliseconds()}.${extension}`

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombre}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //ya se cargo la imagen
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombre);
        } else {
            imagenProducto(id, res, nombre);
        }


    });

})

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'usuarios')
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!usuarioDB) {
            borrarArchivo(nombreArchivo, 'usuarios')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            })
        }

        // let pathImage = path.resolve(__dirname, `../../uploads/usuarios/${usuarioDB.img}`)

        // if (fs.existsSync(pathImage)) {
        //     fs.unlinkSync(pathImage);
        // }

        borrarArchivo(usuarioDB.img, 'usuarios')

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioguardado) => {
            res.json({
                ok: true,
                usuario: usuarioguardado,
                img: nombreArchivo
            })
        })


    })
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'productos')
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            borrarArchivo(nombreArchivo, 'productos')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            })
        }

        // let pathImage = path.resolve(__dirname, `../../uploads/usuarios/${usuarioDB.img}`)

        // if (fs.existsSync(pathImage)) {
        //     fs.unlinkSync(pathImage);
        // }

        borrarArchivo(productoDB.img, 'productos')

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                usuario: productoGuardado,
                img: nombreArchivo
            })
        })


    })
}

function borrarArchivo(nombreArchivo, tipo) {
    let pathImage = path.resolve(__dirname, `../../uploads/${tipo}/${nombreArchivo}`)

    if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage);
    }
}

module.exports = app;