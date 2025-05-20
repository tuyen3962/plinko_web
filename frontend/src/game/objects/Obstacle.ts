import { unpad } from "../padding";

export class Obstacle {
    x: number;
    y: number;
    radius: number;
    private ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.ctx = ctx;

        // this.draw();
    }

    draw() {
        const img = new Image(); // Create new image
        img.src = 'peg.png'; // Use your image URL or relative path

        // this.ctx.beginPath();
        // img.onload = () => {
            this.ctx.beginPath();
            this.ctx.drawImage(img, unpad(this.x) - this.radius, unpad(this.y) - this.radius, this.radius * 2, this.radius * 2);
            this.ctx.fill()
            this.ctx.closePath();
        // }
        // console.log("draw obstacle ", this.x, this.y, this.radius)
    }
}
