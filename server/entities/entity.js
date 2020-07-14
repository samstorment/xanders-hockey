class Entity {

    constructor(x=0, y=0) {
        this.id = 0;
        this.x = x;
        this.y = y;
        this.speedX = 0;
        this.speedY = 0;
        this.hitbox = undefined;
    }

    updatePosition() {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    // storage containers for entities we create
    // we need to store them here so we can share entity lists across files without circular dependencies
    static bullets = [];
    static players = {};
}

// export the player class so we can require it in index.js
module.exports = Entity;