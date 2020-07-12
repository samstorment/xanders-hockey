const Entity = require('./entity.js');
const Bullet = require('./bullet.js');

class Player extends Entity {

    // stores all players currently in the game. STATIC methods/variables can be accessed without instantiation
    static list = {};

    // any player that just connects gets placed at position (30, 30)
    constructor(id) {
        super();
        this.id = id;
        this.x = 30;
        this.y = 30;
        this.maxSpeed = 8;
        this.setControls();
        Player.list[id] = this;    // insert the currently created player into the list of all players
    }

    updatePosition() {
        super.updatePosition();
        this.shoot();
    }

    shoot() {
        if (this.shooting) {
            let bullet = new Bullet(this.shotAngle);
            bullet.x = this.x;
            bullet.y = this.y;
        }
    }

    // This is where we define the keys that do something. Be sure that these are valid event.key names
    setControls() {
        this.controls = {
            a : {
                isDown: false,
                press: () => this.speedX = -1 * this.maxSpeed,
                release: () => {
                    this.speedX = 0;
                    if (this.controls.d.isDown) { this.controls.d.press(); }
                }
            },
            d : {
                isDown: false,
                press: () => this.speedX = this.maxSpeed,
                release: () => {
                    this.speedX = 0;
                    if (this.controls.a.isDown) { this.controls.a.press(); }
                }
            }, 
            w : {
                isDown: false,
                press: () => this.speedY = -1 * this.maxSpeed,
                release: () => {
                    this.speedY = 0;
                    if (this.controls.s.isDown) { this.controls.s.press(); }
                }
            }, 
            s : {
                isDown: false,
                press: () => this.speedY = this.maxSpeed,
                release: () => {
                    this.speedY = 0;
                    if (this.controls.w.isDown) { this.controls.w.press(); }
                }
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

        // tell the client their id
        socket.emit('getId', socket.id);

        // when client emits keyPressed, set the specific player key to down
        socket.on('keyPressed', key => {
            player.controls[key].isDown = true;
            player.controls[key].press();
        });
        
        // when client emits keyReleased, set the specific player key to not down 
        socket.on('keyReleased', key => {
            player.controls[key].isDown = false;
            player.controls[key].release();
        });

        // when the client emits shoot, we find the angle to shoot at - doesn'w work perfectly
        socket.on('shoot', mouse => {
            player.shooting = mouse.shooting;
            if (mouse.shooting) {
                let x = -1 * player.x + mouse.x;
                let y = -1 * player.y + mouse.y;
                player.shotAngle = Math.atan2(y, x) / Math.PI * 180;
            }
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