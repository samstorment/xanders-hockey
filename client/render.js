import { getKey } from './utils.js';
import { getMouse } from './utils.js';
export const socket = io();
export let myId = -1;

let canvas = document.querySelector('#canvas');
let context = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 500;


// just print the to the browser console on successful connection
socket.on('connect', () => {
    console.log('Client socket connected');
});

socket.on('getId', id => {
    myId = id;
});

// do this when the server tells us the position changed
socket.on('positionChanged', data => {

    let clientPlayer;
    // make opposing players red
    context.fillStyle = 'red';
    context.font = '30px Arial';
    // clear the canvas each time we draw so we don't duplicate players. remove this line to see the effect
    context.clearRect(0, 0, canvas.width, canvas.height);

    // look at each position in the array and draw a red square at that posiiton - this will enable every user to see their self and every other user
    for (let i = 0; i < data.players.length; i++) {
        // draw every player that isnt the client player - we do != instead of !=== because there is a string conversion somewhere
        if (data.players[i].id != data.id) {
            context.fillRect(data.players[i].x, data.players[i].y, 20, 20);
            context.strokeText(data.players[i].id, data.players[i].x, data.players[i].y);
        } else {
            clientPlayer = data.players[i];
        }
    }
    // draw everyone as blue from their own perspective
    context.fillStyle = 'blue';
    context.fillRect(clientPlayer.x, clientPlayer.y, 20, 20);
    context.strokeText(clientPlayer.id, clientPlayer.x, clientPlayer.y);

    context.fillStyle = '#49fb35';
    context.font = '15px Arial';
    // draw all the bullets
    for (let i = 0; i < data.bullets.length; i++) {
        context.fillRect(data.bullets[i].x - 5, data.bullets[i].y - 5, 10, 10);
        context.strokeText(data.bullets[i].id, data.bullets[i].x, data.bullets[i].y);
    }

});

// look at each of the controls the server sent us and setup emits for when each key is pressed/released
socket.on('setControls', controls => {
    for (let i in controls) {
        let key = getKey(controls[i]);
        key.press = () => { socket.emit('keyPressed', key.value); }
        key.release = () => { socket.emit('keyReleased', key.value); }
    }
});


let shooting = false;
let currentX = 0;
let currentY = 0;
canvas.addEventListener('mousedown', event => {
    shooting = true;
    shoot(event);
});

canvas.addEventListener('mousemove', event => {
    if (shooting) {
        shoot(event);
    }
});

canvas.addEventListener('mouseup', () => {
    shooting = false;
    socket.emit('shoot', {shooting: false});
});

function shoot(event) {
    let { mouseX, mouseY } = getMouse(event, canvas);
    currentX = mouseX;
    currentY = mouseY;
    socket.emit('shoot', { 
        x: mouseX,
        y: mouseY,
        shooting: true
    });
}