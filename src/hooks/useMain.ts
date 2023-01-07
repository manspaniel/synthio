import create from "zustand";
import main from "../user-main";
import { AppContext } from "../app";
import { useEffect } from "react";
import { useClock } from "./useClock";
import { useFrameHandlers } from "./useFrame";
import { useConfig } from "./useConfig";
import { useCanvasStore } from "./useCanvas";
import { useRenderFunction } from "./useFrame";
import { useCanvasSize } from "./useCanvasSize";
import { useOptions } from "./useOptions";
import { useInputStore } from "../controls";
import { useDebugStore } from "./useDebug";

type MainFunction = (ctx: AppContext) => any;

type Store = {
  main: MainFunction;
  setMain: (main: MainFunction) => void;
};

const useMainStore = create<Store>((set) => ({
  main,
  setMain: (main) => set({ main }),
}));

export function useMain() {
  const mainFunction = useMainStore((state) => state.main);

  const drawFrame = useRenderFunction();

  const clock = useClock();

  useEffect(() => {
    let dead = false;
    const cleanups: (() => void)[] = [];

    let resizeHandlers = new Set<() => void>();

    const ctx: AppContext = {
      size: { width: 100, height: 100 },
      clock,
      title(newTitle) {
        if (dead) return;
        useConfig.setState({
          title: newTitle,
        });
      },
      debug(name, value) {
        if (dead) return;
        useDebugStore.getState().setValue(name, value);
      },
      drawLoop(fn) {
        if (dead) return;
        useFrameHandlers.getState().addHandler(fn);
      },
      timeControl(timeOpts) {},
      viewport(viewportOpts) {
        if (dead) return;
        useConfig.setState({
          canvas: {
            height: viewportOpts.height,
            width: viewportOpts.width,
            canResize: viewportOpts.canResize ?? true,
            canZoom: viewportOpts.canZoom ?? true,
          },
        });
      },
      tweaks(schema) {
        if (dead) return;
        const state = useInputStore.getState();
        cleanups.push(
          state.addGroup({
            schema,
            title: "Controls",
          })
        );
        const values = {} as any;
        for (let key in schema) {
          values[key] = state.values[key] ?? schema[key].value;
        }
        cleanups.push(
          useInputStore.subscribe((state) => {
            for (let key in schema) {
              if (state.values[key] !== undefined) {
                values[key] = state.values[key];
              }
            }
          })
        );
        return values as any;
      },
      canvas(canvas) {
        if (dead) return;
        useCanvasStore.setState({ canvas });
      },
      onResize(fn) {
        if (dead) return;
        resizeHandlers.add(fn);
        return () => {
          resizeHandlers.delete(fn);
        };
      },
    };

    let hasSentSize = false;
    const updateSize = (force: boolean = false) => {
      const conf = useConfig.getState();
      const opts = useOptions.getState();
      const newWidth = opts.canvasWidth ?? conf.canvas?.width ?? 100;
      const newHeight = opts.canvasHeight ?? conf.canvas?.height ?? 100;
      if (
        ctx.size.width !== newWidth ||
        ctx.size.height !== newHeight ||
        force
      ) {
        // hasSentSize = true;
        ctx.size.width = newWidth;
        ctx.size.height = newHeight;
        resizeHandlers.forEach((fn) => fn());
        drawFrame();
      }
    };

    cleanups.push(useOptions.subscribe(() => updateSize()));
    cleanups.push(useConfig.subscribe(() => updateSize()));

    useDebugStore.getState().clearValues();

    updateSize();

    if (mainFunction) {
      const promise = new Promise<void>(async (resolve, reject) => {
        try {
          await mainFunction(ctx);
          resolve();
        } catch (err) {
          reject(err);
        }
      });
      promise.then(() => {
        updateSize(true);
      });
    }

    return () => {
      dead = true;
      for (let cleanup of cleanups) {
        cleanup();
      }
    };
  }, [mainFunction]);
}

/**
 * Handle HMR — this is a bit of a hack, but it works.
 */
// @ts-ignore
if (import.meta.hot) {
  // @ts-ignore
  import.meta.hot.accept("../user-main", (newMain) => {
    useMainStore.setState({ main: newMain.default });
  });
}
