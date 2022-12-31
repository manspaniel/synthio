import { Button, NumberInput, Toolbar } from "technic";
import { useOptions } from "../../hooks/useOptions";
// import { ToolbarGroup, ToolbarHeading } from "../ui/Toolbar";

export function Zoomer() {
  const zoom = useOptions((ops) => ops.zoom);
  const zoomTo = useOptions((ops) => ops.zoomTo);
  const panTo = useOptions((ops) => ops.panTo);
  return (
    <Toolbar.Group>
      <Toolbar.Heading>Zoom</Toolbar.Heading>
      {/* <Input
        type="number"
        value={zoom}
        size={5}
        onChange={(e) => zoomTo(e.currentTarget.valueAsNumber)}
        min={0.2}
        max={10}
        step={0.02}
        draggableNumber
        dragScale={0.5}
      /> */}
      <NumberInput
        value={parseFloat(Number(zoom).toFixed(3))}
        width={"3em"}
        onChange={(e) => zoomTo(e.currentTarget.valueAsNumber)}
        min={0.2}
        max={10}
        step={0.02}
        scale={0.1}
        suffix="x"
      />
      <Button
        onClick={(e) => {
          zoomTo(1);
          panTo(0, 0);
        }}
      >
        Reset
      </Button>
    </Toolbar.Group>
  );
}
