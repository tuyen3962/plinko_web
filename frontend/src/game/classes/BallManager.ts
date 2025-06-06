import { HEIGHT, WIDTH, ballRadius } from "../constants";
import { pad } from "../padding";
import { Ball } from "./Ball";
import { ObstacleManager } from "./ObstacleManager";
import { SinkManager } from "./SinkManager";

export class BallManager {
  private balls: Ball[];
  private canvasRef: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private requestId?: number;
  private onFinish?: (index: number, multiplier: number | undefined, startX?: number, resultAmount?: number) => void;

  // Manager
  private obstacleManager: ObstacleManager;
  private sinkManager: SinkManager;

  constructor(
    canvasRef: HTMLCanvasElement,
    obstacleCanvasRef: HTMLCanvasElement,
    sinkCanvasRef: HTMLCanvasElement,
    onFinish?: (index: number, multiplier: number | undefined, startX?: number, resultAmount?: number) => void
  ) {
    this.balls = [];
    this.canvasRef = canvasRef;
    this.ctx = this.canvasRef.getContext("2d")!;
    this.obstacleManager = new ObstacleManager(obstacleCanvasRef, WIDTH, HEIGHT);
    this.sinkManager = new SinkManager(sinkCanvasRef, "#81B032");
    this.onFinish = onFinish;
    // this.obstacleManager.draw();
    // this.sinkManager.drawSinks();
    this.update();
  }

  setSinkColor(color: string) {
    this.sinkManager.setColor(color);
  }

  setSinkMultiplier(multiplier: number[]) {
    this.sinkManager.setMultiplier(multiplier);
  }

  addBall(startX?: number, resultAmount?: number) {
    const newBall = new Ball(startX || pad(WIDTH / 2 + 13), pad(50), ballRadius, 'red',
      this.ctx, this.obstacleManager, this.sinkManager.sinks, 1, resultAmount ?? 1, (index: number, result: number) => {
      this.balls = this.balls.filter(ball => ball !== newBall);
      console.log('result ', result, ' index ', index, ' original multiplier ', this.sinkManager.sinks[index].multiplier  )
      this.onFinish?.(index, this.sinkManager.sinks[index].multiplier, startX, resultAmount)

      // Update the sink's y position immediately
      // this.sinkManager.sinks[index].y += 10; // Move down by 20 pixels (adjust as needed)
      this.sinkManager.animationSink(index);

    });
    this.balls.push(newBall);
  }

  retestBall(multiplier: number, startX?: number, resultAmount?: number) {
    const newBall = new Ball(startX || pad(WIDTH / 2 + 13), pad(50), ballRadius, 'red',
      this.ctx, this.obstacleManager, this.sinkManager.sinks, multiplier, resultAmount ?? 1, (index: number, result: number) => {
      this.balls = this.balls.filter(ball => ball !== newBall);
      // console.log('result ', result, ' index ', index, ' original multiplier ', this.sinkManager.sinks[index].multiplier)
      if(this.sinkManager.sinks[index].multiplier !== result) {
        console.log('multiplier mismatch: expected multiplier ', this.sinkManager.sinks[index].multiplier, ' original sink multiplier ', multiplier)
      } else {
        this.onFinish?.(index, this.sinkManager.sinks[index].multiplier, startX)
      }
      

      // Update the sink's y position immediately
      // this.sinkManager.sinks[index].y += 10; // Move down by 20 pixels (adjust as needed)
      this.sinkManager.animationSink(index);

    });
    this.balls.push(newBall);
  }


  draw() {
    this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
    this.balls.forEach((ball) => {
      ball.draw();
      ball.update();
    });
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

// drawObstacles() {
//   this.obstacles.forEach((obstacle) => {
//     const scaleFactor = 1.3;
//     const scaledRadius = obstacle.radius * scaleFactor;

//     // Draw white outer circle
//     this.ctx.fillStyle = "white";
//     this.ctx.beginPath();
//     this.ctx.arc(
//       unpad(obstacle.x),
//       unpad(obstacle.y),
//       scaledRadius,
//       0,
//       Math.PI * 2
//     );
//     this.ctx.fill();
//     this.ctx.closePath();

//     // Draw black inner circle
//     this.ctx.fillStyle = "black";
//     this.ctx.beginPath();
//     this.ctx.arc(
//       unpad(obstacle.x),
//       unpad(obstacle.y),
//       scaledRadius * 0.6,
//       0,
//       Math.PI * 2
//     );
//     this.ctx.fill();
//     this.ctx.closePath();
//   });
// }

// drawSinks() {
//   const SPACING = obstacleRadius * 2;
//   for (let i = 0; i < this.sinks.length; i++) {
//     const sink = this.sinks[i];

//     // Check if this sink is being animated
//     if (this.sinkAnimation[i]) {
//       const elapsedTime = Date.now() - this.sinkAnimation[i].startTime;
//       if (elapsedTime >= 150) {
//         // Reset the sink's y position to original
//         sink.y = this.sinkAnimation[i].originalY;
//         delete this.sinkAnimation[i]; // Clear the animation
//       }
//     }

//     // Draw the rectangular sink
//     this.ctx.fillStyle = "rgba(129, 176, 50, 0.64)";
//     this.ctx.strokeStyle = "rgba(129, 176, 50, 0.64)";
//     this.ctx.lineWidth = 4;
//     this.ctx.beginPath();
//     this.ctx.fillRect(
//       sink.x,
//       sink.y - sink.height / 2.5,
//       sink.width - SPACING,
//       24
//     );
//     this.ctx.fill();
//     this.ctx.stroke();
//     this.ctx.closePath();

//     // Draw the multiplier text
//     this.ctx.fillStyle = "white";
//     this.ctx.font = "bold 12px Arial";
//     this.ctx.textAlign = "center";
//     this.ctx.textBaseline = "middle";
//     this.ctx.fillText(
//       sink.multiplier?.toString() + "x",
//       sink.x + (sink.width - SPACING) / 2,
//       sink.y
//     );

//     // Draw the border below the sink
//     this.ctx.strokeStyle = "rgba(129, 176, 50, 0.64)";
//     this.ctx.lineWidth = 4;
//     this.ctx.beginPath();
//     this.ctx.moveTo(sink.x, sink.y + 12 + 2);
//     this.ctx.lineTo(sink.x + (sink.width - SPACING), sink.y + 12 + 2);
//     this.ctx.stroke();
//     this.ctx.closePath();
//   }
// }

