//Configurar SW
let swLocation = "sw.js";
// "/beerjs/sw.js";

if (navigator.serviceWorker) {
  if (window.location.href.includes("localhost")) swLocation = "/sw.js"; //Varia según el host
  navigator.serviceWorker.register(swLocation);
}

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

///////////////////////////////////////
// NOTIFICACIONES
///////////////////////////////////////

const PUBLIC_VAPID_KEY =
  "BBaaBqPs1tLMglpWM_eS-lRyIvRS-dS7YVrtx_E8YUoS-k3IxAlCmZ-ZL02Tc8rtbkfM78yuXzVqpba6MOPQrZE";

const subscription = async () => {
  // Service Worker
  console.log("Registering a Service worker");
  const register = await navigator.serviceWorker.register("/sw.js", {
    scope: "/"
  });
  console.log("New Service Worker");

  // Listen Push Notifications
  console.log("Listening Push Notifications");
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
  });

  console.log(subscription);

  // Send Notification
  await fetch("/subscription", {
    method: "POST",
    body: JSON.stringify(subscription),
    headers: {
      "Content-Type": "application/json"
    }
  });
  console.log("Subscribed!");
};

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// UI
const form = document.querySelector('#myform');
const message = document.querySelector('#message');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  fetch('/new-message', {
    method: 'POST',
    body: JSON.stringify({message: message.value}),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  form.reset();
});

// Service Worker Support
if ("serviceWorker" in navigator) {
  subscription().catch(err => console.log(err));
}
