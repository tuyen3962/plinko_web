import { ballRadius, NUM_SINKS, obstacleRadius, sinkColorLowLevel, sinkWidth } from "../constants";
import { createObstacles, createSinks } from "../objects";
import { pad, unpad } from "../padding";
import { Ball } from "../objects/Ball";
import { Sink } from "../objects/Sink";
import { Obstacle } from "../objects/Obstacle";
import { PlinkBackgroundManager } from "./PlinkBackgroundManager";

export class BallManager {
    private balls: Ball[];
    private canvasRef: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    // private obstacles: Obstacle[]
    // private sinks: Sink[]
    private requestId?: number;
    private onFinish?: (index: number, startX?: number) => void;
    private sinkFinishIndex: number[] = [];

    private screenWidth: number;
    private screenHeight: number;
    
    private plinkoBackgroundManager: PlinkBackgroundManager;

    constructor(canvasRef: HTMLCanvasElement,
        plinkBackgroundRef: HTMLCanvasElement,
        width: number,
        height: number,
        onFinish?: (index: number, startX?: number) => void) {
        this.screenWidth = width;
        this.screenHeight = height;
        this.balls = [];
        this.canvasRef = canvasRef;
        this.ctx = this.canvasRef.getContext("2d")!;

        // this.sinks = createSinks(this.ctx, this.screenWidth, this.screenHeight);
        // this.obstacles = createObstacles(this.ctx, this.screenWidth, this.screenHeight);
        this.plinkoBackgroundManager = new PlinkBackgroundManager(plinkBackgroundRef, this.screenWidth, this.screenHeight);

        this.onFinish = onFinish;
        this.sinkFinishIndex = [];

        this.update();
    }

    addBall(startX?: number) {
        const newBall = new Ball(startX || pad(this.screenWidth / 2 + 13), pad(50), ballRadius, 'red', this.ctx, this.plinkoBackgroundManager.obstacles, this.plinkoBackgroundManager.sinks, (index) => {
            this.balls = this.balls.filter(ball => ball !== newBall);
            this.onFinish?.(index, startX)
            // this.sinkFinishIndex.push(index);
            // this.sinks[index].isStartMoving = true;
        });
        this.balls.push(newBall);
    }

    // drawObstacles() {
    //     // this.ctx.fillStyle = 'white';
    //     const img = new Image(); // Create new image
    //     img.src = 'peg.png'; // Use your image URL or relative path
    //     this.obstacles.forEach((obstacle) => {
    //         this.ctx.beginPath();
    //         this.ctx.arc(unpad(obstacle.x), unpad(obstacle.y), obstacle.radius, 0, Math.PI * 2);
    //         this.ctx.fill();
    //         this.ctx.closePath();
    //     });
    // }

    // getColor(index: number) {
    //     const center = Math.round(NUM_SINKS / 2) - 1
    //     const distance = Math.abs(center - index)
    //     return {
    //         background: sinkColorLowLevel,
    //         opacity: 0.08 * (distance + 3)
    //     }
    // }


    // drawSinks() {
    //     this.ctx.fillStyle = 'green';
    //     const SPACING = obstacleRadius * 2;
    //     for (let i = 0; i<this.sinks.length; i++)  {
    //         this.ctx.fillStyle = this.getColor(i).background;
    //         const sink = this.sinks[i];
    //         this.ctx.font='normal 13px Arial';
    //         this.ctx.fillRect(sink.x, sink.y - sink.height / 2, sink.width - SPACING, sink.height);
    //         this.ctx.fillStyle = this.getColor(i).color;
    //         this.ctx.fillText((sink?.multiplier)?.toString() + "x", sink.x - 16 + sink.width / 2, sink.y + 5);
    //     };
    // }

    draw() {
        this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);
        // this.drawObstacles();
        // this.drawSinks();
        // this.sinks.forEach(sink => {
        //     sink.draw(this.ctx, this.getColor(sink.index));
        // })
        // this.obstacles.forEach(obstacle => {
        //     obstacle.draw();
        // })
        // this.sinks.forEach(sink => {
        //     sink.draw();
        // })
        this.balls.forEach(ball => {
            ball.draw();
            ball.update();
        });
        // this.sinkFinishIndex.forEach((value, index, i) => {
        //     this.sinks[value].update(
        //         () => {
        //             this.sinkFinishIndex = this.sinkFinishIndex.slice(index)
        //             console.log('remove sink value ', this.sinks[value].multiplier)
        //             this.sinks[value].reset();
        //         }
        //     );
        // });
    }

    update() {
        this.draw();
        this.requestId = requestAnimationFrame(this.update.bind(this));
    }

    stop() {
        if (this.requestId) {
            cancelAnimationFrame(this.requestId);
        }
    }
}