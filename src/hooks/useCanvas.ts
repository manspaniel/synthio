import { MutableRefObject, useEffect } from "react";
import create from "zustand";

type Store = {
  canvas: {
    value: HTMLCanvasElement | null;
  };
  setCanvas(canvas: HTMLCanvasElement | null): void;
};

const useCanvasStore = create<Store>((set, get) => ({
  canvas: {
    value: null,
  },
  setCanvas(canvas) {
    get().canvas.value = canvas;
  },
}));

export const useCanvasSetter = (
  ref: MutableRefObject<HTMLCanvasElement | null>
) => {
  const setCanvas = useCanvasStore((store) => store.setCanvas);
  useEffect(() => {
    if (ref) {
      setCanvas(ref.current);
    }
  }, [ref]);
  return setCanvas;
};

export const useCanvasGetter = () => {
  const canvas = useCanvasStore((store) => store.canvas);
  return () => canvas.value;
};
