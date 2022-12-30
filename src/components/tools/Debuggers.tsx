import { isValidElement, useEffect, useRef, useState } from "react";
import { useAllDebugs } from "../../hooks/useDebug";
// import { styled } from "../../theme";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { useFrame } from "../../hooks/useFrame";
import { Accordion } from "../ui/Accordion";
import { FloatingPanel } from "../ui/FloatingPanel";
import { Depth, styled } from "technic";
import { ObjectInspector } from "react-inspector";

export function Debuggers() {
  const allDebugs = useAllDebugs();
  return (
    <Wrapper>
      {Object.entries(allDebugs).map(([id, value]) => (
        <DebugItem key={id} title={id} value={value} />
      ))}
    </Wrapper>
  );
}

const Wrapper = styled(FloatingPanel, {
  top: 10,
  left: 10,
  minWidth: 100,
  maxWidth: 500,
  overflow: "hidden",
});

type ItemProps = {
  title: string;
  value: any;
};

function DebugItem(props: ItemProps) {
  return (
    <Accordion collapseKey={props.title} title={props.title}>
      <DebugDisplay value={props.value} />
    </Accordion>
  );
}

// const Item = styled("div", {
//   background: "$panel",
//   borderBottom: "1px solid $border",
//   ".debug-title": {
//     fontWeight: "bold",
//     padding: "$2",
//     borderBottom: "1px solid $border",
//     display: "flex",
//     gap: "$2",
//     alignItems: "center",
//     cursor: "pointer",
//   },
//   "&:last-child": {},
// });

function DebugDisplay({ value }: { value: any }) {
  if (typeof value === "number") {
    return <Primitive>{value}</Primitive>;
  } else if (typeof value === "string") {
    return <Primitive>{JSON.stringify(value)}</Primitive>;
  } else if (typeof value === "boolean") {
    return <Primitive>{JSON.stringify(value)}</Primitive>;
  } else if (typeof value === "object") {
    if (value instanceof HTMLCanvasElement) {
      return <CanvasProxy canvas={value} />;
    } else if (isValidElement(value)) {
      return value;
    } else {
      return (
        <Primitive>
          <ObjectInspector expandLevel={1} theme="chromeDark" data={value} />
        </Primitive>
      );
    }
  }
  return null;
}

const Primitive = styled("div", {
  padding: "$2",
});

function CanvasProxy({ canvas }: { canvas: HTMLCanvasElement }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let raf = 0;
    const target = ref.current!;
    const schedule = () => {
      raf = requestAnimationFrame(() => {
        target.width = canvas.width;
        target.height = canvas.height;
        const ctx = target.getContext("2d")!;
        ctx.drawImage(canvas, 0, 0);
        schedule();
      });
    };
    schedule();
    return () => cancelAnimationFrame(raf);
  }, [canvas]);

  return (
    <div>
      <canvas ref={ref} />
    </div>
  );
}
