import { ComponentProps, ReactNode, useEffect, useRef } from "react";
import { styled, css } from "technic";

type Props = ComponentProps<typeof StyledInput> & {
  // Enable dragging to change this value?
  draggableNumber?: boolean;
  // In units per pixel
  dragScale?: number;
  suffix?: ReactNode;
  prefix?: ReactNode;
};

export function Input({
  draggableNumber,
  dragScale,
  suffix,
  prefix,
  size,
  ...props
}: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const onChangeRef = useRef<Props["onChange"] | null>(null);
  onChangeRef.current = props.onChange;

  useEffect(() => {
    const el = dragRef.current!;
    const input = ref.current!;
    if (draggableNumber) {
      let dragging = false;
      let dragStartValue = 0;
      let dragStartClient = 0;
      const onPointerDown = (e: PointerEvent) => {
        if (!e.button) {
          dragging = true;
          e.preventDefault();
          e.stopPropagation();
          el.setPointerCapture(e.pointerId);
          dragStartValue = parseFloat(input.value);
          dragStartClient = e.clientX;
        }
      };
      const onPointerMove = (e: PointerEvent) => {
        if (dragging) {
          e.preventDefault();
          e.stopPropagation();
          const dx = e.clientX - dragStartClient;
          // debugger;
          const step = typeof props.step === "number" ? props.step : 0.01;
          let nextValue = dragStartValue + dx * (dragScale ?? 0.01);
          if (step) {
            nextValue = Math.round(nextValue / step) * step;
            nextValue = Math.max(
              isNaN(Number(props.min)) ? -Infinity : Number(props.min),
              Math.min(
                isNaN(Number(props.max)) ? Infinity : Number(props.max),
                nextValue
              )
            );
          }

          // Hack to set the value and trigger the change event
          const setValue = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            "value"
          )!.set!;
          setValue.call(input, nextValue.toString().replace(/0+000[0-9]$/, ""));
          input.dispatchEvent(new Event("change", { bubbles: true }));
        }
      };
      const onPointerUp = (e: PointerEvent) => {
        if (e.button === 0) {
          dragging = false;
          e.preventDefault();
          e.stopPropagation();
          el.releasePointerCapture(e.pointerId);
        }
      };
      el.addEventListener("pointerdown", onPointerDown, { capture: true });
      el.addEventListener("pointermove", onPointerMove, { capture: true });
      el.addEventListener("pointerup", onPointerUp, { capture: true });
      return () => {
        el.removeEventListener("pointerdown", onPointerDown, { capture: true });
        el.removeEventListener("pointermove", onPointerMove, { capture: true });
        el.removeEventListener("pointerup", onPointerUp, { capture: true });
      };
    }
  }, [draggableNumber, dragScale, props.step]);

  return (
    <Wrapper size={size as any} draggableNumber={draggableNumber}>
      {draggableNumber && <DragHandle ref={dragRef}>v</DragHandle>}
      {prefix && <ExtraText>{prefix}</ExtraText>}
      <StyledInput ref={ref} {...props} />
      {suffix && <ExtraText>{suffix}</ExtraText>}
    </Wrapper>
  );
}

export const inputStyle = css({
  backgroundColor: "$border",
  font: "inherit",
  $$borderColor: "$colors$border",
  border: "1px solid $$borderColor",
  borderRadius: "4px",
  fontSize: "12px",
  color: "$text",
  height: "24px",
  outline: "none",
  flex: "1 1 auto",
  "&:hover, &:focus-within": {
    $$borderColor: "$colors$highlight",
  },
});

export const Wrapper = styled("label", inputStyle, {
  $$width: "auto",
  appearance: "none",
  display: "inline-flex",
  alignItems: "center",
  position: "relative",
  overflow: "hidden",
  padding: "0 $2",
  "&:hover": {
    backgroundColor: "$border",
  },
  cursor: "text",
  variants: {
    size: {
      1: { $$width: "1em" },
      2: { $$width: "2em" },
      3: { $$width: "3em" },
      4: { $$width: "4em" },
      5: { $$width: "5em" },
      6: { $$width: "6em" },
      7: { $$width: "7em" },
      8: { $$width: "8em" },
      9: { $$width: "9em" },
      10: { $$width: "10em" },
    },
    draggableNumber: {
      true: {
        paddingLeft: "calc($2 + 10px)",
      },
    },
  },
});

export const StyledInput = styled("input", {
  width: "$$width",
  appearance: "none",
  flex: "1 1 auto",
  backgroundColor: "transparent !important",
  font: "inherit",
  border: "none",
  padding: 0,
  margin: 0,
  outline: "none !important",
  color: "inherit",
  cursor: "inherit",
  "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
    appearance: "none",
  },
});

const ExtraText = styled("span", {
  opacity: 0.8,
  flex: "0 0 auto",
});

const DragHandle = styled("span", {
  position: "absolute",
  left: 0,
  top: 0,
  bottom: 0,
  flex: "0 0 auto",
  width: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "$$borderColor",
  cursor: "col-resize",
});
