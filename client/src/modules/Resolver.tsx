import { PageModule } from "slask-cms";
import { Schema } from "../editors/editor-types";
import { NotFound } from "./NotFound";
import { pageModuleSchema } from "./schemas";
import TestModule from "./TestModule";
import TextModule from "./TextModule";

export const modules = { NotFound, TestModule, TextModule };

export default function Resolver({ type, ...module }: PageModule) {
  const Module = (modules as any)[type];
  return Module ? <Module {...module} /> : <NotFound type={type} />;
}

export const getModuleSchema = (type: string): Schema<PageModule> => {
  return ((modules as any)[type] ?? NotFound).schema ?? pageModuleSchema;
};
