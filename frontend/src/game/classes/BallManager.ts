import { ballRadius, obstacleRadius, sinkWidth } from "../constants";
import { Obstacle, createObstacles, createSinks } from "../objects";
import { pad, unpad } from "../padding";
import { Ball } from "./Ball";
import { Sink } from "./Sink";

export class BallManager {
    private balls: Ball[];
    private canvasRef: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private obstacles: Obstacle[]
    private sinks: Sink[]
    private requestId?: number;
    private onFinish?: (index: number,startX?: number) => void;
    private sinkFinishIndex: number[] = [];

    private screenWidth: number;
    private screenHeight: number;

    constructor(canvasRef: HTMLCanvasElement, 
        width: number,
        height: number,
        onFinish?: (index: number,startX?: number) => void) {
        this.screenWidth = width;
        this.screenHeight = height;
        this.balls = [];
        this.canvasRef = canvasRef;
        this.ctx = this.canvasRef.getContext("2d")!;
        this.obstacles = createObstacles(this.screenWidth);
        this.sinks = createSinks(this.screenWidth);
        this.update();
        this.onFinish = onFinish;
        this.sinkFinishIndex = [];
    }

    addBall(startX?: number) {
        const newBall = new Ball(startX || pad(this.screenWidth / 2 + 13), pad(50), ballRadius, 'red', this.ctx, this.obstacles, this.sinks, (index) => {
            this.balls = this.balls.filter(ball => ball !== newBall);
            // console.log('result ball ', index, startX)
            this.onFinish?.(index, startX)
            this.sinkFinishIndex.push(index);
            this.sinks[index].isStartMoving = true;
        });
        this.balls.push(newBall);
    }

    drawObstacles() {
        this.ctx.fillStyle = 'white';
        this.obstacles.forEach((obstacle) => {
            this.ctx.beginPath();
            this.ctx.arc(unpad(obstacle.x), unpad(obstacle.y), obstacle.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.closePath();
        });
    }
  getColor(index: number) {
        if (index <3 || index > this.sinks.length - 3) {
            return {background: '#ff003f', color: 'white'};
        }
        if (index < 6 || index > this.sinks.length - 6) {
            return {background: '#ff7f00', color: 'white'};
        }
        if (index < 9 || index > this.sinks.length - 9) {
            return {background: '#ffbf00', color: 'black'};
        }
        if (index < 12 || index > this.sinks.length - 12) {
            return {background: '#ffff00', color: 'black'};
        }
        if (index < 15 || index > this.sinks.length - 15) {
            return {background: '#bfff00', color: 'black'};
        }
        return {background: '#7fff00', color: 'black'};
    }
    
    
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

    draw(width: number, height: number) {
        this.ctx.clearRect(0, 0, width, height);
        this.drawObstacles();
        // this.drawSinks();
        this.sinks.forEach(sink => {
            sink.draw(this.ctx, this.getColor(sink.index));
        })
        this.balls.forEach(ball => {
            ball.draw();
            ball.update();
        });
        this.sinkFinishIndex.forEach(index => {
            this.sinks[index].update(
                () => {
                    // let oldIndex = this.sinkFinishIndex.findIndex(i => i === index);
                    // console.log('oldIndex ', oldIndex)
                    // if(oldIndex != -1) {
                    //     this.sinkFinishIndex = this.sinkFinishIndex.
                    // }
                    this.sinkFinishIndex.pop()
                    console.log('new sinkFinishIndex ', this.sinkFinishIndex)
                }
            );            
        });
    }
    
    update() {
        this.draw(this.screenWidth, this.screenHeight);
        this.requestId = requestAnimationFrame(this.update.bind(this));
    }

    stop() {
        if (this.requestId) {
            cancelAnimationFrame(this.requestId);
        }
    }
}