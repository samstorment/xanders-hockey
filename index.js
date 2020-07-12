// get express, create a server out of express app, and get socket.io from server
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
// this lets us represent filepaths without worrying about the OS specific file path representation
const path = require('path');
// get the Player class from the player javascript file
const Player = require('./server/entities/player.js');
const Bullet = require('./server/entities/bullet.js');

// respond to GET request with index.html when client visits the empty route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/index.html'));
});

// indicate that the client folder contains static content -- if we don't do this our css/javascript in the client folder won't work
app.use(express.static(path.join(__dirname, 'client')));

// listen for client requests on port 3000
const port = 3000;
server.listen(port, () => console.log(`Listening on port: ${port}`));

// save all the sockets in this list by their socket id
let socketList = {};
let id = 0;

// do this whenever we connect to the client
io.on('connect', socket => {

    // each user that connect's should have a unique socket id -- make them unique by incrementing every new user connection
    socket.id = ++id;
    // save the current socket by its socket id
    socketList[socket.id] = socket;

    // connect the player to the socket
    let player = Player.connect(socket);

    socket.on('join', username => {
        player.username = username;
    });

    // when the server recieves a chat message, emit that message back to ALL other users
    socket.on('sendChatMessage', message => {
        for (let sid in socketList) {
            let messageText = `${Player.list[socket.id].username}: ${message}`;
            socketList[sid].emit('addChatMessage', { message: messageText, id: socket.id });
        }
    });

    // when the client asks for some debug evaluation
    socket.on('evaluate', message => {
        let evalResponse; 
        try {
            evalResponse = eval(message); 
        } catch (e) {
            if (e instanceof SyntaxError) {
                evalResponse = e.message;
            }
        }
        socket.emit('evaluate', evalResponse);
    });

    // when a user disconnects, remove their socket id and disconnect them
    socket.on('disconnect', () => {
        delete socketList[socket.id];
        Player.disconnect(socket);
    });

});

// this function gets called every 1000 / 60 milliseconds. This is 60 frames per second. This is how often we send the client update info.
// can just increase the number in the denominator to increase FPS. This will make the game smoother and the player will move faster
setInterval(() => {

    // get the player, bullet data that we want to send to the client each frame
    let players = Player.update();
    let bullets = Bullet.update();

    // for each socket id connected in the socket list...
    for (let sid in socketList) {
        // get the user's socket
        let socket = socketList[sid];
        // tell each user that the positions changed, and give each client the array of positions so they can see other users
        socket.emit('positionChanged', { id: sid, players: players, bullets: bullets } );
    }

}, 1000 / 60);

