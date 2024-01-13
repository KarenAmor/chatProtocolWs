const WebSocket = require('ws');
const readline = require('readline');

const ws = new WebSocket('ws://localhost:3000');

ws.on('open', () => {
  console.log('Connected to the server');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter your username: ', (username) => {
    console.log(`Welcome, ${username}! Type your messages below:`);

    rl.on('line', (message) => {
      ws.send(`${username}: ${message}`);
    });
  });
});

ws.on('message', (message) => {
  console.log('Received message:', message);
});

ws.on('close', () => {
  console.log('Connection closed');
});