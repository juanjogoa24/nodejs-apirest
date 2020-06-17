// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3001;

// ============================
//  Entorno
// ============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============================
//  Base de datos
// ============================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://root:password@localhost:27017';
} else {
    urlDB = 'mongodb+srv://user:123456@cluster0-4ikqx.mongodb.net/cafe';
}
process.env.URLDB = urlDB;