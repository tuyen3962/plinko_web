import { unpad } from "../padding";

const _shadowColor = '#E3EAFF';
const _highlightColor = '#BBFF00';
const scaleFactor = 1.3;

export class Obstacle {
    x: number;
    y: number;
    radius: number;

    isHighlighted: boolean = false;

    constructor(x: number, y: number, radius: number) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    draw(ctx: CanvasRenderingContext2D) {
        const scaledRadius = this.radius * scaleFactor;

        // Draw white outer circle
        if (this.isHighlighted) {
            // ctx.save()
            // 🟣 1. Draw drop shadow
            ctx.fillStyle = _highlightColor;
            ctx.shadowColor = '#FFFFFF40';
            ctx.globalCompositeOperation = 'source-over';

            ctx.shadowBlur = 0.5;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0.5;
            this._drawCircleObstaclePath(ctx);
            // ctx.restore();

            // ctx.save()
            // this._drawCircleObstaclePath(ctx);
            // ctx.clip()
            // ctx.globalCompositeOperation = 'source-over';
            // ctx.shadowColor = _shadowColor;
            // ctx.shadowBlur = 1.2;
            // ctx.shadowOffsetX = 0;
            // ctx.shadowOffsetY = 1.2;
            // ctx.restore();
        } else {
            ctx.fillStyle = "white";
            this._drawCircleObstaclePath(ctx);
            
        }

        // ctx.beginPath();
        // ctx.arc(
        //     unpad(this.x),
        //     unpad(this.y),
        //     scaledRadius,
        //     0,
        //     Math.PI * 2
        // );
        // ctx.fill();
        // ctx.closePath();
        
        // Draw black inner circle
        ctx.fillStyle = "#0E122C";
        ctx.beginPath();
        ctx.arc(
            unpad(this.x),
            unpad(this.y),
            scaledRadius * 0.6,
            0,
            Math.PI * 2
        );
        ctx.fill();
        ctx.closePath();
    }

    _drawCircleObstaclePath(ctx: CanvasRenderingContext2D) {
        const scaledRadius = this.radius * scaleFactor;
        ctx.beginPath();
        ctx.arc(
            unpad(this.x),
            unpad(this.y),
            scaledRadius,
            0,
            Math.PI * 2
        );
        ctx.fill();
        ctx.closePath();
    }

    highlight(onDraw: () => void) {
        this.isHighlighted = true;
        onDraw();
        setTimeout(() => {
            onDraw()
            this.isHighlighted = false;
        }, 800);
    }
}