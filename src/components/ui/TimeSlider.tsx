import { ReactElement, useMemo } from "react";
import { inputStyle, styled } from "technic";
// import { inputStyle } from "./Input";

type Props = {
  duration: number;
  value: number;
  fps: number;
  onChange?: (value: number) => void;
};

export function TimeSlider(props: Props) {
  const ticks = useMemo(() => {
    const items: ReactElement[] = [];
    const interval = props.duration > 20 ? 5 : 1;
    for (let i = 1; i < Math.floor(props.duration); i += interval) {
      items.push(
        <span
          key={i}
          className="tick"
          style={{ "--tui--progress": i / props.duration } as any}
        ></span>
      );
    }
    return items;
  }, [props.fps, props.duration]);

  return (
    <Wrapper>
      <TimeLabel>{Number(props.value).toFixed(2)}</TimeLabel>
      <SliderWrapper>
        {ticks}
        <Slider
          type="range"
          value={props.value}
          max={props.duration}
          min={0}
          step={1 / props.fps}
          onChange={(e) => {
            props.onChange?.(e.currentTarget.valueAsNumber);
          }}
        />
      </SliderWrapper>
    </Wrapper>
  );
}

export const Wrapper = styled("div", inputStyle, {
  display: "flex",
  flex: "1 1 auto",
  alignItems: "center",
  overflow: "hidden",
});

const TimeLabel = styled("div", {
  padding: "0 $2",
  width: "5em",
  textAlign: "right",
});

export const SliderWrapper = styled("div", {
  backgroundColor: "$background",
  position: "relative",
  borderLeft: "2px solid $border1",
  height: "100%",
  ".tick": {
    position: "absolute",
    top: 0,
    left: "calc($$progress * 98.5%)",
    width: 1,
    height: 5,
    background: "$border2",
  },
});

export const Slider = styled("input", {
  appearance: "none",
  backgroundColor: "transparent",
  padding: 0,
  margin: 0,
  height: "100%",
  outline: "none",
  "&::-webkit-slider-thumb": {
    padding: 0,
    appearance: "none",
    width: "2px",
    height: "15px",
    borderRadius: "10px",
    backgroundColor: "white",
  },
});
