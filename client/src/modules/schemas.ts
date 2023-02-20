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
		defaultValue:{},
    schema: {},
  },
	links:{
		title:'Links',
		defaultValue:[],
		type:LinksEditor
	},
	images:{
		title:'Images',
		defaultValue:[],
		type:ImagesEditor
	},
  settings: {
    type: SettingsEditor,
		defaultValue:{},
    schema: settingsSchema,
    title: "Settings",
  },
	modules: {
    title: "Modules",
		hideTitle:true,
		defaultValue:[],
    type: PageModulesEditor,
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
