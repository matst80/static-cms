import { Element } from "@craftjs/core";
import { PageModule } from "slask-cms";
import { Button } from "./Button";
import { Card } from "./Card";
import { Text } from "./Text";
import { Container } from "./Container";
const modules = { Card, Container, Button, Text };

export default function Resolver(module: PageModule) {
  const { type, props, id } = module;
  const Module = (modules as any)[type] ?? <div>not found {type}</div>;
  return <Element is={Module} id={id} canvas {...props} />;
}
