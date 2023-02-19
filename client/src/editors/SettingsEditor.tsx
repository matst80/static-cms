import { Settings } from "slask-cms";
import { changeHandlerFactory } from "../utils";
import { Schema } from "./editor-types";
import ObjectEditor from "./ObjectEditor";

type SettingsProps<T extends Settings> = {
  data: T;
  schema?: Schema<T>;
  onChange: (data: T) => void;
};

export default function SettingsEditor<T extends Settings>({
  data,
  schema,
  onChange,
}: SettingsProps<T>) {
  //const { validFrom, validTo, ...other } = data;
  const changeHandler = changeHandlerFactory(data, onChange);
  return (
    <div>
      {schema ? (
        <ObjectEditor data={data} schema={schema} onChange={onChange} />
      ) : (
        Object.entries(data).map(([key, value]) => (
          <div key={key}>
            <label>
              <span>{key}</span>
              <input
                value={String(value)}
                onChange={changeHandler(key as keyof T)}
              />
            </label>
          </div>
        ))
      )}
    </div>
  );
}
