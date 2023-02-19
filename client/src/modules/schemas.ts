import { Settings, PageModule, PageModuleData } from "slask-cms";
import { Schema, SchemaEditor, SchemaField } from "../editors/editor-types";

export const settingsSchema: Schema<Settings> = {
  validFrom: {
    title: "Valid from date:",
    type: "date",
  },
  validTo: {
    title: "Valid to date:",
    type: "date",
  },
};

export const pageModuleSchema: Schema<PageModule> = {
  id: {
    type: "string",
    title: "Id",
  },
  type: {
    type: "string",
    title: "Module type",
  },
	props: {
		title:'Properties',
		schema: {}
	},
  settings: {
    schema: settingsSchema,
    title: "Settings",
  },
};

export const makeModuleSchema = <TParent extends PageModuleData<Record<string,unknown>,Settings>>(
  props?: Schema<TParent["props"]>,
  settings?: Schema<TParent["settings"]>
): Schema<PageModule> => {
  return {
    ...pageModuleSchema,
    props:props?{...pageModuleSchema.props, schema:props}:pageModuleSchema.props,
    settings: {
			...pageModuleSchema.settings,
			schema: settings??settingsSchema
		},
  };
};
