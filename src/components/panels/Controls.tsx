import { styled } from "technic";
import { Control, Schema, useInputStore } from "../../controls";
import { Accordion } from "../ui/Accordion";
import { FloatingPanel } from "../ui/FloatingPanel";
import { PropertyListItem, PropertyList } from "../ui/PropertyList";

export function Controls() {
  const groups = useInputStore((store) => store.groups);
  return (
    <ControlPanel>
      {groups.map((group, i) => (
        <InputGroup key={i} title={group.title} schema={group.schema} />
      ))}
    </ControlPanel>
  );
}

const ControlPanel = styled(FloatingPanel, {
  top: 10,
  right: 10,
  width: 300,
});

type InputGroupProps = {
  title?: string;
  schema: Schema;
};

function InputGroup({ title, schema }: InputGroupProps) {
  return (
    <Accordion title={title ?? "Controls"}>
      <PropertyList>
        {Object.entries(schema).map(([key, control]) => (
          <PropertyListItem key={key} label={key}>
            <InputItem key={key} id={key} control={control} />
          </PropertyListItem>
        ))}
      </PropertyList>
    </Accordion>
  );
}

type InputItemProps = {
  id: string;
  control: Control;
};

function InputItem(props: InputItemProps) {
  const Component = props.control.component;
  let value = useInputStore((store) => store.values[props.id]);
  let updateValue = useInputStore((store) => store.updateValue);
  if (value === undefined) value = props.control.value;

  return (
    <Component
      value={value}
      onChange={(value) => {
        updateValue(props.id, value);
      }}
      options={props.control.options}
    />
  );
}
