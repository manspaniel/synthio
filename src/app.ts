import { Schema, SchemaValues } from "./controls";
import { Clock } from "./hooks/useClock";

export interface AppContext {
  title(value: string): void;
  tweaks<S extends Schema>(schema: S): SchemaValues<S>;
  drawLoop: (fn: () => void) => void;
  clock: Clock;
  viewport(viewportOpts: {
    width: number;
    height: number;
    canResize?: boolean;
    canZoom?: boolean;
  }): void;
  timeControl(timeOpts: {
    duration: number;
    fps: number;
    deterministic: boolean;
  }): void;
  debug(name: string, value: any): void;
  canvas(canvas: HTMLCanvasElement): void;
  onResize: (fn: () => void) => void;
  size: { width: number; height: number };
}
