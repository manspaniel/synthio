import { useConfigValue } from "../hooks/useConfig";

type Props = {
  seed: number;
};

export function RenderDisplay(props: Props) {
  const Renderer = useConfigValue("renderer");
  return <div>{Renderer && <Renderer />}</div>;
}
