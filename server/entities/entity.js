class Entity {

    constructor() {
        this.id = 0;
        this.x = 0;
        this.y = 0;
        this.speedX = 0;
        this.speedY = 0;
    }

    updatePosition() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
}

// export the player class so we can require it in index.js
module.exports = Entity;