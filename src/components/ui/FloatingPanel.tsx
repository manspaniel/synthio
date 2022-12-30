import { styled } from "technic";

export const FloatingPanel = styled("div", {
  position: "absolute",
  top: 10,
  zIndex: 10,
  background: "$bg1",
  border: "1px solid $border1",
  borderRadius: "$md",
  overflow: "hidden",
});
