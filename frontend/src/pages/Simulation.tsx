import { useEffect, useRef, useState } from "react";
import { BallManager } from "../game/classes/BallManager";
import { WIDTH } from "../game/constants";
import { pad } from "../game/padding";

export function Simulation() {
  const canvasRef = useRef<any>();
  const obstacleCanvasRef = useRef<any>();
  const sinkCanvasRef = useRef<any>();

  let [outputs, setOutputs] = useState<{ [key: number]: number[] }>({
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: [],
    12: []
  });

  async function simulate(ballManager: BallManager) {
    let i = 0;
    while (1) {
      i++;
      ballManager.addBall(pad(WIDTH / 2 + 20 * (Math.random() - 0.5)));
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }

  useEffect(() => {
    if (canvasRef.current) {
      const ballManager = new BallManager(
        canvasRef.current as unknown as HTMLCanvasElement,
        obstacleCanvasRef.current as unknown as HTMLCanvasElement,
        sinkCanvasRef.current as unknown as HTMLCanvasElement,
        (index: number, multiplier: number | undefined, startX?: number) => {
          setOutputs((outputs: any) => {
            return {
              ...outputs,
              [index]: [...(outputs[index] as number[]), startX],
            };
          });
        }
      );
      simulate(ballManager);

      return () => {
        ballManager.stop();
      };
    }
  }, [canvasRef, obstacleCanvasRef, sinkCanvasRef]);

  return (
    <div className="flex flex-col lg:flex-row  items-center justify-between h-screen">
      <div className="flex mx-16 flex-col justify-center pt-10">
        {JSON.stringify(outputs, null, 2)}
      </div>
      <div className="flex flex-col items-center justify-center">
        {/* <canvas ref={canvasRef} width="800" height="800"></canvas> */}
        <div style={{
        position: 'relative',
        width: '800px',
        height: '800px',
      }}>
        <canvas ref={canvasRef} width="800" height="800" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0,
          pointerEvents: 'none', // Optional: so clicks pass through
        }}></canvas>
        <canvas ref={obstacleCanvasRef} width="800" height="800" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1, // Foreground layer
          pointerEvents: 'none', // Optional: so clicks pass through
        }}></canvas>
        <canvas ref={sinkCanvasRef} width="800" height="800" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 2, // Foreground layer
        }}></canvas>
      </div>
      </div>
    </div>
  );
}
