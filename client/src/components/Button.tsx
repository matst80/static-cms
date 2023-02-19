import { useNode } from "@craftjs/core";

export const Button = ({ size, variant, color, text }: any) => {
  console.log(variant, color);
  const {
    connectors: { connect, drag },
  } = useNode();
  return (
    <button
      ref={(ref) => connect(drag(ref as HTMLElement))}
      style={{ padding: size, backgroundColor: color }}
    >
      {text}
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
