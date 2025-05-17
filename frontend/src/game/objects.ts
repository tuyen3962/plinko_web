import { Sink } from "./classes/Sink";
import { NUM_SINKS, obstacleRadius, sinkWidth } from "./constants";
import { pad } from "./padding";

export interface Obstacle {
    x: number;
    y: number;
    radius: number;
}

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
    14: 1.4,
    15: 2,
    16: 9,
    17: 16
}

export const createObstacles = (width: number): Obstacle[] => {
    const obstacles: Obstacle[] = [];
    const rows = 18;
    for (let row = 2; row < rows; row++) {
        const numObstacles = row + 1;
        const y = 0 + row * 35;
        const spacing = 28;
        for (let col = 0; col < numObstacles; col++) {
            const x = width / 2 - spacing * (row / 2 - col);
            obstacles.push({x: pad(x), y: pad(y), radius: obstacleRadius });
        }   
    }
    return obstacles;
}

export const createSinks = (screenWidth: number): Sink[] => {
    const sinks: Sink[] = [];
    const heightOfObstacles = 36 * 18;
    const SPACING = obstacleRadius * 2;

    for (let i = 0; i < NUM_SINKS; i++) {
      const x = screenWidth / 2 + sinkWidth * (i - Math.floor(NUM_SINKS/2)) - SPACING * 1.5;
      const y = heightOfObstacles;
      const width = sinkWidth;
      const height = width;
      sinks.push(new Sink(x, y, width, height, MULTIPLIERS[i+1], i));
    }

    return sinks;
}
