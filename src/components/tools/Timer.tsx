import { MdPause, MdPlayArrow, MdReplay } from "react-icons/md";
import { TimeSlider } from "../ui/TimeSlider";
import { useOptions } from "../../hooks/useOptions";
import { Button, NumberInput, Toolbar } from "technic";

export function Timer() {
  const timing = useOptions((store) => ({
    fps: store.fps,
    time: store.time,
    duration: store.duration,
    playing: store.playing,
    setTime: store.setTime,
    setFPS: store.setFPS,
    setDuration: store.setDuration,
    setPlaying: store.setPlaying,
  }));

  return (
    <Toolbar.Group>
      <Toolbar.Heading>Time</Toolbar.Heading>
      <NumberInput
        suffix="fps"
        type="number"
        min={1}
        max={100}
        step={1}
        value={timing.fps}
        onChange={(e) => {
          timing.setFPS(e.currentTarget.valueAsNumber || 1);
        }}
      />
      <NumberInput
        suffix="seconds"
        type="number"
        min={0.5}
        max={100}
        step={0.5}
        width={"5em"}
        value={timing.duration}
        onChange={(e) => {
          timing.setDuration(e.currentTarget.valueAsNumber);
        }}
      />
      {/* <Input
        size={3}
        suffix="fps"
        type="number"
        min={0.5}
        max={100}
        step={0.5}
        value={timing.fps}
        onChange={(e) => {
          timing.setFPS(e.currentTarget.valueAsNumber);
        }}
      />
      <Input
        size={3}
        suffix="seconds"
        type="number"
        min={0.5}
        max={100}
        step={0.5}
        value={timing.duration}
        onChange={(e) => {
          timing.setDuration(e.currentTarget.valueAsNumber);
        }}
      /> */}
      <TimeSlider
        fps={timing.fps}
        value={timing.time}
        onChange={timing.setTime}
        duration={timing.duration}
      />
      <Button
        onClick={() => {
          timing.setTime(0);
        }}
      >
        <MdReplay />
      </Button>
      <Button
        onClick={() => {
          timing.setPlaying(!timing.playing);
        }}
      >
        {timing.playing ? <MdPause /> : <MdPlayArrow />}
      </Button>
    </Toolbar.Group>
  );
}
