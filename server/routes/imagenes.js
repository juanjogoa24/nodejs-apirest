const express = require('express');
// const fileUpload = require('express-fileupload');
// const { json } = require('body-parser');
const app = express();
// const Usuario = require('../models/usuario');
// let Producto = require('../models/producto');
const path = require('path');
const fs = require('fs');
let { verificaTokenImg } = require('../middlewares/autenticacion');


app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    // let pathImg = `./uploads/${tipo}/${img}`;
    let pathImage = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    console.log(pathImage);
    console.log(img);
    console.log(tipo);

    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        let pathAbsoluto = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(pathAbsoluto);
    }




})


module.exports = app;