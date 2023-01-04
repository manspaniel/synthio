import create from "zustand";
import { ReactElement, useEffect, useMemo } from "react";
import { useOptions } from "./hooks/useOptions";
import { persist } from "zustand/middleware";
import { URIParamterStorage } from "./util/uriStorage";

export type Control<TValue = any, TOptions = any> = {
  value: TValue;
  options: TOptions;
  component: (props: {
    value: TValue;
    onChange: (value: TValue) => void;
    options: TOptions;
  }) => ReactElement;
};

export type Schema = {
  [key: string]: Control<any>;
};

type ControlValue<T extends Control<any>> = T["value"];

export type SchemaValues<S extends Schema> = {
  [K in keyof S]: ControlValue<S[K]>;
};

export function useControls<S extends Schema>(schema: S): SchemaValues<S> {
  const values = useMemo(() => {
    const initial = {} as SchemaValues<S>;
    for (let key in schema) {
      initial[key] = schema[key].value;
    }
    return initial;
  }, []);

  useEffect(() => {
    return useInputStore.getState().addGroup({ schema });
  }, [schema]);

  useEffect(() => {
    return useInputStore.subscribe((state) => {
      for (let key in schema) {
        if (state.values[key] !== undefined) {
          values[key] = state.values[key];
        }
      }
    });
  }, [schema]);

  useEffect(() => {
    for (let key in schema) {
      if (values[key] === undefined) {
        values[key] = schema[key].value;
      }
    }
  });

  return values;
}

type Group = {
  title?: string;
  schema: Schema;
};

type InputStore = {
  values: Record<string, any>;
  groups: { title?: string; schema: Schema }[];
  addGroup: (group: Group) => () => void;
  updateValue: (key: string, value: any) => void;
};

export const useInputStore = create<InputStore>()(
  persist(
    (set, get) => ({
      values: {},
      groups: [],
      addGroup(group) {
        set((state) => ({
          groups: [...state.groups, group],
        }));
        return () => {
          set((state) => ({
            groups: state.groups.filter((g) => g !== group),
          }));
        };
      },
      updateValue(key, value) {
        useOptions.setState({
          needsRedraw: true,
        });
        set((state) => ({
          values: { ...state.values, [key]: value },
        }));
      },
    }),
    {
      name: "synthio-inputs",
      getStorage() {
        return new URIParamterStorage();
      },
      partialize(state) {
        return {
          values: state.values,
        };
      },
    }
  )
);
