import { ReactElement, ReactNode } from "react";
import create from "zustand";

export type Options = {
  title: string;
  timeControl?: boolean;
  recording?: boolean;
  ui?: boolean;
  debuggers?: boolean;
  tweaks?: boolean;
  multirender?: boolean;
  canvas?: {
    width: number;
    height: number;
    useDPR?: boolean;
    resizable: boolean;
  };
  renderer?: () => ReactElement;
};

type OptionsStore = {
  options: Options;
  setOptions: (options: Options) => void;
};

export const useConfig = create<OptionsStore>((set, get) => ({
  options: {
    title: "Unnamed Artwork",
  },
  setOptions: (options) => {
    set({ options });
  },
}));

export function useConfigValue<T extends keyof Options>(key: T): Options[T] {
  const { options } = useConfig();
  return options[key];
}
