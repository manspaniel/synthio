import { TextInput } from "technic";
import { Input } from "../components/ui/Input";
import type { Control } from "../controls";

type Options = {
  scale?: number;
  min?: number;
  max?: number;
};

export function string(
  value: string,
  options?: Options
): Control<string, Options> {
  return {
    value: value,
    options: options || {},
    component: ({ value, onChange, options }) => {
      return <TextInput type="text" value={value} onValueChange={onChange} />;
    },
  };
}
