import { PropsWithChildren } from "react";
import { styled } from "technic";

export type Props = PropsWithChildren<{
  label: string;
}>;

export const Property = (props: Props) => {
  return (
    <Wrapper>
      <Label>{props.label}</Label>
      <Contents>{props.children}</Contents>
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  display: "flex",
  alignItems: "center",
});

const Label = styled("div", {
  flex: "0 0 auto",
  width: "100px",
});

const Contents = styled("div", {
  flex: "1 1 auto",
});

export const PropertyList = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$2",
});
