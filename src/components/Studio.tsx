import { useEffect, useState } from "react";
import { styled } from "technic";
import { Options, useConfig } from "../hooks/useConfig";
import { usePlayback } from "../hooks/usePlayback";
import { useRecordingHandler } from "../hooks/useRecording";
import { ThemeProvider } from "../theme";
import { CanvasDisplay } from "./panels/CanvasDisplay";
import { Controls } from "./panels/Controls";
import { TopBar } from "./panels/TopBar";
import { Debuggers } from "./tools/Debuggers";

type Props = Options;

export function Studio(props: Props) {
  const [ready, setReady] = useState(false);
  const setOptions = useConfig((store) => store.setOptions);

  useEffect(() => {
    setOptions(props);
  }, [props]);

  usePlayback();
  useRecordingHandler();

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return null;
  return (
    <ThemeProvider>
      <Wrapper>
        {props.ui && <TopBar />}
        <Main>
          {props.tweaks && <Controls />}
          {props.debuggers && <Debuggers />}
          <CanvasDisplay />
        </Main>
      </Wrapper>
    </ThemeProvider>
  );
}

const Wrapper = styled("div", {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "$bg1",
  color: "$bg1-text1",
  display: "flex",
  flexDirection: "column",
});

const Main = styled("div", {
  position: "relative",
  flex: "1 1 auto",
});
