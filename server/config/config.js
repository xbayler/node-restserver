// Puerto //
process.env.PORT = process.env.PORT || 3000;

// Entorno //
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Entorno BBDD //
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


// Fecha de expiración del token //
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// SEED de autenticación //
process.env.SEED = process.env.SEED || 'secret-dev';

// GOOGLE Client ID //
process.env.CLIENT_ID = process.env.CLIENT_ID || '426264021643-vuhsdj649vfg22drvarpmpa9mvqerlvi.apps.googleusercontent.com';