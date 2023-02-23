import { createElement, ReactNode } from "react";
import { Block, Node, NodeAttribute } from "slask-cms";
import { CmsLink } from "../modules/modules/DetailsBlock";

const toReactNode = (node: Node): ReactNode => {
  if (node.data && typeof node.data === "string") {
    return node.data;
  } else if (node.links) {
    return <>{node.links.map(CmsLink)}</>;
  }
  if (node.name) {
    return getBlock(node as Block);
  }
  return null;
};

const toObject = (
  props: Record<string, unknown>,
  { name, value }: NodeAttribute
) => {
  if (name.includes("xmlns")) {
    return props;
  }
  if (name === "class") name = "className";
  return { ...props, [name]: value };
};

export const getBlock = (props: Block | undefined) => {
  if (!props) {
    return null;
  }
  const { name, children, attributes } = props;

  return createElement(
    name,
    attributes?.reduce(toObject, {}),
    children?.map(toReactNode)
  );
};
