import { changeHandlerFactory } from "../utils";
import {
  FieldEditor,
  FieldEditorSchemaProps,
  Schema,
  SchemaEditor,
  SchemaField,
} from "./editor-types";
import { StringEditor } from "./components/StringEditor";
import { BooleanEditor } from "./components/BooleanEditor";

type ObjectEditorProps<T extends Record<string, unknown>> =
  FieldEditorSchemaProps<T> & {
    schema: Schema<T>;
    ignoredFields?: (keyof T)[];
  };

function getEditor<T>(
  field: SchemaEditor<NonNullable<T>> | SchemaField<NonNullable<T>>
) {
  const { schema } = field;
  const { type } = field as { type?: string | FieldEditor<T> };

  if (!type && schema) {
    return ObjectEditor;
  } else if (type === "boolean") {
    return BooleanEditor;
  } else if (typeof type === "string") {
    return StringEditor;
  }
  return type;
}

export default function ObjectEditor<T extends Record<string, unknown>>({
  data,
  schema,
  ignoredFields,
  onChange,
}: ObjectEditorProps<T>) {
  const changeHandler = changeHandlerFactory(data ?? ({} as T), onChange);
  return (
    <>
      {Object.entries(schema)
        .filter(([key]) => !ignoredFields?.includes(key))
        .map(([key, field]) => {
          const { title, schema, hideTitle, defaultValue } = field;
          const Editor = getEditor(field);
          if (!Editor) return null;
          return (
            <div className="field" key={key}>
              {hideTitle ? null : (
                <label>
                  <span>{title}</span>
                </label>
              )}
              <Editor
                data={data?.[key] ?? defaultValue}
                parent={data}
                schema={schema}
                onChange={changeHandler(key)}
                label={title}
              />
            </div>
          );
        })}
    </>
  );
}
