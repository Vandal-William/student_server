const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }
});

const connectedUsers = {};

io.on('connection', (socket) => {
  console.log('Utilisateur connecté');

  // Recevoir les données du personnage du client
  socket.on('sendCharacterData', (receivedCharacterData) => {
    // Stocker les données du personnage dans la liste des utilisateurs connectés
    connectedUsers[socket.id] = receivedCharacterData;

    // Diffuser toutes les données des personnages aux utilisateurs connectés
    io.emit('initCharacters', Object.values(connectedUsers));
  });

  // Gestion de la déconnexion de l'utilisateur
  socket.on('disconnect', () => {
    console.log('Utilisateur déconnecté');
    // Supprimer l'utilisateur de la liste des personnages connectés
    delete connectedUsers[socket.id];

    // Diffuser les données des personnages mis à jour
    io.emit('initCharacters', Object.values(connectedUsers));
  });
});

server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
