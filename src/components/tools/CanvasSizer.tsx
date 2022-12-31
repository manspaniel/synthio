import {
  Popover,
  Button,
  Toolbar,
  PropertyList,
  PropertyItem,
  NumberInput,
} from "technic";
import { useCanvasSize } from "../../hooks/useCanvasSize";
import { useConfigValue } from "../../hooks/useConfig";
// import { Property, PropertyList } from "../ui/Property";
// import { ToolbarGroup, ToolbarHeading } from "../ui/Toolbar";

export function CanvasSizer() {
  const resizable = useConfigValue("canvas")?.resizable;
  const size = useCanvasSize();

  if (!resizable) {
    return null;
  }

  return (
    <Toolbar.Group>
      <Toolbar.Heading>Canvas</Toolbar.Heading>
      <Popover
        trigger={
          <Button>
            {size.width}x{size.height}
          </Button>
        }
      >
        <input
          type="text"
          style={{
            opacity: 0,
            position: "absolute",
            left: "-10px",
            width: 0,
            height: 0,
          }}
        />
        <PropertyList splitSize={0.5}>
          <PropertyItem label="Width">
            <NumberInput
              width={"5em"}
              value={size?.width}
              step={1}
              min={1}
              scale={3}
              onValueChange={(v) => {
                size.set(v, size.height);
              }}
            />
          </PropertyItem>
          <PropertyItem label="Height">
            <NumberInput
              width={"5em"}
              value={size?.height}
              step={1}
              scale={3}
              min={1}
              onValueChange={(v) => {
                size.set(size.width, v);
              }}
            />
          </PropertyItem>
        </PropertyList>
      </Popover>
    </Toolbar.Group>
  );
}
