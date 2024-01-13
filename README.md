# Introduction 
Este repositorio contiene dos clientes de chat simples usando WebSocket escritos en Node.js. Ambos clientes se conectan a un servidor WebSocket y permiten a los usuarios interactuar enviando y recibiendo mensajes.

# Archivo: gptClient
Este cliente solicita al usuario ingresar un nombre de usuario y luego interactúa enviando mensajes al servidor. Espera a que el usuario ingrese una pregunta, la envía al servidor junto con el nombre de usuario y muestra la respuesta del servidor.

# Archivo: chatClient
Este cliente también solicita al usuario ingresar un nombre de usuario, pero escucha continuamente la entrada del usuario y envía mensajes al servidor en tiempo real. No espera una respuesta del servidor y simplemente muestra todos los mensajes recibidos.

# Dependencias
ws: Biblioteca WebSocket para Node.js
# Notas:
Ambos clientes utilizan el módulo readline para manejar la entrada del usuario.