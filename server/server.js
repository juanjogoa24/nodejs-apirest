require('./config/config');

const express = require('express');

const app = express();

const InitiateMongoServer = require("./config/db");
//app.use(require('./routes/usuario'));

// Initiate Mongo Server
InitiateMongoServer();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
//app.use(bodyParser.json())

app.use(require('./routes/usuario'))

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});