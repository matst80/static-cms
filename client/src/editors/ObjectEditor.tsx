import { changeHandlerFactory } from "../utils";
import { Schema, FieldEditor } from "./editor-types";

type ObjectEditorProps<T extends Record<string, unknown>> = {
  data: T;
  schema: Schema<T>;
  onChange: (data: T) => void;
};

const StringEditor: FieldEditor<string> = ({ data, label, onChange }) => {
  return (
    <input
      value={data ? String(data) : ""}
      placeholder={label}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default function ObjectEditor<T extends Record<string, unknown>>({
  data,
  schema,
  onChange,
}: ObjectEditorProps<T>) {
  const changeHandler = changeHandlerFactory(data, onChange);
  return (
    <>
      {Object.entries(schema).map(([key, field]) => {
        const { title, type, schema } = field;

        const Editor: FieldEditor<any> = schema
          ? ObjectEditor
          : typeof type === "string"
          ? StringEditor
          : type;
        return (
          <div className="field" key={key}>
            <label>
              <span>{title}</span>
              <Editor
                data={data[key]}
                schema={schema}
                onChange={changeHandler(key)}
                label={title}
              />
            </label>
          </div>
        );
      })}
    </>
  );
}
