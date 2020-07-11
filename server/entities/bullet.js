const Entity = require('./entity.js');

class Bullet extends Entity {
    
    static list = [];
    static id = 0;

    constructor(angle) {
        super();
        this.id = Bullet.id++;
        this.x = 250;
        this.y = 250;
        this.speedX = Math.cos(angle/180*Math.PI) * 10;
        this.speedY = Math.sin(angle/180*Math.PI) * 10;
        this.timer = 0;
        Bullet.list.push(this);
    }

    // update the bullet's position and remove the first bullet in the list after a while
    updatePosition() {
        super.updatePosition();
        if (this.timer++ > 500) {
            Bullet.list.shift();
        }
    }

    static update() {
        let data = [];

        // loop through every bullet in the bullet list and update that bullets position
        for (let b in Bullet.list) {

            let bullet = Bullet.list[b];
            bullet.updatePosition();

            // add the new position to the data package we'll send to the client
            data.push({
                id: bullet.id,
                x: bullet.x,
                y: bullet.y
            });
        }
        return data;
    }
}

module.exports = Bullet;