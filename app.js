'use strict';

require('dotenv').config();

const config = require('./config');
const DAOTareas = require('./DAOTareas'); //Dao para gestionas los usuarios

const path = require('path'); 
const mysql = require('mysql'); //Usar Mysql
const express = require('express');//Usar express
const morgan = require('morgan'); //Para poder ver las funciones de app.js que se estan haciendo
const session = require('express-session');
const sessionMySql = require('express-mysql-session');

const webpush = require("./webpush");
let pushSubscripton;

// Crear el servidor 
const app = express();
 
const MySQLStore = sessionMySql(session);  
const sessionStore  = new MySQLStore(config.mysqlConfig); 
//Crear la session
const middlewareSession = session({
  saveUninitialized: false,
  secret:'sesion01',
  resave: false,
  store: sessionStore
}); 

app.use(middlewareSession);
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
}); 

app.set('views', path.join(__dirname, 'views')); //Meter los ejs en el fichero viewa
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));   
app.use(express.urlencoded({extended: true}));
app.use(express.json());//Para poder usar ajax y que se pasen los datos en formato json
app.use(morgan('dev')); //Para poder ver las funciones de app.js que se estan haciendo


// Crear un pool de conexiones a la base de datos de MySQL 
const pool = mysql.createPool(config.mysqlConfig);  

// Crear una instancia de los DAOs 
const daoT = new DAOTareas(pool);  //Crear variable con el pool de tipo DaoUsuario


// Arrancar el servidor 
app.listen(config.port, function(err) {
    if (err) {console.log('ERROR al iniciar el servidor'); //Error al iniciar el servidor
    } else { console.log(`Servidor arrancado en el puerto localhost:${config.port}`);} //Exito al iniciar el servidor
});

// Ruta para manejar cualquier solicitud GET
app.get('/', (req, res) => {
    // Manejar cualquier solicitud GET no coincidente con los archivos estáticos
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
  
app.post('/guardar-tarea', (req, res) => {
  const { tema, fecha } = req.body;
  daoT.crearTarea(tema, fecha, cb_tarea);
  async function cb_tarea(err, result) {
    if (err) {
      console.log(err.message);
      res.status(500).json({ error: err.message }); // Enviar respuesta de error al cliente
    } else {
      console.log('Tarea creada correctamente en el servidor');
      // Payload Notification
      const payload = JSON.stringify({
        body: `Tarea creada: Tema: ${tema} , Fecha: ${fecha}`
      });
      res.status(200).json();
      try {
        await webpush.sendNotification(pushSubscripton, payload);
      } catch (error) {
        console.log(error);
      }
    }
  }
}); 
  
  app.get('/obtener-tareas', (req, res) => {
    daoT.getAllTareas(cb_getTar);// recopilar todos los usuarios
    function cb_getTar(err, result){
      if(err){
          console.log(err.message); // Mensaje de error en la consola
          res.status(500).json({ error: err.message });// Error y mandar a el ajax
          res.end();
      }
      else{res.status(200).json({ resultado: result });}// Mandar la lista de usuarios
    } 
  });

/*   app.get('/obtener-tareas', (req, res) => {

    // Aquí debes implementar la lógica para obtener las tareas de donde sea que estén almacenadas
    const tareas = [
        { id: 1, titulo: 'Tarea 1', descripcion: 'Descripción de la tarea 1' },
        { id: 2, titulo: 'Tarea 2', descripcion: 'Descripción de la tarea 2' },
        { id: 3, titulo: 'Tarea 3', descripcion: 'Descripción de la tarea 3' }
    ];

    // Envía las tareas como respuesta al cliente
    res.json(tareas);
}); */


///////////////////////////////////////
// NOTIFICACIONES
///////////////////////////////////////

app.post("/subscription", async (req, res) => {
  pushSubscripton = req.body;
  // Server's Response
  res.status(201).json();
});

app.post("/new-message", async (req, res) => {
  const { body } = req.body;
  // Payload Notification
  const payload = JSON.stringify({
    body,
  });
  res.status(200).json();
  try {
    await webpush.sendNotification(pushSubscripton, payload);
  } catch (error) {
    console.log(error);
  }
});

///////////////////////////////////////
// NOTIFICACIONES RECURRENTES
///////////////////////////////////////

let i = 0

setInterval(async () => {
  console.log(`Hola ${i}`);
  // Payload Notification
  const payload = JSON.stringify({
    body: `Prueba ${i}`,
  });
  try {
    await webpush.sendNotification(pushSubscripton, payload);
  } catch (error) {
    console.log(error);
  }
  i++;
}, 5000);