import { useEffect, useMemo } from "react";
import { useOptions } from "./useOptions";

export type Clock = {
  time: number;
  duration: number;
  fps: number;
  progress: number;
  frame: number;
  halt: () => void;
};

export function useClock() {
  const clock = useMemo<Clock>(
    () => ({
      time: 0,
      duration: 0,
      fps: 0,
      progress: 0,
      frame: 0,
      halt: () => {
        useOptions.getState().setPlaying(false);
      },
    }),
    []
  );

  useEffect(() => {
    useOptions.subscribe((state) => {
      clock.time = state.time;
      clock.duration = state.duration;
      clock.fps = state.fps;
      clock.progress = state.time / state.duration;
      clock.frame = Math.floor(clock.time * state.fps);
    });
  });

  return clock;
}
