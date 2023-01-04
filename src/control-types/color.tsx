import { ColorInput } from "technic";
import type { Control } from "../controls";

type Options = {
  formats?: ("hsl" | "rgb" | "hex")[];
  alpha?: boolean;
};

export function color(
  value: string,
  options?: Options
): Control<string, Options> {
  return {
    value,
    options: options || {},
    component: ({ value, onChange, options }) => {
      return (
        <ColorInput
          value={value}
          onValueChange={onChange}
          stretch
          formats={options.formats}
          alpha={options.alpha}
          size="sm"
        />
      );
    },
  };
}
