const WebSocket = require("ws");
const readline = require('readline');
require("dotenv").config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ws = new WebSocket('ws://localhost:3000');

ws.on('open', () => {
  console.log('Connection established with the server');
  
  rl.question('Enter your username: ', async (username) => {
    console.log(`Welcome, ${username}! Type your messages below:`);

    const askQuestion = async () => {
      return new Promise(resolve => {
        rl.question('Enter your question: ', (question) => {
          // Enviar la pregunta y el nombre del usuario al servidor
          ws.send(`${username}: ${question}`);

          // Escuchar la respuesta del servidor
          ws.once('message', (message) => {
            const response = JSON.parse(message);
            if (response.error) {
              console.error('Server error:', response.error);
            } else {
              console.log('Response received:', response.answer);
            }

            // Resolver la promesa después de recibir la respuesta
            resolve();
          });
        });
      });
    };

    // Iniciar la interacción preguntando la primera pregunta
    while (true) {
      await askQuestion();
    }
  });
});

ws.on("error", (error) => {
  console.error('WebSocket error:', error);
});