let Shape = require('./shape.js');

class Rectangle extends Shape {

    // x and y are top left coordinate of rect. w and h are width and height
    constructor(x=0, y=0, w=0, h=0) {
        super();
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    // returns the area of the rect
    area() {
        return this.w * this.h;
    }

    // returns the center point of the rect
    center() {
        return { x: this.x + this.w / 2, y: this.y + this.h / 2};
    }

    // return the pure point positions - useful if the rectangle has a negative widht/height
    points() {

        // default positions
        let leftX = this.x;
        let rightX = this.x + this.w;
        let topY = this.y;
        let bottomY = this.y + this.h;

        // adjust if width or height are negative
        if (this.w < 0 ) {
            rightX = this.x;
            leftX = this.x + this.w;
        }
        if (this.h < 0) {
            topY = this.y + this.h;
            bottomY = this.y;
        }

        return {
            leftX: leftX,
            rightX: rightX,
            topY: topY,
            botY: botY
        }
    }
}

module.exports = Rectangle;