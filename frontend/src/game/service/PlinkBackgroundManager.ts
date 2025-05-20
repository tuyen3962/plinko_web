import { createObstacles, createSinks } from "../objects";
import { Obstacle } from "../objects/Obstacle";
import { Sink } from "../objects/Sink";

export class PlinkBackgroundManager {
    private canvasRef: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private screenWidth: number;
    private screenHeight: number;

    obstacles: Obstacle[]
    sinks: Sink[]

    constructor(canvasRef: HTMLCanvasElement, width: number, height: number) {
        this.canvasRef = canvasRef;
        this.ctx = this.canvasRef.getContext("2d")!;
        this.screenWidth = width;
        this.screenHeight = height;

        this.sinks = createSinks(this.ctx, this.screenWidth, this.screenHeight);
        this.obstacles = createObstacles(this.ctx, this.screenWidth, this.screenHeight);
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);
        this.obstacles.forEach(obstacle => {
            obstacle.draw();
        })
        this.sinks.forEach(sink => {
            sink.draw();
        })

    }
}