const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        require: [true, 'el nombre es necesario']
    },

    estado: {
        type: Boolean,
        default: true,
        require: true
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'

    },
});

module.exports = mongoose.model('Categoria', categoriaSchema);