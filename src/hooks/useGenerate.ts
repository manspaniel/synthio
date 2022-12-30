import { useEffect, useState } from "react";
import create from "zustand";

type GeneratorFunction =
  | (() => Promise<any>)
  | (() => Iterator<number | null, any, undefined>)
  | (() => void);

type Store = {
  needsGenerate: boolean;
  hasGenerated: boolean;
  isGenerating: boolean;
  generationProgress: number | null;
  generator?: GeneratorFunction;
  setGenerator: (generator: GeneratorFunction) => void;
  update: (patch: Partial<Store>) => void;
};

export const useGenerateStore = create<Store>((set, get) => ({
  needsGenerate: true,
  hasGenerated: false,
  isGenerating: false,
  generationProgress: null,
  generator: undefined,
  setGenerator(generator) {
    set({ generator });
  },
  update(patch) {
    set({ ...patch });
  },
}));

export function useGenerate(generator: GeneratorFunction): boolean {
  const setGenerator = useGenerateStore((state) => state.setGenerator);
  useEffect(() => {
    setGenerator(generator);
  }, [generator]);

  return useGenerateStore((state) => state.isGenerating);
}

type GeneratorInstance = {
  generate(): Promise<void>;
  cancel(): void;
};

export function useGeneratorInstance(): GeneratorInstance {
  // const generator = useGenerateStore((store) => store.generator);
  const update = useGenerateStore((store) => store.update);
  const isGenerating = useGenerateStore((store) => store.isGenerating);
  const [promise, setPromise] = useState<{ resolve: () => void }>();

  useEffect(() => {
    if (!promise || !isGenerating) return;
    const generator = useGenerateStore.getState().generator;
    if (!generator) {
      promise.resolve();
      return;
    }
    let cancelled = false;
    let raf = 0;
    const result = generator() as any;
    if (result.next) {
      const schedule = () => {
        raf = requestAnimationFrame(async () => {
          const value = await result.next();
          if (cancelled) return;
          if (value.done) {
            update({
              needsGenerate: false,
              hasGenerated: true,
              isGenerating: false,
              generationProgress: null,
            });
            promise.resolve();
          } else if (typeof value.value === "number") {
            update({
              generationProgress: value.value,
            });
            schedule();
          } else {
            schedule();
          }
        });
      };
      schedule();
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [isGenerating, promise]);

  return {
    generate() {
      return new Promise((resolve) => {
        setPromise({ resolve });
        update({
          isGenerating: true,
        });
      });
    },
    cancel() {
      update({
        isGenerating: false,
      });
      setPromise(undefined);
    },
  };
}
