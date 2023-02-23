import { Block, ModuleProps, NodeAttribute, PageModule } from "slask-cms";
import { useEditor } from "../components/Editor";
import { FieldEditor, Schema } from "../schema-editor/editor-types";
import { makeModuleSchema, pageModuleSchema } from "./schemas";

import NotFound from "./NotFound";
import TestModule from "./TestModule";
import TextModule from "./TextModule";
import { CmsModuleProps, cmsModules } from "./modules";
import { getBlock } from "../utils/getBlock";

export const RichTextEditor: FieldEditor<any> = ({ data, onChange }) => {
  return <div>{getBlock(data)}</div>;
};

const convert = (data: Record<string, any>) =>
  Object.fromEntries(
    Object.entries(data).map(([key, value]) => {
      value.schema =
        value.schema ??
        makeModuleSchema<CmsModuleProps>({
          headline: {
            title: "Headline",
            type: "string",
          },
          detailTextJson: {
            title: "Detail text",
            type: RichTextEditor,
          },
        });
      return [key, value];
    })
  );

const modules = { NotFound, TestModule, TextModule, ...convert(cmsModules) };

export type ModuleElement<
  T extends Record<string, unknown> = Record<string, unknown>
> = ((props: ModuleProps<T>) => JSX.Element) & { schema: Schema<PageModule> };

export const getModule = (type?: string): ModuleElement => {
  if (!type) return NotFound;
  return (modules as any)[type] ?? NotFound;
};

export default function Resolver<T extends PageModule>(data: T) {
  const { type, props, settings, ...rest } = data;
  const Module = getModule(type);
  const connect = useEditor(data, getModuleSchema(type));

  return (
    <div ref={connect}>
      <Module
        settings={settings}
        modules={data.modules}
        {...rest}
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
