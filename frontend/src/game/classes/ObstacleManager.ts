import { createObstacles } from "../objects";
import { unpad } from "../padding";
import { Obstacle } from "./Obstacle";

export class ObstacleManager {
    private canvasRef: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private screenWidth: number;
    private screenHeight: number;

    obstacles: Obstacle[]

    constructor(canvasRef: HTMLCanvasElement, width: number, height: number) {
        this.canvasRef = canvasRef;
        this.ctx = this.canvasRef.getContext("2d")!;
        this.screenWidth = width;
        this.screenHeight = height;

        // this.sinks = createSinks(this.ctx, this.screenWidth, this.screenHeight);
        this.obstacles = createObstacles();
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);
        this.drawObstacles();
    }

    drawObstacles() {
        this.obstacles.forEach((obstacle) => {
            obstacle.draw(this.ctx);
            // const scaleFactor = 1.3;
            // const scaledRadius = obstacle.radius * scaleFactor;

            // // Draw white outer circle
            // this.ctx.fillStyle = "white";
            // this.ctx.beginPath();
            // this.ctx.arc(
            //     unpad(obstacle.x),
            //     unpad(obstacle.y),
            //     scaledRadius,
            //     0,
            //     Math.PI * 2
            // );
            // this.ctx.fill();
            // this.ctx.closePath();

            // // Draw black inner circle
            // this.ctx.fillStyle = "black";
            // this.ctx.beginPath();
            // this.ctx.arc(
            //     unpad(obstacle.x),
            //     unpad(obstacle.y),
            //     scaledRadius * 0.6,
            //     0,
            //     Math.PI * 2
            // );
            // this.ctx.fill();
            // this.ctx.closePath();
        });
    }

    highlightObstacle(index: number) {
        this.obstacles[index].highlight(() => {
            this.drawObstacles();
        });
    }
}