import { useEffect } from "react";
import { useRenderFunction } from "./useFrame";
import { useGenerateStore, useGeneratorInstance } from "./useGenerate";
import { useOptions } from "./useOptions";
import { useRecording } from "./useRecording";

export function usePlayback() {
  const recording = useRecording((store) => store.recording);
  // const duration = useOptions((store) => store.duration);

  // const needsGenerate = useGenerateStore((store) => store.needsGenerate);

  const renderFrame = useRenderFunction();
  // const generator = useGeneratorInstance();

  useEffect(() => {
    // if (needsGenerate && generator) {
    //   generator.generate();
    //   return () => {
    //     generator.cancel();
    //   };
    // }
    if (!recording) {
      let raf = 0;
      let lastTick = 0;
      let lastFrame = -1;
      const schedule = () => {
        raf = requestAnimationFrame((time) => {
          let dt = lastTick === 0 ? 0 : (time - lastTick) / 1000;
          lastTick = time;
          const state = useOptions.getState();
          let needsRedraw = state.needsRedraw;
          if (state.playing) {
            const nextTime = state.time + dt;
            let frame = Math.floor(nextTime * state.fps) / state.fps;
            if (frame !== lastFrame) {
              lastFrame = frame;
              needsRedraw = true;
            }
            useOptions.setState({
              time: state.loop ? nextTime % state.duration : nextTime,
              playing: nextTime < state.duration || state.loop,
              needsRedraw: false,
            });
          }
          if (needsRedraw) {
            renderFrame();
          }
          if (state.needsRedraw) {
            useOptions.setState({
              needsRedraw: false,
            });
          }
          schedule();
        });
      };
      schedule();
      return () => cancelAnimationFrame(raf);
    }
  }, [recording]);

  useEffect(() => {
    // Redraw whenever options change
    return useOptions.subscribe(() => {
      if (useOptions.getState().playing) return;
      renderFrame();
    });
  });
}
