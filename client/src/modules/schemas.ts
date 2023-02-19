import { PageModule, PageModuleWithProps } from "slask-cms";
import { Schema } from "../editors/editor-types";
import { PageModulesEditor } from "../editors/PageModulesEditor";
import SettingsEditor, { settingsSchema } from "../editors/SettingsEditor";
import { ModuleTypeSelector } from "./ModuleTypeSelector";

export const pageModuleSchema: Schema<PageModule> = {
  id: {
    type: "string",
    title: "Id",
  },
  type: {
    type: ModuleTypeSelector,
    title: "Module type",
  },
  props: {
    title: "Properties",
    schema: {},
  },
  modules: {
    title: "Modules",
    type: PageModulesEditor,
  },
  settings: {
    type: SettingsEditor,
    schema: settingsSchema,
    title: "Settings",
  },
};

export const makeModuleSchema = <
  TProps extends Record<string, unknown> = {},
  TSettings extends Record<string, unknown> = {}
>(
  props: Schema<TProps>,
  settings?: Schema<TSettings>
): Schema<PageModuleWithProps<TProps>> => {
  return {
    ...pageModuleSchema,
    props: {
      title: "Properties",
      schema: props as any,
    },
    settings: {
      title: "Settings",
      type: SettingsEditor,
      schema: { ...(settingsSchema as any), ...(settings ?? {}) },
    },
  };
};
