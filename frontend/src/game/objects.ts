import { Sink } from "./objects/Sink";
import { calculateRatioHeight, calculateRatioWidth, NUM_SINKS, obstacleRadius, obstacleRows, sinkHeight, sinkWidth } from "./constants";
import { pad } from "./padding";
import { Obstacle } from "./objects/Obstacle";

// export interface Obstacle {
//     x: number;
//     y: number;
//     radius: number;
// }

// export interface Sink {
//     x: number;
//     y: number;
//     width: number;
//     height: number;
//     multiplier?: number;
// }

const MULTIPLIERS: {[ key: number ]: number} = {
    1: 16,
    2: 9,
    3: 2,
    4: 1.4,
    5: 1.4,
    6: 1.2,
    7: 1.1,
    8: 1,
    9: 0.5,
    10: 1,
    11: 1.1,
    12: 1.2,
    13: 1.4,
    // 14: 1.4,
    // 15: 2,
    // 16: 9,
    // 17: 16
}

export const createObstacles = (ctx: CanvasRenderingContext2D, width: number, height: number): Obstacle[] => {
    const obstacles: Obstacle[] = [];
    for (let row = 2; row < obstacleRows; row++) {
        const numObstacles = row + 1;
        const y = row * calculateRatioHeight(35, height);
        const spacing = 30;
        for (let col = 0; col < numObstacles; col++) {
            const x = width / 2 - spacing * (row / 2 - col);
            obstacles.push(new Obstacle(ctx, pad(x), pad(y), obstacleRadius));
        }   
    }
    return obstacles;
}

export const createSinks = (ctx: CanvasRenderingContext2D, screenWidth: number, screenHeight: number): Sink[] => {
    const sinks: Sink[] = [];
    const heightOfObstacles = calculateRatioHeight(35 * obstacleRows, screenHeight);
    const SPACING = obstacleRadius * 2;
    for (let i = 0; i < NUM_SINKS; i++) {
      const x = screenWidth / 2 + sinkWidth * (i - Math.floor(NUM_SINKS/2)) - SPACING * 1.5;
      const y = heightOfObstacles;
      const width = sinkWidth;
      const height = sinkHeight;
      sinks.push(new Sink(ctx, x, y, width, height, MULTIPLIERS[i+1], i, screenWidth, screenHeight));
    }

    return sinks;
}
