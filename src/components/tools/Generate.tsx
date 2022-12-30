import { Button, Toolbar } from "technic";
import { useGenerateStore } from "../../hooks/useGenerate";
// import { Button } from "../ui/Button";
// import { ToolbarGroup, ToolbarHeading } from "../ui/Toolbar";

export function Generate() {
  const isGenerating = useGenerateStore((store) => store.isGenerating);
  const hasGenerated = useGenerateStore((store) => store.hasGenerated);
  const generationProgress = useGenerateStore(
    (store) => store.generationProgress
  );
  const update = useGenerateStore((store) => store.update);

  return (
    <Toolbar.Group>
      <Toolbar.Heading>Generate</Toolbar.Heading>
      <div>
        {isGenerating
          ? "Generating... " +
            (generationProgress
              ? (generationProgress * 100).toFixed(2) + "%"
              : "")
          : hasGenerated
          ? "Complete"
          : "Ready"}
      </div>
      <Button
        onClick={(e) => {
          update({ isGenerating: false, needsGenerate: false });
          setTimeout(() => {
            update({ needsGenerate: true });
          }, 100);
        }}
      >
        Generate
      </Button>
    </Toolbar.Group>
  );
}
