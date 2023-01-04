import { MutableRefObject, useEffect } from "react";
import create from "zustand";

type Store = {
  canvas: HTMLCanvasElement | null;
  setCanvas(canvas: HTMLCanvasElement | null): void;
};

export const useCanvasStore = create<Store>((set, get) => ({
  canvas: null,
  setCanvas(canvas) {
    set({ canvas });
  },
}));

// export const useCanvasSetter = (
//   ref: MutableRefObject<HTMLCanvasElement | null> | HTMLCanvasElement
// ) => {
//   const setCanvas = useCanvasStore((store) => store.setCanvas);
//   useEffect(() => {
//     if (ref instanceof HTMLCanvasElement) {
//       setCanvas(ref);
//     } else if (ref) {
//       setCanvas(ref.current);
//     }
//   }, [ref]);
//   return setCanvas;
// };

export const useCanvasGetter = () => {
  return () => useCanvasStore.getState().canvas;
};
