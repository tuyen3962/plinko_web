import { NUM_SINKS, sinkColorLowLevel } from "../constants";

export interface SinkColor {
    background: string;
    opacity: number;
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
    screenWidth: number;
    screenHeight: number;

    constructor(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, multiplier: number, index: number, screenWidth: number, screenHeight: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.multiplier = multiplier;
        this.index = index;
        this.maxY = y + 20;
        this.startY = y;
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;

        // this.draw(ctx);
    }

    getColor(index: number) {
        const center = Math.round(NUM_SINKS / 2) - 1
        const distance = Math.abs(center - index)
        return {
            background: sinkColorLowLevel,
            opacity: 0.08 * (distance + 3)
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        const color = this.getColor(this.index);
        ctx.fillStyle = 'transparent';
        const SPACING = 2;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = color.background;
        // ctx.globalAlpha = 0.64
    
        ctx.globalAlpha = color.opacity;        

        ctx.fillRect(this.x, this.y - this.height / 2, this.width - SPACING, this.height);
        ctx.fillRect(this.x, this.y + this.height - 5, this.width - SPACING, 4);
        ctx.shadowColor = color.background;
        ctx.shadowBlur = 3;

        ctx.globalAlpha = 1;

        ctx.textAlign = 'center';
        ctx.font = 'bold 10px Sora';
        ctx.fillStyle = 'white';
        ctx.fillText((this?.multiplier)?.toString() + "x", this.x + this.width / 2.2, this.y + 3);
    }

    update(onEnd?: () => void) {
        if(!this.isStartMoving) {
            this.y = this.startY
            return;
        }
        let newY = this.isReverting ? this.y - 5 : this.y + 5;

        if (!this.isReverting && newY >= this.maxY) {
            this.y = this.maxY;
            this.isReverting = true;
            return;
        } else if (this.isReverting && newY <= this.startY) {
            this.isReverting = false;
            onEnd?.();
            this.y = this.startY;
            return; // stop animating
        }

        this.y = newY;
    }

    reset() {
        this.y = this.startY;
        this.isReverting = false;
        this.isStartMoving = false;
    }
}