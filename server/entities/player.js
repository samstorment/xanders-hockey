// we should probably make some entity super class since most on screen object we create will need similiar attributes like position, id, maxspeed, etc.
class Player {

    // stores all players currently in the game. STATIC methods/variables can be accessed without instantiation
    static list = {};

    // any player that just connects gets placed at position (0, 0)
    constructor(id) {
        this.id = id;
        this.x = 30;
        this.y = 30;
        this.maxSpeed = 10;
        this.setControls();
        Player.list[id] = this;    // insert the currently created player into the list of all players
    }

    // look at each control, if that control is held down, call the move method for that control
    updatePosition() {
        for (let i in this.controls) {
            // if the control is down and has a move function defined
            if (this.controls[i].isDown && this.controls[i].move) {
                this.controls[i].move();
            }
        }
    }

    // This is where we define the keys that do something. Be sure that these are valid event.key names
    setControls() {
        this.controls = {
            ArrowLeft : {
                isDown: false,
                move: () => this.x -= this.maxSpeed
            },
            ArrowRight : {
                isDown: false,
                move: () => this.x += this.maxSpeed
            }, 
            ArrowUp : {
                isDown: false,
                move: () => this.y -= this.maxSpeed
            }, 
            ArrowDown : {
                isDown: false,
                move: () => this.y += this.maxSpeed
            }
        }
    }

    // return all keyboard controls as an array so we can send them to the client
    getControls() {
        let controlList = [];
        for (let control in this.controls) {
            controlList.push(control);
        }
        return controlList;
    }

    // what a player does upon socket connection
    static connect(socket) {

        console.log(`Player ${socket.id} connected`);

        // create a new Player with an id corresponding to their socket id
        let player = new Player(socket.id);

        // tell the client the list of controls that we need to listen for
        socket.emit('setControls', player.getControls());

        // when client emits keyPressed, set the specific player key to down
        socket.on('keyPressed', key => {
            player.controls[key].isDown = true;
        });
        
        // when client emits keyReleased, set the specific player key to not down 
        socket.on('keyReleased', key => {
            player.controls[key].isDown = false;
        });
    }

    // delete the player with the corresponding socket id when they dc
    static disconnect(socket) {
        console.log(`Player ${socket.id} disconnected`);
        delete Player.list[socket.id];
    }

    // call this function every draw frame
    static update() {
        // this is the array of data about ALL players that we will send to the client
        let data = [];

        // look at every player in the list of connected players
        for (let p in Player.list) {

            // get the current player
            let player = Player.list[p];

            // update current player's position
            player.updatePosition();

            // add the current player's data thta we want to send the client
            data.push({
                id: player.id,
                x: player.x,
                y: player.y
            });
        }
        // After pushing all player data, return the data so we can emit it to the client
        return data;
    }
}

// export the player class so we can require it in index.js
module.exports = Player;