const Entity = require('./entity.js');
const Bullet = require('./bullet.js');
const Rectangle = require('../shapes/rectangle.js');

class Player extends Entity {


    // any player that just connects gets placed at position (30, 30)
    constructor(id, x=250, y=250, w=50, h=50) {
        super(x, y);
        this.id = id;
        this.maxSpeed = 8;
        this.setControls();
        this.username = '';
        this.hitbox = new Rectangle(x, y, w, h);
        Player.players[id] = this;    // insert the currently created player into the list of all players
    }

    updatePosition() {
        super.updatePosition();
        this.hitbox.x = this.x;
        this.hitbox.y = this.y;
        this.shoot();
    }

    shoot() {
        if (this.shooting) {
            let bullet = new Bullet(this, this.shotAngle);
            let {x, y} = this.hitbox.center();
            bullet.x = x;
            bullet.y = y;
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

        // sets the player's username when they click the join button
        socket.on('join', username => {
            player.username = username;
        });

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
                let {x, y} = player.hitbox.center();
                x = -1 * x + mouse.x;
                y = -1 * y + mouse.y;
                player.shotAngle = Math.atan2(y, x) / Math.PI * 180;
            }
        });
    }

    // delete the player with the corresponding socket id when they dc
    static disconnect(socket) {
        console.log(`Player ${socket.id} disconnected`);
        delete Player.players[socket.id];
    }

    // call this function every draw frame
    static update() {
        // this is the array of data about ALL players that we will send to the client
        let data = [];

        // look at every player in the list of connected players
        for (let p in Player.players) {

            // get the current player
            let player = Player.players[p];

            // update current player's position
            player.updatePosition();

            // add the current player's data thta we want to send the client
            data.push({
                id: player.id,
                username: player.username,
                x: player.hitbox.x,
                y: player.hitbox.y,
                w: player.hitbox.w,
                h: player.hitbox.h
            });
        }
        // After pushing all player data, return the data so we can emit it to the client
        return data;
    }
}

// export the player class so we can require it in index.js
module.exports = Player;