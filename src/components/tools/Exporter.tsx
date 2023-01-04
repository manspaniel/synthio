import { Button, NumberInput, Popover, Toolbar } from "technic";
import { useCanvasGetter } from "../../hooks/useCanvas";
import { useClock } from "../../hooks/useClock";
import { useConfigValue } from "../../hooks/useConfig";
import { useOptions } from "../../hooks/useOptions";
import { useRecording } from "../../hooks/useRecording";
import { downloadFile } from "../../util/download-file";

export function Exporter() {
  const zoom = useOptions((ops) => ops.zoom);
  const zoomTo = useOptions((ops) => ops.zoomTo);
  const panTo = useOptions((ops) => ops.panTo);
  const allowRecording = useConfigValue("recording");
  const recording = useRecording();
  const setTime = useOptions((ops) => ops.setTime);

  const getCanvas = useCanvasGetter();
  const clock = useClock();

  const name = useConfigValue("title");

  return (
    <Toolbar.Group>
      <Toolbar.Heading>Export</Toolbar.Heading>
      {recording.recording ? (
        <>
          <div>Recording...</div>
          <Button onClick={() => recording.setRecording(false)}>Stop</Button>
        </>
      ) : (
        <>
          {allowRecording !== false && (
            <Button
              onClick={() => {
                setTime(0);
                recording.setRecording(true);
              }}
            >
              Record...
            </Button>
          )}
          <Button
            onClick={() => {
              const canvas = getCanvas();
              if (canvas) {
                const uri = canvas.toDataURL("image/png");
                downloadFile(`${name}_${new Date().toString()}.png`, uri);
              }
            }}
          >
            Capture
          </Button>
        </>
      )}
    </Toolbar.Group>
  );
}
