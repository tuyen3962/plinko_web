import { useEffect, useRef, useState } from "react";
import { BallManager } from "../game/service/BallManager";
import { WIDTH } from "../game/constants";
import { pad } from "../game/padding";

export function Simulation() {
    const canvasRef = useRef<any>();
    const plinkBackgroundRef = useRef<any>();
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
        12: [],
        // 13: [],
        // 14: [],
        // 15: [],
        // 16: [],
        // 17: [],
    });

    async function simulate(ballManager: BallManager) {
        let i = 0;
        while (1) {
          i++;
            ballManager.addBall(pad(window.innerWidth / 2 + 20 * (Math.random() - 0.5)));
        await new Promise((resolve) => setTimeout(resolve, 200));
        }
    }

    useEffect(() => {
        if (canvasRef.current && plinkBackgroundRef.current) {
            const resize = () => {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
                // console.log('resized ', window.innerWidth, window.innerHeight)
            };

            resize(); // set initial size
            window.addEventListener('resize', resize);
            const ballManager = new BallManager(
                canvasRef.current as unknown as HTMLCanvasElement,
                plinkBackgroundRef.current as unknown as HTMLCanvasElement,
                window.innerWidth,
                window.innerHeight,
                (index: number, startX?: number) => {
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
    }, [canvasRef, plinkBackgroundRef]);

    return (
        <div className="flex flex-col lg:flex-row  items-center justify-between h-screen">
            <div className="flex mx-16 flex-col justify-center pt-10">
                {JSON.stringify(outputs, null, 2)}
            </div>
            {/* <div className="flex flex-col items-center justify-center">
                <canvas ref={canvasRef} style={{
                    width: window.innerWidth,
                    height: window.innerHeight
                }}></canvas>
            </div> */}
            <div style={{
                position: 'relative',
                width: window.innerWidth,
                height: window.innerHeight,
            }}>
                <canvas
                width={window.innerWidth}
                height={window.innerHeight}
                ref={plinkBackgroundRef} style={{
                    width: window.innerWidth,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 0,
                    pointerEvents: 'none', // Optional: so clicks pass through

                }}></canvas>
                <canvas ref={canvasRef}
                    width={window.innerWidth}
                    height={window.innerHeight}
                    style={{
                        width: window.innerWidth,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 1, // Foreground layer
                        pointerEvents: 'none', // Optional: so clicks pass through
                }}></canvas>
            </div>
        </div>
    );
}
