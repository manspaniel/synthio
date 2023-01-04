import { useEffect } from "react";
import create from "zustand";

type DebugValue = any;

type Store = {
  debugValues: Record<string, DebugValue>;
  setValue(id: string, value: DebugValue): void;
  removeValue(id: string): void;
  clearValues(): void;
};

export const useDebugStore = create<Store>((set, get) => ({
  debugValues: {},
  setValue(id, value) {
    set({
      debugValues: {
        ...get().debugValues,
        [id]: value,
      },
    });
  },
  removeValue(id) {
    const newValues = {
      ...get().debugValues,
    };
    delete newValues[id];
    set({
      debugValues: newValues,
    });
  },
  clearValues() {
    set({
      debugValues: {},
    });
  },
}));

// export function useDebug(id: string, value?: DebugValue) {
//   const setValue = useDebugStore((store) => store.setValue);
//   const removeValue = useDebugStore((store) => store.removeValue);

//   useEffect(() => {
//     return () => {
//       removeValue(id);
//     };
//   }, [id]);

//   useEffect(() => {
//     setValue(id, value);
//   }, [id, value]);

//   return (value: DebugValue) => {
//     requestAnimationFrame(() => {
//       setValue(id, value);
//     });
//   };
// }

export function useAllDebugs() {
  return useDebugStore((store) => store.debugValues);
}
