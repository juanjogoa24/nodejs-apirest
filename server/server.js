require('./config/config');

const express = require('express');
const app = express();
const path = require('path');


const InitiateMongoServer = require("./config/db");
//app.use(require('./routes/usuario'));

// Initiate Mongo Server
InitiateMongoServer();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))


//habilitacion la carpeta publica
app.use(express.static(path.resolve(__dirname, '../public')));


//configuracion de rutas
app.use(require('./routes/index'))

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});