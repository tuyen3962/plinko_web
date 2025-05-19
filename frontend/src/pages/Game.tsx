import { useEffect, useRef, useState } from "react";
import { Button } from "../components/ui";
import { BallManager } from "../game/classes/BallManager";
import { outcomes } from "../game/outcomes";
import { calculateRatioHeight, obstacleRows, sinkHeight } from "../game/constants";

const TOTAL_DROPS = 16;

const MULTIPLIERS: {[ key: number ]: number} = {
  0: 16,
  1: 9,
  2: 2,
  3: 1.4,
  4: 1.4,
  5: 1.2,
  6: 1.1,
  7: 1,
  8: 0.5,
  9: 1,
  10: 1.1,
  11: 1.2,
  12: 1.4,
  13: 1.4,
  14: 2,
  15: 9,
  16: 16
}

export function Game() {
  const [ballManager, setBallManager] = useState<BallManager>();
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight);
  const canvasRef = useRef<any>();

  useEffect(() => {
    const totalHeight = 35 * obstacleRows + sinkHeight
    console.log('totalHeight', totalHeight)
    setCanvasHeight(totalHeight)
    if (canvasRef.current) {
      const resize = () => {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        // console.log('resized ', window.innerWidth, window.innerHeight)
      };
  
      resize(); // set initial size
      window.addEventListener('resize', resize);
    
      const ballManager = new BallManager(    
        canvasRef.current as unknown as HTMLCanvasElement,
        window.innerWidth, 
        window.innerHeight
      );
      setBallManager(ballManager);
      return () => window.removeEventListener('resize', resize);
    }
  }, [canvasRef]);

  function _dropBallOutcome() {
    let outcome = 0;
    const pattern = []
    for (let i = 0; i < TOTAL_DROPS; i++) {
        if (Math.random() > 0.5) {
            pattern.push("R")
            outcome++;
        } else {
            pattern.push("L")
        }
    }

    console.log("Multiplier " ,MULTIPLIERS[outcome])

    const possiblieOutcomes = outcomes[outcome];
    return possiblieOutcomes[Math.floor(Math.random() * possiblieOutcomes.length || 0)]
    // res.send({
    //     point: possiblieOutcomes[Math.floor(Math.random() * possiblieOutcomes.length || 0)],
    //     multiplier,
    //     pattern
    // });
  }

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center w-full h-full">
      <canvas ref={canvasRef} style={{
        width: window.innerWidth,
        // height: canvasHeight
      }}></canvas>
      <Button
        className="px-10 mb-4"
        onClick={async () => {
          // const response = await axios.post(`${baseURL}/game`, {
          //   data: 1,
          // });
          if (ballManager) {
            const result = _dropBallOutcome();
            ballManager.addBall(result);
          }
        }}
      >
        Add ball
      </Button>
    </div>
  );
}
