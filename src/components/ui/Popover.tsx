import * as RPopover from "@radix-ui/react-popover";
import { PropsWithChildren, ReactNode } from "react";
import { styled } from "technic";

type Props = PropsWithChildren<{
  trigger: ReactNode;
}>;

export function Popover(props: Props) {
  return (
    <RPopover.Root>
      <Trigger>{props.trigger}</Trigger>
      {/* <RPopover.Anchor /> */}
      <RPopover.Portal>
        <Content sideOffset={2} align="center">
          <Arrow />
          {props.children}
        </Content>
      </RPopover.Portal>
    </RPopover.Root>
  );
}

const Trigger = styled(RPopover.Trigger, {
  appearance: "none",
  background: "transparent",
  padding: 0,
  margin: 0,
  display: "inline-block",
  border: 0,
});

const Content = styled(RPopover.Content, {
  backgroundColor: "$background",
  border: "2px solid $border",
  padding: "$2",
  borderRadius: "8px",
});

const Arrow = styled(RPopover.Arrow, {
  fill: "$border",
});
