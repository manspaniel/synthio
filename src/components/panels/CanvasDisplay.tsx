import { useEffect, useLayoutEffect, useRef } from "react";
import { styled } from "technic";
import { useCanvasSize } from "../../hooks/useCanvasSize";
import { useOptions } from "../../hooks/useOptions";
import { RenderDisplay } from "../RenderDisplay";

export function CanvasDisplay() {
  const container = useRef<HTMLDivElement>(null);

  const size = useCanvasSize();
  const zoom = useOptions((store) => store.zoom);
  const translation = useOptions((store) => store.translation);

  const zoomBy = useOptions((store) => store.zoomBy);
  const panTo = useOptions((store) => store.panTo);

  const eventTarget = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = eventTarget.current!;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomBy(e.deltaY * -0.01);
    };
    const panState = {
      panning: false,
      startX: 0,
      startY: 0,
      startClientX: 0,
      startClientY: 0,
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!e.button) {
        e.preventDefault();
        el.setPointerCapture(e.pointerId);
        panState.panning = true;
        panState.startX = useOptions.getState().translation.x;
        panState.startY = useOptions.getState().translation.y;
        panState.startClientX = e.clientX;
        panState.startClientY = e.clientY;
      }
    };
    const onPointerMove = (e: PointerEvent) => {
      if (panState.panning) {
        e.preventDefault();
        e.stopPropagation();
        const dx = e.clientX - panState.startClientX;
        const dy = e.clientY - panState.startClientY;
        panTo(panState.startX + dx, panState.startY + dy);
      }
    };
    const onPointerUp = (e: PointerEvent) => {
      if (panState.panning) {
        e.preventDefault();
        e.stopPropagation();
        el.releasePointerCapture(e.pointerId);
        panState.panning = false;
      }
    };
    el.addEventListener("wheel", onWheel);
    el.addEventListener("pointerdown", onPointerDown, { capture: true });
    el.addEventListener("pointermove", onPointerMove, { capture: true });
    el.addEventListener("pointerup", onPointerUp, { capture: true });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  useLayoutEffect(() => {
    const el = container.current!;
    el.style.setProperty("--width", size.width + "px");
    el.style.setProperty("--height", size.height + "px");
    el.style.setProperty("--panX", translation.x + "px");
    el.style.setProperty("--panY", translation.y + "px");
    el.style.setProperty("--zoom", String(zoom));
  });

  return (
    <Wrapper ref={eventTarget}>
      <Background>
        <CanvasContainer ref={container} style={{} as any}>
          <RenderDisplay seed={0} />
        </CanvasContainer>
      </Background>
    </Wrapper>
  );
}

const Wrapper = styled("div", {
  position: "absolute",
  inset: 0,
  overflow: "hidden",
});

const Background = styled("div", {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
});

const CanvasContainer = styled("div", {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform:
    "scale(var(--zoom)) translate(-50%, -50%) translate(var(--panX), var(--panY))",
  border: "1px solid $border",
  backgroundColor: "#333333",
  width: "calc(var(--width)",
  height: "calc(var(--height))",
  canvas: {
    width: "100%",
    height: "100%",
    imageRendering: "pixelated",
  },
  svg: {
    width: "100%",
    height: "100%",
  },
});
