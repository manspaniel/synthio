import { PropsWithChildren, ReactNode, useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { styled } from "technic";

type Props = PropsWithChildren<{
  title: ReactNode;
  collapseKey?: string;
}>;

export function Accordion(props: Props) {
  const [expanded, setExpanded] = useState(true);

  return (
    <Wrapper>
      <TitleBar onClick={() => setExpanded(!expanded)}>
        {expanded ? <FaChevronDown /> : <FaChevronRight />}
        {props.title}
      </TitleBar>
      {expanded && <Content>{props.children}</Content>}
    </Wrapper>
  );
}

const Wrapper = styled("div", {
  background: "$panel",
  borderBottom: "1px solid $border1",
  "&:last-child": {
    borderBottom: "none",
  },
});

const TitleBar = styled("div", {
  fontWeight: "bold",
  padding: "$2",
  borderBottom: "1px solid $border1",
  "&:last-child": {
    borderBottom: "none",
  },
  display: "flex",
  gap: "$2",
  alignItems: "center",
  cursor: "pointer",
});

const Content = styled("div", {});
