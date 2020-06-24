// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3001;

// ============================
//  Entorno
// ============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ============================
//  vencimiento del token
// ============================
// 60 segundo
// 60 minutos
// 24 dias
// 30 días
process.env.CADUCIDAD_TOKEN = '48h'; //60 * 60 * 24 * 30;
// ============================
//  SEED de autenticacion
// ============================

process.env.SEED = process.env.SEED || 'este-es-desarrollo';

// ============================
//  Role
// ============================

process.env.ROLE = '';

// ============================
//  Base de datos
// ============================


let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://root:password@localhost:27017';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

// ============================
//  Google client ID
// ============================
process.env.CLIENT_ID = process.env.CLIENT_ID || '<id-cliente-google-jwt>';