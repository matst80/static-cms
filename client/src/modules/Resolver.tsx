import { ModuleProps, PageModule, Settings } from "slask-cms";
import { Schema } from "../editors/editor-types";
import { NotFound } from "./NotFound";
import { pageModuleSchema } from "./schemas";
import TestModule from "./TestModule";
import TextModule from "./TextModule";

export const modules = { NotFound, TestModule, TextModule };

type ModuleElement = (
  props: ModuleProps<Record<string, unknown>>
) => JSX.Element;

export default function Resolver({ type, props, ...module }: PageModule) {
  const Module = (modules as any)[type] as ModuleElement;
  return Module ? (
    <Module
      settings={module.settings ?? {}}
      modules={module.modules}
      {...props}
    />
  ) : (
    <NotFound type={type} />
  );
}

export const getModuleSchema = (type: string): Schema<PageModule> => {
  return ((modules as any)[type] ?? NotFound).schema ?? pageModuleSchema;
};
