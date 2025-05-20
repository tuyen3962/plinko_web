import { gravity, horizontalFriction, verticalFriction } from "../constants";
// import { Obstacle } from "../objects";
import { pad, unpad } from "../padding";
import { Obstacle } from "./Obstacle";
import { Sink } from "./Sink";

export class Ball {
  private x: number;
  private y: number;
  private radius: number;
  private color: string;
  private vx: number;
  private vy: number;
  private ctx: CanvasRenderingContext2D;
  private obstacles: Obstacle[]
  private sinks: Sink[]
  private onFinish: (index: number) => void;
  private rotation: number = 0;

  constructor(x: number, y: number, radius: number, color: string, ctx: CanvasRenderingContext2D, obstacles: Obstacle[], sinks: Sink[], onFinish: (index: number) => void) {
    console.log("ball drop in x ", x)
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.vx = 0;
    this.vy = 0;
    this.ctx = ctx;
    this.obstacles = obstacles;
    this.sinks = sinks;
    this.onFinish = onFinish;
  }

  draw() {
    const img = new Image(); // Create new image
    img.src = 'ball.png'; // Use your image URL or relative path
    // this.ctx.beginPath();
    // this.ctx.arc(unpad(this.x), unpad(this.y), this.radius, 0, Math.PI * 2);
    // this.ctx.fillStyle = this.color;
    // this.ctx.fill();
    // this.ctx.closePath();

    const size = this.radius * 2;
    this.ctx.clearRect( -this.radius, -this.radius, size, size);
    // img.onload = () => {
      // this.ctx.beginPath();
      // this.ctx.arc(unpad(this.x), unpad(this.y), this.radius, 0, Math.PI * 2);
      // this.ctx.fillStyle = this.color;
      // this.ctx.fill();
      // this.ctx.closePath();
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
    // }

    
  }

  update() {
    this.vy += gravity;
    this.x += this.vx;
    this.y += this.vy;

    // Collision with obstacles
    this.obstacles.forEach(obstacle => {
      const dist = Math.hypot(this.x - obstacle.x, this.y - obstacle.y);
      if (dist < pad(this.radius + obstacle.radius)) {
        // Calculate collision angle
        const angle = Math.atan2(this.y - obstacle.y, this.x - obstacle.x);
        // Reflect velocity
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        this.rotation += speed * 0.05; // tune this factor as needed

        this.vx = (Math.cos(angle) * speed * horizontalFriction);
        this.vy = Math.sin(angle) * speed * verticalFriction;

        // Adjust position to prevent sticking
        const overlap = this.radius + obstacle.radius - unpad(dist);
        this.x += pad(Math.cos(angle) * overlap);
        this.y += pad(Math.sin(angle) * overlap);
      }
    });

    // Collision with sinks
    for (let i = 0; i < this.sinks.length; i++) {
      const sink = this.sinks[i];
      if (
        unpad(this.x) > sink.x - sink.width / 2 &&
        unpad(this.x) < sink.x + sink.width / 2 &&
        (unpad(this.y) + this.radius) > (sink.y - sink.height / 2)
      ) {
        this.vx = 0;
        this.vy = 0;
        this.onFinish(i);
        break;
      }
    }
  }

}