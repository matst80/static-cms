import { PageModule, PageModuleWithProps, Settings } from "slask-cms";
import { Schema } from "../editors/editor-types";
import ImagesEditor from "../editors/ImagesEditor"
import LinksEditor from "../editors/LinksEditor"
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
	links:{
		title:'Links',
		type:LinksEditor
	},
	images:{
		title:'Images',
		type:ImagesEditor
	},
  settings: {
    type: SettingsEditor,
    schema: settingsSchema,
    title: "Settings",
  },
};

export const makeModuleSchema = <
  TProps extends Record<string, unknown> = Record<string,never>,
  TSettings extends Record<string, unknown> = Record<string,never>
>(
  props: Schema<TProps>,
  settings?: Schema<TSettings>
): Schema<PageModuleWithProps<TProps>> => {
  return {
    ...pageModuleSchema,
    props: {
      title: "Properties",
      schema: props as Schema<Record<string, unknown>>,
    },
    settings: {
      title: "Settings",
      type: SettingsEditor,
      schema: { ...(settingsSchema as any), ...(settings ?? {}) },
    },
  };
};
