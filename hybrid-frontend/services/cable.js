// services/cable.js
import { createConsumer } from '@rails/actioncable';
import { API_URL } from '../config'; // Asegúrate de tener la URL de la API correctamente configurada

// Reemplaza `http` por `ws` para WebSocket en la URL
const cableUrl = API_URL.replace('http', 'ws') + '/cable';
console.log('Connecting to WebSocket at:', cableUrl);
const cable = createConsumer(cableUrl);  // Esta URL debe usar WebSocket (ws://)


export const feedChannel = cable.subscriptions.create("FeedChannel", {
  connected() {
    console.log('WebSocket connected to FeedChannel'); // Depuración: Verificar conexión exitosa
  },
  disconnected() {
    console.log('WebSocket disconnected from FeedChannel'); // Depuración: Verificar desconexión
  },
  received(data) {
    console.log('New data received on FeedChannel:', data); // Depuración: Inspeccionar datos recibidos
    handleNewPost(data.post); // Este método se define en el estado global
  },
});