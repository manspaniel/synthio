import { ReactNode } from "react";
import create from "zustand";
import { persist } from "zustand/middleware";

type OptionsStore = {
  // Canvas Settings
  translation: {
    x: number;
    y: number;
  };
  zoom: number;
  canvasWidth: number | undefined;
  canvasHeight: number | undefined;
  setCanvasSize: (width: number, height: number) => void;
  zoomBy: (value: number) => void;
  zoomTo: (value: number) => void;
  panTo: (x: number, y: number) => void;

  // Clock and Playback
  fps: number;
  time: number;
  duration: number;
  loop: boolean;
  playing: boolean;
  needsRedraw: boolean;
  setLooping: (loop: boolean) => void;
  setFPS: (duration: number) => void;
  setDuration: (time: number) => void;
  setTime: (time: number) => void;
  setPlaying: (playing: boolean) => void;

  // Recording
  // recording: boolean;
};

export const useOptions = create<OptionsStore>()(
  persist(
    (set, get) => ({
      // Canvas
      translation: {
        x: 0,
        y: 0,
      },
      zoom: 1,
      canvasWidth: 100,
      canvasHeight: 100,
      zoomBy: (zoom: number) => {
        set({
          zoom: Math.max(0.3, get().zoom + zoom),
        });
      },
      zoomTo: (zoom: number) => {
        set({
          zoom,
        });
      },
      panTo: (x: number, y: number) => {
        set({
          translation: {
            x,
            y,
          },
        });
      },
      setCanvasSize: (canvasWidth, canvasHeight) => {
        set({ canvasWidth, canvasHeight });
      },

      // Clock and playback
      fps: 30,
      time: 0,
      duration: 10,
      loop: true,
      playing: false,
      needsRedraw: false,
      setFPS(fps) {
        set({ fps });
      },
      setTime: (time: number) => {
        set({ time });
      },
      setDuration: (duration: number) => {
        set({ duration });
      },
      setLooping: (loop: boolean) => {
        set({ loop });
      },
      setPlaying: (playing: boolean) => {
        set({ playing });
      },
      setNeedsRedraw: (needsRedraw: boolean) => {
        set({ needsRedraw });
      },

      // Recording
      recording: false,
    }),
    {
      name: "g7-options",
    }
  )
);
