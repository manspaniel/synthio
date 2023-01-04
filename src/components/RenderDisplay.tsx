import { useEffect, useRef } from "react";
import { styled } from "technic";
import { useCanvasGetter, useCanvasStore } from "../hooks/useCanvas";
import { useConfigValue } from "../hooks/useConfig";

type Props = {
  seed: number;
};

export function RenderDisplay(props: Props) {
  const container = useRef<HTMLDivElement>(null);
  const canvas = useCanvasStore((store) => store.canvas);

  useEffect(() => {
    if (!container.current || !canvas) return;
    container.current.appendChild(canvas);
    return () => {
      container.current?.removeChild(canvas);
    };
  }, [canvas]);

  return <Container ref={container} />;
}

const Container = styled("div", {
  canvas: {
    display: "block",
  },
});
