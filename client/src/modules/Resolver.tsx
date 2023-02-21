import { ModuleProps, PageModule } from "slask-cms";
import { useEditor } from "../components/Editor";
import { Schema } from "../editors/editor-types";
import { pageModuleSchema } from "./schemas";

import NotFound from "./NotFound";
import TestModule from "./TestModule";
import TextModule from "./TextModule";

const modules = { NotFound, TestModule, TextModule };

export type ModuleElement<
  T extends Record<string, unknown> = Record<string, unknown>
> = ((props: ModuleProps<T>) => JSX.Element) & { schema: Schema<PageModule> };

export const getModule = (type?: string): ModuleElement => {
  if (!type) return NotFound;
  return (modules as any)[type] ?? NotFound;
};

export default function Resolver<T extends PageModule>(data: T) {
  const { type, props, settings } = data;
  const Module = getModule(type);
  const connect = useEditor(data, getModuleSchema(type));
  return (
    <div ref={connect}>
      <Module
        settings={settings}
        modules={data.modules}
        {...props}
        type={type}
      />
    </div>
  );
}

export const getModules = () => Object.keys(modules);

export const getModuleSchema = (type: string): Schema<PageModule> => {
  return getModule(type).schema ?? pageModuleSchema;
};
