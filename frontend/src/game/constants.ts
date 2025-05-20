import { pad } from "./padding";

export const WIDTH = 800;
export const HEIGHT = 800;
export const ballRadius = 8;
export const obstacleRadius = 4;

export const obstacleRows = 12;
export const gravity = pad(0.3);
export const horizontalFriction = 0.4;
export const verticalFriction = 0.8;

export const sinkWidth = 27;
export const sinkHeight = 18;
export const NUM_SINKS = 13;

export const sinkColorLowLevel = '#81B032A3';
export const sinkColorMediumLevel = '#CA8445A3';
export const sinkColorHighLevel = '#ED4D6EA3';


export const calculateRatioWidth = (width: number, screenWidth: number) => {
    return width * (screenWidth / WIDTH);
}

export const calculateRatioHeight = (height: number, screenHeight: number) => {
    return height * (screenHeight / HEIGHT);
}