import { obstacleRadius } from "../constants";

export interface SinkColor {
    background: string;
    color: string;
}

export class Sink {
    index: number;
    x: number;
    y: number;
    width: number;
    height: number;
    multiplier: number;
    maxY: number;
    startY: number;

    isReverting: boolean = false;
    isStartMoving: boolean = false;

    constructor(x: number, y: number, width: number, height: number, multiplier: number, index: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.multiplier = multiplier;
        this.index = index;
        this.maxY = y + 20;
        this.startY = y;
    }

    draw(ctx: CanvasRenderingContext2D, color: SinkColor) {
        ctx.fillStyle = 'transparent';
        const SPACING = obstacleRadius * 2;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = color.background;
        ctx.textAlign = 'center';
        ctx.font = 'normal 13px Arial';
        ctx.fillRect(this.x, this.y - this.height / 2, this.width - SPACING, this.height);
        ctx.fillRect(this.x, this.y + this.height - 10, this.width - SPACING, 5);
        ctx.fillStyle = color.color;
        ctx.fillText((this?.multiplier)?.toString() + "x", this.x + this.width/2.7, this.y + 5);
    }

    update(onEnd?: () => void) {
        if(!this.isStartMoving) {
            this.y = this.startY
            return;
        }
        let newY = this.isReverting ? this.y - 5 : this.y + 5;

        if (!this.isReverting && newY >= this.maxY) {
            newY = this.maxY;
            this.isReverting = true;
        } else if (this.isReverting && newY <= this.startY) {
            newY = this.startY;
            this.isReverting = false;
            // this.y = newY;
            onEnd?.();
            console.log('end')
            // return; // stop animating
        }

        this.y = newY;

        // requestAnimationFrame(this.update.bind(this, onEnd));
    }
}