// app.js
const express = require('express');
const mysql = require('mysql');
const util = require('util');
const expressStaticGzip = require('express-static-gzip');
const session = require('express-session'); // Importa express-session

const unityRoutes = require('./apis/unity');
const jugadorRoutes = require('./apis/jugador');
const auth = require('./apis/auth'); // Importamos las rutas de autenticación

// Set server configuration
const port = 8080;
const ipAddr = '198.199.66.6'; // <--- UPDATE THIS LINE

// Create a connection to the database
const db = mysql.createConnection({
  host: '127.0.0.1',
  port: '3306',
  database: 'JoochSkyfall',
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD
});

// Promisify methods to allow them to be used with async/await
db.connect = util.promisify(db.connect);
db.query = util.promisify(db.query);

// Create an instance of Express
const app = express();

// Inicializa express-session
app.use(session({
  secret: 'jooch',
  resave: false,
  saveUninitialized: true
}));

// For every request, log the current date, HTTP method, and resource
app.use((req, res, next) => {
  console.log(new Date(), req.method, req.url);
  next();
});

// Serve static files from the 'public' directory
// app.use(express.static(__dirname + '/public'));

// Sirve archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

// Parse JSON request bodies
app.use(express.json());

app.use('/', unityRoutes(db));
app.use('/', jugadorRoutes(db));
app.use('/auth', auth(db));

// This code should go after all handlers because it is the final
// middleware in the chain. If no other middleware handles the
// request, this middleware will be responsible for returning a
// 404 - Not Found response.
app.use((req, res) => {
  res.type('text')
    .status(404)
    .send('404 - Not Found');
  return;
});

// Start the server by binding and listening for connections
// on the specified port
app.listen(port, () => console.log(
`Express started on http://${ ipAddr }:${ port }
Press Ctrl-C to terminate.`));

process.on('SIGINT', () => {
  console.log('\n');
  process.exit();
});

// Serve static files from the 'public' directory
// app.use(express.static(__dirname + '/public'));
app.use('/', expressStaticGzip(__dirname + '/public', {
  enableBrotli: false,
  customCompressions: [{
    encodingName: 'gzip',
    fileExtension: 'gz'
  }],
  orderPreference: ['gzip']
}));

// Connect to the database
(async () => {
  try {
    await db.connect();
    console.log('Connected to the database.');
  } catch (err) {
    console.error('Unable to connect to the database.');
    throw err;
  }
})();