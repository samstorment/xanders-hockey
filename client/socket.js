import { getKey } from './keyboard.js';
const socket = io();

let canvas = document.querySelector('#canvas');
let context = canvas.getContext('2d');
context.font = '30px Arial';


// just print the to the browser console on successful connection
socket.on('connect', () => {
    console.log('Client socket connected');
});

// do this when the server tells us the position changed
socket.on('positionChanged', data => {

    let clientPlayer;
    // make opposing players red
    context.fillStyle = 'red';
    // clear the canvas each time we draw so we don't duplicate players. remove this line to see the effect
    context.clearRect(0, 0, canvas.width, canvas.height);

    // look at each position in the array and draw a red square at that posiiton - this will enable every user to see their self and every other user
    for (let i = 0; i < data.players.length; i++) {
        // draw every player that isnt the client player - we do != instead of !=== because there is a string conversion somewhere
        if (data.players[i].id != data.id) {
            context.fillRect(data.players[i].x, data.players[i].y, 50, 50);
            context.strokeText(data.players[i].id, data.players[i].x, data.players[i].y);
        } else {
            clientPlayer = data.players[i];
        }
    }
    // draw everyone as blue from their own perspective
    context.fillStyle = 'blue';
    context.fillRect(clientPlayer.x, clientPlayer.y, 50, 50);
    context.strokeText(clientPlayer.id, clientPlayer.x,clientPlayer.y);
});

// look at each of the controls the server sent us and setup emits for when each key is pressed/released
socket.on('setControls', controls => {
    for (let i in controls) {
        let key = getKey(controls[i]);
        key.press = () => { socket.emit('keyPressed', key.value); }
        key.release = () => { socket.emit('keyReleased', key.value); }
    }
});



