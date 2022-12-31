import { useGenerateStore } from "../../hooks/useGenerate";
import { CanvasSizer } from "../tools/CanvasSizer";
import { Generate } from "../tools/Generate";
import { Timer } from "../tools/Timer";
import { Zoomer } from "../tools/Zoomer";
import { Depth, styled, Toolbar } from "technic";
import { Exporter } from "../tools/Exporter";

export function TopBar() {
  const hasGenerator = useGenerateStore((store) => !!store.generator);
  return (
    <Wrapper>
      <Depth level={2}>
        <Toolbar size="md">
          {hasGenerator && <Generate />}
          <Toolbar.Spacer />
          <Timer />
          <Toolbar.Spacer />
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
