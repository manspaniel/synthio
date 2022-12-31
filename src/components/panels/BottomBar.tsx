import { CanvasSizer } from "../tools/CanvasSizer";
import { Zoomer } from "../tools/Zoomer";
import { Depth, styled, Toolbar } from "technic";

export function BottomBar() {
  return (
    <Wrapper>
      <Depth level={2}>
        <Toolbar size="md">
          <CanvasSizer />
          <Zoomer />
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
  borderTop: "1px solid $border1",
  display: "flex",
  alignItems: "center",
  flex: "0 0 auto",
});
