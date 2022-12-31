import { useEffect } from "react";
import create from "zustand";
import { downloadFile } from "../util/download-file";
import { WebMGLVideo } from "../util/webm";
import { useCanvasGetter } from "./useCanvas";
import { useConfigValue } from "./useConfig";
import { useRenderFunction } from "./useFrame";
import { useOptions } from "./useOptions";

type Store = {
  recording: boolean;
  setRecording: (recording: boolean) => void;
};

export const useRecording = create<Store>((set, get) => ({
  recording: false,
  setRecording(recording) {
    set({ recording });
  },
}));

export function useRecordingHandler() {
  const recording = useRecording();
  const getCanvas = useCanvasGetter();
  const renderFrame = useRenderFunction();

  const title = useConfigValue("title");

  useEffect(() => {
    if (recording.recording) {
      let state = useOptions.getState();
      let frame = -1;
      let totalFrames = Math.round(state.duration * state.fps);

      const video = new WebMGLVideo(state.fps, 1);

      let cancelled = false;

      const scheduleNextFrame = () => {
        requestAnimationFrame(() => {
          if (cancelled) return;
          state = useOptions.getState();
          frame++;
          if (frame > totalFrames) {
            console.log("Complete");
            recording.setRecording(false);
            useOptions.setState({
              playing: false,
            });
            const result = video.compile() as Blob;
            console.log("Result", result);
            const uri = URL.createObjectURL(result);
            downloadFile(`${title}_${new Date().toString()}.webm`, uri);
          } else {
            console.log("Frame", frame, "of", totalFrames);
            useOptions.setState({
              time: (frame / totalFrames) * state.duration,
            });
            renderFrame();
            const canvas = getCanvas();
            if (canvas) {
              const b = canvas.toDataURL("image/webp");
              video.add(b);
            }
            scheduleNextFrame();
          }
        });
      };

      scheduleNextFrame();

      return () => {
        cancelled = true;
      };
    }
  }, [recording.recording]);
}
