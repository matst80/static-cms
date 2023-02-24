import { Settings } from "slask-cms";
import DatePicker from "./components/DatePicker";
import { changeHandlerFactory } from "../utils";
import { FieldEditor, FieldEditorSchemaProps, Schema } from "./editor-types";
import ObjectEditor from "./ObjectEditor";

export const settingsSchema: Schema<Settings> = {
  // validTo: {
  //   title: "Valid to date:",
  //   type: DatePicker,
  // },
  // validFrom: {
  //   title: "Valid from date:",
  //   type: DatePicker,
  // },
};

type SettingsProps<T extends Settings> = FieldEditorSchemaProps<T>;

export default function SettingsEditor<T extends Settings>({
  data,
  schema,
  onChange,
}: SettingsProps<T>) {
  const { validFrom, validTo } = data ?? {};
  const changeHandler = changeHandlerFactory(data, onChange);
  return (
    <div>
      <div className="grid grid-cols-2">
        <ObjectEditor
          data={data}
          schema={schema ?? (settingsSchema as Schema<T>)}
          ignoredFields={["validFrom", "validTo"]}
          onChange={onChange}
        />
      </div>
      <div className="bg-slate-300 rounded-md p-2 grid grid-cols-2">
        <label>From</label>
        <DatePicker
          data={validFrom}
          max={validTo}
          onChange={changeHandler("validFrom")}
        />
        <label>To</label>
        <DatePicker
          data={validTo}
          min={validFrom}
          onChange={changeHandler("validTo")}
        />
      </div>
    </div>
  );
}
