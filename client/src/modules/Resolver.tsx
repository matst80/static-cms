import { ModuleProps, PageModule } from "slask-cms";
import { useEditor } from "../components/Editor";
import { Schema } from "../editors/editor-types";
import { NotFound } from "./NotFound";
import { pageModuleSchema } from "./schemas";
import TestModule from "./TestModule";
import TextModule from "./TextModule";

const modules = { NotFound, TestModule, TextModule };

export type ModuleElement = ((
  props: ModuleProps<Record<string, unknown>>
) => JSX.Element) & { schema?: Schema<PageModule> };

const getModule = (type?: string): ModuleElement => {
  if (!type) return NotFound;
  return (modules as any)[type] ?? NotFound;
};

export default function Resolver<T extends PageModule>(data: T) {
  const { type, props, settings } = data;
  const Module = getModule(type); // ((modules as any)[type] as ModuleElement) ?? NotFound;
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
