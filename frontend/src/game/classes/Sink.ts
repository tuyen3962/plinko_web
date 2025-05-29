import { MAX_SINK_OPACITY, obstacleRadius, SLICE } from "../constants";
import { hexToRgba } from "../objects";

export class Sink {
    x: number;
    y: number;
    width: number;
    height: number;
    multiplier: number;
    originalY: number; // Store original y position for animation
    animationMaxY: number;
    opacityGradient: number;
    backgroundOpacity: number;

    private requestId?: number;
    private revertRequestId?: number;

    isAnimating: boolean = false;

    constructor(x: number, y: number, width: number, height: number,
        multiplier: number, originalY: number,
        animationMaxY: number, opacityGradient: number,
        backgroundOpacity: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.multiplier = multiplier;
        this.originalY = originalY;
        this.animationMaxY = animationMaxY;
        this.opacityGradient = opacityGradient;
        this.backgroundOpacity = backgroundOpacity;
    }

    draw(ctx: CanvasRenderingContext2D, color: string) {
        const SPACING = obstacleRadius * 2;

        // Draw the gradient
        // const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y + this.height);
        // gradient.addColorStop(0.1, hexToRgba(color, this.opacityGradient));
        // gradient.addColorStop(1, hexToRgba(color, 0));
        // ctx.fillStyle = gradient;
        // ctx.fillRect(this.x, this.y - this.height, this.width - SPACING, this.height);

        // Draw the rectangular sink
        // const opacity = 0.12 + (distance * (center > i ? (center - i) : (i - center)) / center);
        ctx.fillStyle = hexToRgba(color, this.backgroundOpacity);
        ctx.strokeStyle = hexToRgba(color, this.backgroundOpacity);
        ctx.lineWidth = 4;

        ctx.save();
        ctx.beginPath();
        // ctx.clip();
        // ctx.shadowColor = color; // soft white inner highlight
        // ctx.shadowBlur = 3;
        // ctx.shadowOffsetX = 0;
        // ctx.shadowOffsetY = 0;

        ctx.fillRect(
            this.x,
            this.y - this.height / 2.5,
            this.width - SPACING,
            24
        );

        ctx.filter = `blur(8px)`;

        ctx.fill();
        ctx.closePath();
        ctx.restore();

        // Draw the multiplier text
        ctx.fillStyle = "white";
        ctx.font = "bold 12px Sora";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
            this.multiplier?.toString() + "x",
            this.x + (this.width - SPACING) / 2,
            this.y
        );

        // Draw the border below the sink
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + 12 + 2);
        ctx.lineTo(this.x + (this.width - SPACING), this.y + 12 + 2);
        ctx.stroke();
        ctx.closePath();
    }

    drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }



    checkAndCancelAnimation(onDraw: () => void) {
        if (this.isAnimating) {
            cancelAnimationFrame(this.requestId!);
            cancelAnimationFrame(this.revertRequestId!);
            this.isAnimating = false;
            this.opacityGradient = 0;
            this.y = this.originalY;
            onDraw();
        }

        this.animate(onDraw);
    }

    animate(onDraw: () => void) {
        this.isAnimating = true;
        const distance = (this.animationMaxY - this.originalY) / SLICE;
        const newY = this.y + distance;
        this.opacityGradient += MAX_SINK_OPACITY / SLICE;
        if (newY >= this.animationMaxY) {
            this.y = this.animationMaxY;
            cancelAnimationFrame(this.requestId!);
            onDraw();
            this.revertRequestId = requestAnimationFrame(this.revertSink.bind(this, onDraw));
            return;
        } else {
            this.y = newY;
        }
        onDraw();
        this.requestId = requestAnimationFrame(this.animate.bind(this, onDraw));
    }

    revertSink(onDraw: () => void) {
        const distance = (this.animationMaxY - this.originalY) / SLICE;
        const newY = this.y - distance;
        this.opacityGradient -= MAX_SINK_OPACITY / SLICE;
        if (newY <= this.originalY) {
            this.y = this.originalY;
            cancelAnimationFrame(this.revertRequestId!);
            onDraw();
            this.isAnimating = false;
            return;
        } else {
            this.y = newY;
        }
        onDraw();
        this.revertRequestId = requestAnimationFrame(this.revertSink.bind(this, onDraw));
    }
}