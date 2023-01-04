import { useEffect, useRef } from "react";
import create from "zustand";

type FrameHandler = () => void | (() => void);

type Store = {
  frameHandlers: FrameHandler[];
  addHandler: (handler: FrameHandler) => () => void;
};

export const useFrameHandlers = create<Store>((set, get) => ({
  frameHandlers: [],
  addHandler: (handler) => {
    set((state) => ({
      frameHandlers: [...state.frameHandlers, handler],
    }));
    return () => {
      set((state) => ({
        frameHandlers: state.frameHandlers.filter((h) => h !== handler),
      }));
    };
  },
}));

let cleanup: ((() => {}) | undefined)[] = [];

export function useFrame(handler: FrameHandler) {
  const addHandler = useFrameHandlers((state) => state.addHandler);
  const ref = useRef<FrameHandler>(handler);
  ref.current = handler;
  render();
  useEffect(() => {
    return addHandler(() => ref.current());
  }, []);

  render();
}

function render() {
  cleanup.forEach((c) => c?.());
  useFrameHandlers.getState().frameHandlers.forEach((handler, i) => {
    cleanup[i] = handler() as any;
  });
}

export function useRenderFunction() {
  return render;
}
