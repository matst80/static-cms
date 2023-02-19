import { changeHandlerFactory } from "../utils";
import {
  FieldEditor,
  FieldEditorSchemaProps,
  Schema,
  SchemaEditor,
  SchemaField,
} from "./editor-types";
import { StringEditor } from "./StringEditor";

type ObjectEditorProps<T extends Record<string, unknown>> =
  FieldEditorSchemaProps<T> & {
    ignoredFields?: (keyof T)[];
  };

function getEditor<T>(field: SchemaEditor | SchemaField<NonNullable<T>>) {
  const { schema } = field;
  const { type } = field as any;
  if (!type && schema) {
    return ObjectEditor;
  }
  if (typeof type === "string") {
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
  if (!data) return null;
  const changeHandler = changeHandlerFactory(data, onChange);
  return (
    <>
      {Object.entries(schema)
        .filter(([key]) => !ignoredFields?.includes(key))
        .map(([key, field]: [keyof T, Schema<T>[any]]) => {
          const { title, schema, hideTitle } = field;
          const Editor = getEditor(field);
          if (!Editor) return null;
          return (
            <div className="field" key={key as string}>
              {hideTitle ? (
                <Editor
                  data={data[key] as any}
                  parent={data}
                  schema={schema}
                  onChange={changeHandler(key) as any}
                  label={title}
                />
              ) : (
                <label>
                  <span>{title}</span>
                  <Editor
                    data={data[key] as any}
                    parent={data}
                    schema={schema}
                    onChange={changeHandler(key) as any}
                    label={title}
                  />
                </label>
              )}
            </div>
          );
        })}
    </>
  );
}
