import { getKey } from './utils.js';
import { getMouse } from './utils.js';


let canvas = document.querySelector('#canvas');
let context = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 500;


let joinButton = document.querySelector('#join-button');
let username = document.querySelector('#username');
joinButton.addEventListener('click', () => {
    socket.emit('join', username.value);
    document.querySelector('#join-container').style.display = 'none';
    document.querySelector('#game-container').style.display = 'flex';
});

// just print the to the browser console on successful connection
socket.on('connect', () => {
    console.log('Client socket connected');
});

socket.on('getId', id => {
    myId = id;
});

// this is our frame by frame draw function
socket.on('draw', data => {

    let clientPlayer;
    // make opposing players red
    context.fillStyle = 'red';
    context.font = '15px Arial';
    // clear the canvas each time we draw so we don't duplicate players. remove this line to see the effect
    context.clearRect(0, 0, canvas.width, canvas.height);

    // look at each position in the array and draw a red square at that posiiton - this will enable every user to see their self and every other user
    for (let i = 0; i < data.players.length; i++) {
        // draw every player that isnt the client player - we do != instead of !=== because there is a string conversion somewhere
        if (data.players[i].id != data.id) {
            context.fillRect(data.players[i].x, data.players[i].y, data.players[i].w, data.players[i].h);
            context.fillText(data.players[i].username, data.players[i].x, data.players[i].y);
        } else {
            clientPlayer = data.players[i];
        }
    }
    // draw everyone as blue from their own perspective
    context.fillStyle = 'blue';
    context.fillRect(clientPlayer.x, clientPlayer.y, clientPlayer.w, clientPlayer.h);
    context.fillText(clientPlayer.username, clientPlayer.x, clientPlayer.y);

    
    // draw all the bullets
    for (let i = 0; i < data.bullets.length; i++) {
        context.fillStyle = data.bullets[i].color;
        context.fillRect(data.bullets[i].x, data.bullets[i].y, data.bullets[i].w, data.bullets[i].h);
    }
});



// look at each of the controls the server sent us and setup emits for when each key is pressed/released
socket.on('setControls', controls => {
    for (let i in controls) {
        let key = getKey(controls[i]);
        // currently we can type wasd even before joining and it will move the player - this is bad
        key.press = () => { socket.emit('keyPressed', key.value); }
        key.release = () => { socket.emit('keyReleased', key.value); }
    }
});

let shooting = false;
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
    socket.emit('shoot', { 
        x: mouseX,
        y: mouseY,
        shooting: true
    });
}