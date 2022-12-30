import { PropsWithChildren, ReactNode, useEffect, useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { styled } from "technic";
import { URIParamterStorage } from "../../util/uriStorage";

type Props = PropsWithChildren<{
  title: ReactNode;
  collapseKey?: string;
}>;

const storage = new URIParamterStorage();

export function Accordion(props: Props) {
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (props.collapseKey) {
      const savedState = storage.getItem("debug-" + props.collapseKey);
      if (savedState) {
        setExpanded(savedState === "true");
      }
    }
  }, []);

  useEffect(() => {
    if (props.collapseKey) {
      storage.setItem(
        "debug-" + props.collapseKey,
        expanded ? "true" : "false"
      );
    }
  }, [expanded]);

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
