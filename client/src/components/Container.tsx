import { useNode } from "@craftjs/core";

export const Container = ({ background, padding = 0, children }: any) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  return (
    <div
      ref={(ref) => connect(drag(ref as HTMLElement))}
      style={{ margin: "5px 0", background, padding: `${padding}px` }}
    >
      {children}
    </div>
  );
};

export const ContainerSettings = () => {
  const {
    background,
    padding,
    actions: { setProp },
  } = useNode((node) => ({
    background: node.data.props.background,
    padding: node.data.props.padding,
  }));
  return (
    <div>
      {/* <label>Background</label> */}
      {/* <ColorPicker
          defaultValue={background || "#000"}
          onChange={(color) => {
            setProp((props) => (props.background = color));
          }}
        /> */}

      <label>Padding</label>
      <input
        type="range"
        defaultValue={padding}
        onChange={(e) =>
          setProp((props: any) => (props.padding = e.target.value))
        }
      />
    </div>
  );
};

export const ContainerDefaultProps = {
  background: "#ffffff",
  padding: 3,
};

Container.craft = {
  props: ContainerDefaultProps,
  //related: {...}
};
