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

# Heroku Setup
### Install the heroku command line interface (CLI) [here](https://devcenter.heroku.com/articles/heroku-cli). Use `heroku` in the terminal to test that it installed correctly. You should get some feedback that is not "command not found". I had to close vs code to and restart to get the integrated terminal to recognize heroku.
### Move to the directory of your project and run `heroku login` then login to your heroku account to link your CLI to your heroku account.
### Go to https://dashboard.heroku.com/apps and click `new` in the top right corner, then click `create new app`. Name it something very cool.
### Link your code to your heroku repository with `heroku git:remote -a <heroku-app-name>` where <heroku-app-name> is the name you gave your app in the step above.
### Run `git add .; git commit -m "Heroku setup"; git push heroku master;` to push your code to your heroku remote repo. Run `git push origin <branchname>` if you are also connected to a personal repo.
### Open your app in the browser with `heroku open`.
*Additional Notes*
### In your package.json you need a start command for heroku to work. The start command should be `node <main JavaScript file>`. For this project the main js file is index.js. This is why we can run the app locally with `npm start`.
``` 
"scripts": {
    "start": "node index.js"
}
```
### In the main js file we need to listen on a specific port for heroku to work. That port is built in to node.js  and is called `process.env.PORT`. To keep using our app locally we can do the following:
```
const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Listening on port: ${port}`));
```
### This will set port to process.env.PORT if it is defined, otherwise port will be 3000. This means we can still view our app locally at http://localhost:3000/.
### Anytime we make new changes to our code, we need to run `git add .; git commit -m "Heroku setup"; git push heroku master;` so our changes take affect on our heroku app.