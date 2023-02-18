import { Element } from "@craftjs/core";
import { PageModule } from "slask-cms";

export const modules = {};

export default function Resolver(module: PageModule) {
  const { type, props, id } = module;
  const Module = (modules as any)[type] ?? <div>not found {type}</div>;
  return <Element is={Module} id={id} canvas {...props} />;
}
