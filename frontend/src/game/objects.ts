import { Obstacle } from "./classes/Obstacle";
import { Sink } from "./classes/Sink";
import {
  HEIGHT,
  MIN_SINK_OPACITY,
  NUM_OBSTACLES,
  NUM_SINKS,
  SINK_ANIMATION_HEIGHT,
  SINK_OPACITY_GRADIENT,
  WIDTH,
  obstacleRadius,
  sinkWidth,
} from "./constants";
import { pad } from "./padding";

// export interface Obstacle {
//   x: number;
//   y: number;
//   radius: number;
// }

// export interface Sink {
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   multiplier?: number;
//   originalY: number; // Store original y position for animation
//   animationMaxY: number;
//   opacityGradient: number;
// }

export const MULTIPLIERS: { [key: number]: number } = {
  1: 10,
  2: 4,
  3: 3,
  4: 1.9,
  5: 1.2,
  6: 0.9,
  7: 0.7,
  8: 0.9,
  9: 1.2,
  10: 1.9,
  11: 3,
  12: 4,
  13: 10
};

export const createObstacles = (): Obstacle[] => {
  const obstacles: Obstacle[] = [];
  const rows = NUM_OBSTACLES;
  for (let row = 2; row < rows; row++) {
    const numObstacles = row + 1;
    const y = 0 + row * 35;
    const spacing = 36;
    for (let col = 0; col < numObstacles; col++) {
      const x = WIDTH / 2 - spacing * (row / 2 - col);
      obstacles.push(new Obstacle(
        pad(x),
        pad(y),
        obstacleRadius,
      ));
    }
  }
  return obstacles;
};

export const createSinks = (): Sink[] => {
  const sinks = [];
  const SPACING = obstacleRadius * 2;

  const center = Math.floor(NUM_SINKS / 2);
        const distance = SINK_OPACITY_GRADIENT - MIN_SINK_OPACITY;

  for (let i = 0; i < NUM_SINKS; i++) {
    const x =
      WIDTH / 2 + sinkWidth * (i - Math.floor(NUM_SINKS / 2)) - SPACING * 1.5;
    const y = HEIGHT - 290;
    const width = sinkWidth;
    const height = width;
    sinks.push(new Sink(
      x, y, width, height,
      MULTIPLIERS[i + 1],
      //originalY
      y,
      //animationMaxY
      y + SINK_ANIMATION_HEIGHT,
      //opacityGradient
      0,
      //backgroundOpacity
      MIN_SINK_OPACITY + (distance * (center > i ? (center - i) : (i - center)) / center)
    ));
  }

  return sinks;
};

export const hexToRgba = (hex: string, opacity?: number) => {

  // Remove leading #
  hex = hex.replace(/^#/, '');

  // If shorthand hex (#RGB or #RGBA), convert to full form
  if (hex.length === 3 || hex.length === 4) {
    hex = hex.split('').map(c => c + c).join('');
  }

  // Default alpha is 255 (opaque) if not provided
  if (hex.length === 6) hex += 'FF';

  if (hex.length !== 8) {
    throw new Error('Invalid hex color format. Use 6 or 8 hex digits.');
  }

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const a = opacity != null ? opacity : parseInt(hex.slice(6, 8), 16) / 255;

  return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
}
