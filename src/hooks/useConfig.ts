import { ReactElement, ReactNode } from "react";
import create from "zustand";

export type Options = {
  title: string;
  timeControl?: boolean;
  recording?: boolean;
  ui?: boolean;
  debuggers?: boolean;
  tweaks?: boolean;
  canvas?: {
    width: number;
    height: number;
    canResize: boolean;
    canZoom: boolean;
  };
  // renderer?: () => ReactElement;
};

export const useConfig = create<Options>((set, get) => ({
  title: "Unnamed Artwork",
}));

export function useConfigValue<T extends keyof Options>(key: T): Options[T] {
  return useConfig((state) => state[key]);
}
