import create from "zustand";
import { useConfigValue } from "./useConfig";
import { useOptions } from "./useOptions";

export function useCanvasSize() {
  const options = useConfigValue("canvas") ?? {
    width: 1000,
    height: 1000,
    useDPR: true,
    resizable: true,
  };
  const set = useOptions((store) => store.setCanvasSize);
  const width = useOptions((store) => store.canvasWidth);
  const height = useOptions((store) => store.canvasHeight);

  return {
    width: width ?? options.width,
    height: height ?? options.height,
    useDPR: options.useDPR,
    set,
  };
}
