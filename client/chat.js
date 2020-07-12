// get the chat elements we need
let messagesContainer = document.querySelector('#messages-container');
let inputForm = document.querySelector('#input-form');
let chatInput = document.querySelector('#chat-input');

// add the new chat message to the chat box when received from server
socket.on('addChatMessage', data => {
    
    // create a new message row, add the message to the row, then add the row to the messagesContainer
    let messageRow = document.createElement('div');
    messageRow.setAttribute('class', 'message-row');
    messageRow.innerHTML = data.message;

    // if this is a message this client sent, change the style so it stands out
    if (data.id == myId) {
        messageRow.style.backgroundColor = 'purple';
        messageRow.style.color = 'white';
    }

    // add the new message to the message container
    messagesContainer.appendChild(messageRow);

    // scroll the message container to the bottom so we can automatically see the new message
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
});

// when we receive evaluated data, print it to the console
socket.on('evaluate', data => {
    console.log(data);
});

// do this when the user sends a chat message
inputForm.onsubmit = event => {

    // prevent default - this prevents page from refreshing on form submission
    event.preventDefault();

    // if the first character is a slash, we want to do some server debug evaluation
    if (chatInput.value[0] === '/') {
        socket.emit('evaluate', chatInput.value.slice(1));
    } else {
        // send the input text to the server then clear the input box
        socket.emit('sendChatMessage', chatInput.value);
    }

    chatInput.value = '';
};
