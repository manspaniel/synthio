import { useCanvasSize } from "../../hooks/useCanvasSize";
import { useConfig, useConfigValue } from "../../hooks/useConfig";
import { useGenerateStore } from "../../hooks/useGenerate";
import { CanvasSizer } from "../tools/CanvasSizer";
import { Generate } from "../tools/Generate";
import { Timer } from "../tools/Timer";
import { Zoomer } from "../tools/Zoomer";
// import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import {
  Depth,
  styled,
  Toolbar,
  // ToolbarGroup,
  // ToolbarHeading,
  // ToolbarSpacer,
} from "technic";
import { Exporter } from "../tools/Exporter";

export function TopBar() {
  const hasGenerator = useGenerateStore((store) => !!store.generator);
  return (
    <Wrapper>
      <Depth level={2}>
        <Toolbar size="md">
          <CanvasSizer />
          <Zoomer />
          <Timer />
          {hasGenerator && <Generate />}
          <Exporter />
        </Toolbar>
      </Depth>
    </Wrapper>
  );
}

const Wrapper = styled("div", {
  position: "relative",
  top: 0,
  left: 0,
  right: 0,
  borderBottom: "1px solid $border1",
  display: "flex",
  alignItems: "center",
  flex: "0 0 auto",
});
