// services/cable.js
import { createConsumer } from '@rails/actioncable';
import { API_URL } from '../config'; // Asegúrate de tener la URL de la API correctamente configurada

// Reemplaza `http` por `ws` para WebSocket en la URL
const cableUrl = API_URL.replace('http', 'ws') + '/cable';
const cable = createConsumer(cableUrl);  // Esta URL debe usar WebSocket (ws://)


export const feedChannel = cable.subscriptions.create("FeedChannel", {
  received(data) {
    handleNewPost(data.post); // Este método se define en el estado global
  },
});
