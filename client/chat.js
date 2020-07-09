import { socket } from './render.js';

// get the chat elements we need
let messagesContainer = document.querySelector('#messages-container');
let inputForm = document.querySelector('#input-form');
let chatInput = document.querySelector('#chat-input');

// add the new chat message to the chat box when received from server
socket.on('addChatMessage', message => {
    // create a new message row, add the message to the row, then add the row to the messagesContainer
    let messageRow = document.createElement('div');
    messageRow.setAttribute('class', 'message-row');
    messageRow.innerHTML = message;
    messagesContainer.appendChild(messageRow);
    // scroll the chat down to show the newest message
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
});

// do this when the user sends a chat message
inputForm.onsubmit = event => {
    // prevent default - this prevents page from refreshing on form submission
    event.preventDefault();
    // send the input text to the server then clear the input box
    socket.emit('sendChatMessage', chatInput.value);
    chatInput.value = '';
};