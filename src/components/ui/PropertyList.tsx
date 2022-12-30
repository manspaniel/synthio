import { PropsWithChildren } from "react";
import { styled } from "technic";

type ListProps = PropsWithChildren<{}>;

export function PropertyList(props: ListProps) {
  return <List>{props.children}</List>;
}

type ItemProps = PropsWithChildren<{
  label?: string;
}>;

export function PropertyListItem(props: ItemProps) {
  return (
    <Row>
      <Label>{props.label}</Label>
      <Content>
        <InnerContent>{props.children}</InnerContent>
      </Content>
    </Row>
  );
}

const List = styled("div", {
  display: "table",
  width: "100%",
  padding: "$1",
});

const Row = styled("div", {
  display: "table-row",
});

const Label = styled("div", {
  display: "table-cell",
  padding: "$1",
  width: "50%",
});

const Content = styled("div", {
  display: "table-cell",
  padding: "$1",
  width: "50%",
});

const InnerContent = styled("div", {
  width: "100%",
  display: "flex",
});
