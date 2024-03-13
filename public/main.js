//Configurar SW
let swLocation = "sw.js";
// "/beerjs/sw.js";

if (navigator.serviceWorker) {
  if (window.location.href.includes("localhost")) swLocation = "/sw.js"; //Varia según el host
  navigator.serviceWorker.register(swLocation);
}
///////////////////////
const publicVapidKey = 'BFuHeOQw6wWoHE2dMKnxMuVC1m_eO2B3obOKy7p6vWY1_z1pf8EpT1YC1NzJ50DIDFEvUJJx4UeI3DoIoPg9UY4';

async function subscribeToNotifications() {
  try {
    const serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js');
    const subscription = await serviceWorkerRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: publicVapidKey
    });
    // Envía la suscripción al servidor
    await sendSubscriptionToServer(subscription);
    console.log('Suscripción exitosa');
  } catch (error) {
    console.error('Error al suscribirse a notificaciones:', error);
  }
}

async function sendSubscriptionToServer(subscription) {
  // Envía la suscripción al servidor
  try {
    const response = await fetch('/guardar-suscripcion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ subscription })
    });
    if (!response.ok) {
      throw new Error('Error al enviar la suscripción al servidor');
    }
  } catch (error) {
    console.error('Error al enviar la suscripción al servidor:', error);
  }
}

document.getElementById('subscribeButton').addEventListener('click', subscribeToNotifications);

////////////////////////
document.addEventListener('DOMContentLoaded', () => {

  document.getElementById('crearTarea-button').addEventListener('click', async (event) => {
    event.preventDefault();
    
    const formData = new FormData(document.getElementById('formTarea'));
    console.log('En el main');
    console.log(`Tema: ${formData.get('tema')}`);
    console.log(`Fecha: ${formData.get('fecha')}`);
    try {
      const response = await fetch('/guardar-tarea', {
        method: 'POST',
        body: JSON.stringify({
          tema: formData.get('tema'),
          fecha: formData.get('fecha')
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        alert('Tarea creada exitosamente!!');
        document.getElementById('fecha').value = ''; // Limpiar el campo de fecha
      } else {
        throw new Error('Error al crear la tarea');
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      alert('Ocurrió un error al crear la tarea');
    }
  });
});

//Logic of web app
console.log("Hello world!!");
