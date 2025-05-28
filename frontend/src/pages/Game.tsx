import { useEffect, useRef, useState } from "react";
import { BallManager } from "../game/classes/BallManager";
import { Button } from "../components/ui";
import { outcomes } from "../game/outcomes";

const TOTAL_DROPS = 13;

const MULTIPLIERS: { [key: number]: number } = {
  0: 10,
  1: 4,
  2: 3,
  3: 1.9,
  4: 1.2,
  5: 0.9,
  6: 0.7,
  7: 0.9,
  8: 1.2,
  9: 1.9,
  10: 3,
  11: 4,
  12: 10
};

export function Game() {
  const [ballManager, setBallManager] = useState<BallManager>();
  const canvasRef = useRef<any>();
  const obstacleCanvasRef = useRef<any>();
  const sinkCanvasRef = useRef<any>();

  useEffect(() => {
    (window as any).dropBall = () => {
      if (ballManager) {
        const result = _dropBallOutcome();
        ballManager.addBall(result);
      }
    };

    (window as any).setSinkColor = (color: string) => {
      if (ballManager) {
        ballManager.setSinkColor(color);
      }
    };

    (window as any).setSinkMultiplier = (multiplier: number[]) => {
      if (ballManager) {
        ballManager.setSinkMultiplier(multiplier);
      }
    };

    window.scrollTo({
      top: 55
    });

  }, [ballManager]);

  useEffect(() => {
    if (canvasRef.current) {
      const ballManager = new BallManager(
        canvasRef.current as unknown as HTMLCanvasElement,
        obstacleCanvasRef.current as unknown as HTMLCanvasElement,
        sinkCanvasRef.current as unknown as HTMLCanvasElement
      );
      setBallManager(ballManager);
    }
  }, [canvasRef, obstacleCanvasRef, sinkCanvasRef]);

  function _dropBallOutcome() {
    let outcome = 0;
    const pattern = [];
    for (let i = 0; i < TOTAL_DROPS; i++) {
      if (Math.random() > 0.5) {
        pattern.push("R");
        outcome++;
      } else {
        pattern.push("L");
      }
    }

    console.log("Multiplier ", MULTIPLIERS[outcome]);

    const possiblieOutcomes = outcomes[outcome];
    return possiblieOutcomes[
      Math.floor(Math.random() * possiblieOutcomes.length || 0)
    ];
  }

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center">
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

      <Button
        className="px-10 mb-4"
        onClick={async () => {
          const response = _dropBallOutcome();
          if (ballManager) {
            ballManager.addBall(response);
          }
        }}
      >
        Add ball
      </Button>
    </div>
  );
}
