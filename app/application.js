const http = require("http");
const WebSocket = require("ws");
const { OpenAI } = require("openai");
require("dotenv").config();

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const port = process.env.PORT || 3000;

const clients = new Set();

wss.on("headers", (headers) => {
  headers.push("Access-Control-Allow-Origin: *");
});

wss.on("connection", (ws) => {
  clients.add(ws);
  ws.on("error", console.error);

  // Mantén un historial de mensajes para cada cliente
  const messageHistory = [];

  ws.on("message", async (message) => {
    const messageString = message.toString("utf-8");
    console.log("Message received from client:", messageString);

    try {
      // Agrega el mensaje actual al historial
      messageHistory.push({ role: "user", content: messageString });

      const response = await generateResponse(messageHistory);
      ws.send(JSON.stringify({ answer: response }));

      // Agrega la respuesta al historial
      messageHistory.push({ role: "assistant", content: response });
    } catch (error) {
      console.error("Error while interacting with OpenAI:", error);
      ws.send(JSON.stringify({ error: "Error processing request" }));
    }
  });

  ws.on("close", () => {
    clients.delete(ws);
    console.log("Client disconnected");
  });
});

async function generateResponse(messageHistory) {
  try {
    const openaiInstance = new OpenAI({
      key: process.env.OPENAI_API_KEY,
    });

    // Envía todo el historial de mensajes para obtener una respuesta contextual
    const response = await openaiInstance.chat.completions.create({
      messages: messageHistory,
      max_tokens: 100,
      model: 'gpt-4-0613',
      stop: ' END',
      temperature: 0
    });

    // Devuelve el contenido del último mensaje generado
    const assistantResponse = response.choices[0].message.content;

    return assistantResponse;
  } catch (error) {
    console.error("Error processing question with OpenAI:", error);
    throw error;
  }
}

const startApplication = async () => {
  try {
    await new Promise((resolve) => server.listen(port, resolve));
    console.log(`WebSocket listening at port ${port}`);
  } catch (error) {
    console.error("Error starting application:", error);
  }
};

module.exports = startApplication;