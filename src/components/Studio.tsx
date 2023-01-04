import { useEffect, useState } from "react";
import { styled } from "technic";
import { Options, useConfig, useConfigValue } from "../hooks/useConfig";
import { useMain } from "../hooks/useMain";
import { usePlayback } from "../hooks/usePlayback";
import { useRecordingHandler } from "../hooks/useRecording";
import { ThemeProvider } from "../theme";
import { BottomBar } from "./panels/BottomBar";
import { CanvasDisplay } from "./panels/CanvasDisplay";
import { Controls } from "./panels/Controls";
import { TopBar } from "./panels/TopBar";
import { Debuggers } from "./tools/Debuggers";

// type Props = Options;
type Props = {};

export function Studio(props: Props) {
  const [ready, setReady] = useState(false);
  // const setOptions = useConfig((store) => store.setOptions);

  const title = useConfigValue("title");

  useEffect(() => {
    document.title = title;
  }, [title]);

  // useEffect(() => {
  //   setOptions(props);
  // }, [props]);

  usePlayback();
  useRecordingHandler();

  useMain();

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return null;
  return (
    <ThemeProvider>
      <Wrapper>
        <TopBar />
        <Main>
          <Controls />
          <Debuggers />
          <CanvasDisplay />
        </Main>
        <BottomBar />
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
