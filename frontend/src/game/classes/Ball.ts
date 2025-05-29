import { gravity, horizontalFriction, verticalFriction } from "../constants";
import { pad, unpad } from "../padding";
import { Obstacle } from "./Obstacle";
import { ObstacleManager } from "./ObstacleManager";
import { Sink } from "./Sink";

export class Ball {
  private x: number;
  private y: number;
  private radius: number;
  private color: string;
  private vx: number;
  private vy: number;
  private ctx: CanvasRenderingContext2D;
  private result: number;
  private obstacleManager: ObstacleManager;
  private obstacles: Obstacle[];
  private sinks: Sink[];
  private onFinish: (index: number, result: number) => void;
  private resultAmount: number;
  
  private rotation: number = 0;

  constructor(
    x: number,
    y: number,
    radius: number,
    color: string,
    ctx: CanvasRenderingContext2D,
    obstacleManager: ObstacleManager,
    sinks: Sink[],
    result: number,
    resultAmount: number,
    onFinish: (index: number, result: number) => void
  ) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.vx = 0;
    this.vy = 0;
    this.ctx = ctx;
    this.obstacleManager = obstacleManager;
    this.obstacles = obstacleManager.obstacles;
    this.sinks = sinks;
    this.onFinish = onFinish;
    this.result = result;
    this.resultAmount = resultAmount;
  }

  draw() {
    // this.ctx.beginPath();
    // this.ctx.arc(unpad(this.x), unpad(this.y), this.radius, 0, Math.PI * 2);
    // this.ctx.fillStyle = this.color;
    // this.ctx.fill();
    // this.ctx.closePath();
    const img = new Image(); // Create new image
    img.src = 'ball.png'; 

    const size = this.radius * 2.4;

    if (img.complete) {
      this.ctx.save();
      this.ctx.translate(unpad(this.x), unpad(this.y)); // move to center
      this.ctx.rotate(this.rotation); // rotate
      this.ctx.drawImage(img, -this.radius, -this.radius, size, size);
      this.ctx.restore();
    } else {
      this.ctx.beginPath();
      this.ctx.arc(unpad(this.x), unpad(this.y), this.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = this.color;
      this.ctx.fill();
      this.ctx.closePath();
    }
  }

  update() {
    this.vy += gravity;
    this.x += this.vx;
    this.y += this.vy;

    // Collision with obstacles
    for(let i = 0; i < this.obstacles.length; i++) {
      const obstacle = this.obstacles[i];
      const dist = Math.hypot(this.x - obstacle.x, this.y - obstacle.y);
      if (dist < pad(this.radius + obstacle.radius)) {
        // Calculate collision angle
        const angle = Math.atan2(this.y - obstacle.y, this.x - obstacle.x);
        // Reflect velocity
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        this.rotation += speed * 0.05; // tune this factor as needed

        this.vx = Math.cos(angle) * speed * horizontalFriction;
        this.vy = Math.sin(angle) * speed * verticalFriction;

        // Adjust position to prevent sticking
        const overlap = this.radius + obstacle.radius - unpad(dist);
        this.x += pad(Math.cos(angle) * overlap);
        this.y += pad(Math.sin(angle) * overlap);
        this.obstacleManager.highlightObstacle(i);
      }
    }
    // this.obstacles.forEach((obstacle) => {
    //   const dist = Math.hypot(this.x - obstacle.x, this.y - obstacle.y);
    //   if (dist < pad(this.radius + obstacle.radius)) {
    //     // Calculate collision angle
    //     const angle = Math.atan2(this.y - obstacle.y, this.x - obstacle.x);
    //     // Reflect velocity
    //     const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    //     this.rotation += speed * 0.05; // tune this factor as needed

    //     this.vx = Math.cos(angle) * speed * horizontalFriction;
    //     this.vy = Math.sin(angle) * speed * verticalFriction;

    //     // Adjust position to prevent sticking
    //     const overlap = this.radius + obstacle.radius - unpad(dist);
    //     this.x += pad(Math.cos(angle) * overlap);
    //     this.y += pad(Math.sin(angle) * overlap);
    //   }
    // });

    // Collision with sinks
    for (let i = 0; i < this.sinks.length; i++) {
      const sink = this.sinks[i];
      if (
        unpad(this.x) > sink.x - sink.width / 2 &&
        unpad(this.x) < sink.x + sink.width / 2 &&
        unpad(this.y) + this.radius > sink.y - sink.height / 2
      ) {
        this.vx = 0;
        this.vy = 0;
        this.onFinish(i, this.result);
        break;
      }
    }
  }
}
