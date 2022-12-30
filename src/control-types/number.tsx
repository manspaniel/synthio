import { NumberInput } from "technic";
import { Input } from "../components/ui/Input";
import type { Control } from "../controls";

type Options = {
  scale?: number;
  min?: number;
  max?: number;
  step?: number;
};

export function number(
  value: number,
  options?: Options
): Control<number, Options> {
  return {
    value,
    options: options || {},
    component: ({ value, onChange, options }) => {
      return (
        <NumberInput
          scale={options.scale}
          step={options.step}
          min={options.min}
          max={options.max}
          value={value}
          onValueChange={onChange}
          stretch
        />
        // <Input
        //   type="number"
        //   dragScale={options.scale}
        //   draggableNumber
        //   value={value}
        //   step={options.step}
        //   min={options.min}
        //   max={options.max}
        //   onChange={(e) => onChange(e.currentTarget.valueAsNumber)}
        // />
      );
    },
  };
}