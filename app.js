"use strict";

const config = require("./config");
const DAOTareas = require("./DAOTareas"); //Dao para gestionas los usuarios
//////////////////////////////////
const cron = require('node-cron');

const webpush = require('web-push'); // Importar web-push
// Configuración de web-push (debes configurar tus propias claves)
// Configura tus propias claves VAPID
const vapidKeys = webpush.generateVAPIDKeys();
console.log("Clave pública VAPID:", vapidKeys.publicKey);
console.log("Clave privada VAPID:", vapidKeys.privateKey);
const publicVapidKey = 'BFuHeOQw6wWoHE2dMKnxMuVC1m_eO2B3obOKy7p6vWY1_z1pf8EpT1YC1NzJ50DIDFEvUJJx4UeI3DoIoPg9UY4';
const privateVapidKey = 'QgMluwWgUpYLH-ffX-0yQxiIq7s6PDu9HE96z3hl3fc';
webpush.setVapidDetails('mailto:your_email@example.com', publicVapidKey, privateVapidKey);
///////////////////////////
const path = require("path"); 
const mysql = require("mysql"); //Usar Mysql
const express = require("express");//Usar express
const morgan = require("morgan"); //Para poder ver las funciones de app.js que se estan haciendo
const session = require("express-session");
const sessionMySql = require("express-mysql-session");
// Crear el servidor 
const app = express();
//////////////////////////////////////
const bodyParser = require("body-parser");
// Configurar body-parser para analizar datos de formularios
app.use(bodyParser.urlencoded({ extended: true }));
// Configurar body-parser para analizar datos JSON
app.use(bodyParser.json());
/////////////////////////////////////////
 
const MySQLStore = sessionMySql(session);  
const sessionStore  = new MySQLStore(config.mysqlConfig); 
//Crear la session
const middlewareSession = session({
  saveUninitialized: false,
  secret:"sesion01",
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
const ficherosEstaticos = path.join(__dirname, "public");  //Meter los ficheros estaticos en la carpeta public
app.use(express.static(ficherosEstaticos));   
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev')); //Para poder ver las funciones de app.js que se estan haciendo
app.use(express.json());//Para poder usar ajax y que se pasen los datos en formato json

// Crear un pool de conexiones a la base de datos de MySQL 
const pool = mysql.createPool(config.mysqlConfig);  

// Crear una instancia de los DAOs 
const daoT = new DAOTareas(pool);  //Crear variable con el pool de tipo DaoUsuario


// Arrancar el servidor 
app.listen(config.port, function(err) {
    if (err) {console.log("ERROR al iniciar el servidor"); //Error al iniciar el servidor
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
    function cb_tarea(err,result){
      if (err) {
        console.log(err.message);
        res.status(500).json({ error: err.message }); // Enviar respuesta de error al cliente
      } else {
        console.log('Tarea creada correctamente en el servidor');
        res.status(200).json({ message: 'Tarea creada correctamente' }); // Enviar respuesta exitosa al cliente
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

////////////////////////////////////////////////////////////////

// Ruta para recibir y guardar la suscripción desde el cliente
app.post('/guardar-suscripcion', (req, res) => {
  const subscription = req.body.subscription;
  console.log('Ha peido enviar notificaciones')
  daoT.guardarSuscripcion(subscription, (err) => {
      if (err) {
          console.error('Error al guardar la suscripción:', err);
          res.status(500).json({ error: 'Error interno del servidor' });
          return;
      }
      res.status(200).json({ message: 'Suscripción guardada correctamente' });
  });
});

// Ruta para enviar notificaciones push
app.post('/enviar-notificacion', (req, res) => {
  const notificationPayload = {
      notification: {
          title: '¡Nuevo mensaje!',
          body: '¡Tienes un nuevo mensaje!',
          icon: 'path_to_icon.png' // Ruta al icono de la notificación
      }
  };

  daoT.getAllSubscriptions((err, subscriptions) => {
      if (err) {
          console.error('Error al obtener suscripciones:', err);
          res.status(500).json({ error: 'Error interno del servidor' });
          return;
      }

      Promise.all(subscriptions.map(sub => webpush.sendNotification(sub, JSON.stringify(notificationPayload))))
          .then(() => {
              console.log('Notificaciones enviadas con éxito');
              res.status(200).json({ message: 'Notificaciones enviadas con éxito' });
          })
          .catch(err => {
              console.error('Error al enviar notificaciones:', err);
              res.status(500).json({ error: 'Error interno del servidor' });
          });
  });
});


// Función para enviar notificaciones cada 5 segundos
function enviarNotificacionAutomatica() {
  const notificationPayload = {
      notification: {
          title: '¡Nuevo mensaje!',
          body: '¡Tienes un nuevo mensaje!',
          icon: '/images/icon-192x192.png' // Ruta al icono de la notificación
      }
  };

  daoT.getAllSubscriptions((err, subscriptions) => {
      if (err) {
          console.error('Error al obtener suscripciones:', err);
          return;
      }

      subscriptions.forEach(subscription => {
          webpush.sendNotification(subscription, JSON.stringify(notificationPayload))
              .then(() => console.log('Notificación enviada con éxito a', subscription.endpoint))
              .catch(err => console.error('Error al enviar notificación a', subscription.endpoint, ':', err));
      });
  });
}

// Programar la tarea para enviar notificaciones cada 5 segundos
cron.schedule('*/9 * * * * *', () => {
  console.log('Enviando notificaciones...');
  enviarNotificacionAutomatica();
});

// Enviar notificaciones cada 5 segundos
//setInterval(enviarNotificacionAutomatica, 5000);
