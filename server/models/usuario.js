const { Mongoose } = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');

const mongoose = require('mongoose');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        require: [true, 'el nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        require: [true, 'el email es obligatorio']
    },
    password: {
        type: String,
        require: [true, 'La contrasenia es obligatorio']
    },
    img: {
        type: String,
        require: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos

    },
    estado: {
        type: Boolean,
        default: true,
        require: true
    },
    google: {
        type: Boolean,
        default: false,
        require: false
    },
});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('Usuario', usuarioSchema);