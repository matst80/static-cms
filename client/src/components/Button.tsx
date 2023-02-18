import { useNode } from "@craftjs/core";

export const Button = ({ size, variant, color, children }: any) => {
  console.log(variant, color);
  const {
    connectors: { connect, drag },
  } = useNode();
  return (
    <button
      ref={(ref) => connect(drag(ref as HTMLElement))}
      style={{ padding: size, backgroundColor: color }}
    >
      {children}
    </button>
  );
};

Button.craft = {
  props: {
    size: "small",
    variant: "contained",
    color: "primary",
    text: "Click me",
  },
};
