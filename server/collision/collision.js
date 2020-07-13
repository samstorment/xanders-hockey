// we should extend this to compare collisions betwene entities with any hitbox - right now we assume a rectangular hitbox
function checkCollision(entity1, entity2) {

    let box1 = entity1.hitbox;
    let box2 = entity2.hitbox;

    // returns true if box1 is inside box 2
    return (box1.x < box2.x + box2.w && box1.x + box1.w > box2.x &&
            box1.y < box2.y + box2.w && box1.y + box1.w > box2.y);
}

module.exports = checkCollision;