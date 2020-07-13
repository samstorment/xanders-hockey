const Entity = require('./entity.js');
const Rectangle = require('../shapes/rectangle.js');
const checkCollision = require('../collision/collision.js');

class Bullet extends Entity {
    
    static list = [];
    static id = 0;

    constructor(parent, angle) {
        super();
        this.parent = parent;
        this.id = Bullet.id++;
        this.speedX = Math.cos(angle/180*Math.PI) * 10;
        this.speedY = Math.sin(angle/180*Math.PI) * 10;
        this.timer = 0;
        this.hitbox = new Rectangle(0, 0, 5, 5);
        this.color = 'yellow';
        Bullet.list.push(this);   
    }

    // update the bullet's position and remove the first bullet in the list after a while
    updatePosition() {
        super.updatePosition();
        this.hitbox.x = this.x;
        this.hitbox.y = this.y;
        if (this.timer++ > 100) {
            Bullet.list.shift();
        }
    }

    static update() {
        let data = [];

        // loop through every bullet in the bullet list and update that bullets position
        for (let b in Bullet.list) {

            let collided = false;
            let bullet = Bullet.list[b];
            bullet.updatePosition();

            // for every bullet, loop through the list of all players and check to see if the bullet is colliding with a player
            let plist = bullet.playerList;
            for (let p in plist) {
                let player = plist[p];
                // make sure the colliding player is not the parent player
                if (checkCollision(bullet, player) && player.id !== bullet.parent.id) {
                    collided = true;
                    // remove this bullet from the array
                    Bullet.list.splice(b, 1);
                } 
            }

            // add the new position to the data package we'll send to the client
            if (!collided) { 
                data.push({
                    parent: bullet.parent,
                    id: bullet.id,
                    x: bullet.hitbox.x,
                    y: bullet.hitbox.y,
                    w: bullet.hitbox.w,
                    h: bullet.hitbox.h,
                    color: bullet.color
                });
            }
        }
        return data;
    }
}

module.exports = Bullet;