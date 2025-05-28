import { MAX_SINK_OPACITY, MIN_SINK_OPACITY, obstacleRadius, SINK_OPACITY_GRADIENT, SLICE } from "../constants";
import { createSinks, hexToRgba, MULTIPLIERS } from "../objects";
import { Sink } from "./Sink";

export class SinkManager {
    public sinks: Sink[];
    private canvasRef: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private requestId?: number;
    private revertRequestId?: number;
    private color: string;
    private multiplier: number[];

    constructor(
        canvasRef: HTMLCanvasElement,
        color: string
    ) {
        this.canvasRef = canvasRef;
        this.ctx = this.canvasRef.getContext("2d")!;
        this.sinks = createSinks();
        this.color = color;
        this.multiplier = Object.values(MULTIPLIERS);
        this.drawSinks();
    }

    setColor(color: string) {
        this.color = color;
        this.drawSinks();
    }

    setMultiplier(multiplier: number[]) {
        this.multiplier = multiplier;
        const lastIndex = this.multiplier.length - 2;
        const originalLength = this.multiplier.length;
        for(let i = 0; i < originalLength; i++) {
            this.multiplier.push(this.multiplier[lastIndex - i]);
        }

        this.sinks.forEach((sink, index) => {
            sink.multiplier = this.multiplier[index];
        });
        this.drawSinks();
    }

    drawSinks() {
        this.ctx.clearRect(0, 0, this.canvasRef.width, this.canvasRef.height);
        // const SPACING = obstacleRadius * 2;
        // const center = Math.floor(this.sinks.length / 2);
        // const distance = SINK_OPACITY_GRADIENT - MIN_SINK_OPACITY;
        for (let i = 0; i < this.sinks.length; i++) {

            const sink = this.sinks[i];
            sink.draw(this.ctx, this.color);

            // // Draw the gradient
            // const gradient = this.ctx.createLinearGradient(sink.x, sink.y, sink.x + sink.width, sink.y + sink.height);
            // gradient.addColorStop(0.1, hexToRgba(this.color, sink.opacityGradient));
            // gradient.addColorStop(1, hexToRgba(this.color, 0));
            // this.ctx.fillStyle = gradient;
            // this.ctx.fillRect(sink.x, sink.y - sink.height, sink.width - SPACING, sink.height);

            // // Draw the rectangular sink
            // const opacity = 0.12 + (distance * (center > i ? (center - i) : (i - center)) / center);
            // this.ctx.fillStyle = hexToRgba(this.color, opacity);
            // this.ctx.strokeStyle = hexToRgba(this.color, opacity);
            // this.ctx.lineWidth = 4;
            // this.ctx.beginPath();
            // this.ctx.fillRect(
            //     sink.x,
            //     sink.y - sink.height / 2.5,
            //     sink.width - SPACING,
            //     24
            // );
            // this.ctx.fill();
            // this.ctx.stroke();
            // this.ctx.closePath();

            // // Draw the multiplier text
            // this.ctx.fillStyle = "white";
            // this.ctx.font = "bold 12px Sora";
            // this.ctx.textAlign = "center";
            // this.ctx.textBaseline = "middle";
            // this.ctx.fillText(
            //     sink.multiplier?.toString() + "x",
            //     sink.x + (sink.width - SPACING) / 2,
            //     sink.y
            // );

            // // Draw the border below the sink
            // this.ctx.strokeStyle = this.color;
            // this.ctx.lineWidth = 4;
            // this.ctx.beginPath();
            // this.ctx.moveTo(sink.x, sink.y + 12 + 2);
            // this.ctx.lineTo(sink.x + (sink.width - SPACING), sink.y + 12 + 2);
            // this.ctx.stroke();
            // this.ctx.closePath();
        }
    }

    // private sinkAnimation: {
    //     [key: number]: { startTime: number; originalY: number | undefined };
    //   }; // Track animation for each sink
    

    animationSink(index: number) {
        // this.requestId = requestAnimationFrame(this.update.bind(this, index));
        this.sinks[index].checkAndCancelAnimation(() => this.drawSinks());
    }

    // update(index: number) {
    //     const sink = this.sinks[index];
    //     const distance = (sink.animationMaxY - sink.originalY) / SLICE;
    //     const newY = sink.y + distance;
    //     sink.opacityGradient += MAX_SINK_OPACITY / SLICE;
    //     if (newY >= sink.animationMaxY) {
    //         sink.y = sink.animationMaxY;
    //         cancelAnimationFrame(this.requestId!);
    //         this.drawSinks();
    //         this.revertRequestId = requestAnimationFrame(this.revertSink.bind(this, index));
    //         return;
    //     } else {
    //         sink.y = newY;
    //     }
    //     this.drawSinks();
    //     this.requestId = requestAnimationFrame(this.update.bind(this, index));
    // }

    // revertSink(index: number) {
    //     const sink = this.sinks[index];
    //     const distance = (sink.animationMaxY - sink.originalY) / SLICE;
    //     const newY = sink.y - distance;
    //     sink.opacityGradient -= MAX_SINK_OPACITY / SLICE;
    //     if (newY <= sink.originalY) {
    //         sink.y = sink.originalY;
    //         cancelAnimationFrame(this.revertRequestId!);
    //         this.drawSinks();
    //         return;
    //     } else {
    //         sink.y = newY;
    //     }
    //     this.drawSinks();
    //     this.revertRequestId = requestAnimationFrame(this.revertSink.bind(this, index));
    // }
}
