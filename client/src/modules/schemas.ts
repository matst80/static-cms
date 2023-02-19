import { Settings, PageModule, PageModuleData } from "slask-cms";
import DatePicker from "../components/DatePicker"
import { Schema } from "../editors/editor-types";
import { PageModulesEditor } from "../editors/PageModulesEditor"
import { ModuleTypeSelector } from "./ModuleTypeSelector"

export const settingsSchema: Schema<Settings> = {
  validFrom: {
    title: "Valid from date:",
    type: DatePicker,
  },
  validTo: {
    title: "Valid to date:",
    type: DatePicker,
  },
};

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
		title:'Properties',
		schema: {}
	},
	modules: {
		title:'Modules',
		type: PageModulesEditor,
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
			schema: {...settingsSchema as any, ...settings??{}}
		},
  };
};
