# Set up from Git clone
### `npm install` to install all dependencies
### `npm start` or `node index.js` to start the server locally
### visit [http://localhost:3000/](http://localhost:3000/) to view page content
### Open a second tab at [http://localhost:3000/](http://localhost:3000/) to connect as a separate user
*If you are making changes to the code and restart the server but the changes seem like they haven't applied, try refreshing your browser with `ctrl+shift+r` to bypass cached browser data*

# Directory Guide
```
├───client                  // client side content
    └───chat.js             // Handles sockets for chat messages
    └───index.html          // UI start point
    └───keyboard.js         // Utility for managing keyboard input
    └───render.js           // Send user game inputs to server and render game
    └───style.css           // Styles for index.html
├───node_modules            // Dependencies
├───server                  // Server side content
    └───entities            // On screen entities
        └───player.js       // Manages each player that joins the game
└───index.js                // Most important file. Start point of server
```

# How I set this up initially
*If you are cloning from GitHub you don't need to do this*
### `npm init` to setup as node project, will create node modules
### `git init` to set up local repo
### `npm install express` for route management
### `npm install socket.io` for web socket communication

