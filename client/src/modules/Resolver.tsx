import { Element } from "@craftjs/core";
import { PageModule } from "slask-cms";
import { Container } from "../components/Container";

const NotFound = ({ type }: any) => {
  return <div>not found {type}</div>;
};

export const modules = { NotFound, Container, Resolver };

export default function Resolver(module: PageModule) {
  const { type, props, id } = module;
  const Module = (modules as any)[type];
  return Module ? (
    <Element is={Module} id={id} canvas {...props} />
  ) : (
    <NotFound type={type} />
  );
}
