// Puerto //
process.env.PORT = process.env.PORT || 3000;

// Entorno //
process.env.NODE_ENV = process.env.NODE_END || 'dev';

// Entorno BBDD //
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = "mongodb://cafe-user:cafe123@ds159387.mlab.com:59387/cafe";
}

process.env.URLDB = urlDB;