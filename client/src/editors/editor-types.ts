export type FieldEditor<T> = (props: {
  data: T;
  schema?: Schema<Record<string, unknown>>;
  label: string;
  onChange: (data: T | undefined) => void;
}) => JSX.Element;

export type SchemaField<T> = {
  type: string | FieldEditor<T>;
  schema?: Schema<Record<string, unknown>>;
  title: string;
};

export type SchemaEditor<> = {
	schema: Schema<Record<string, unknown>>;
  title: string;
}

export type Schema<T extends Record<string, unknown>> = {
  [key in keyof T]: SchemaEditor | SchemaField<T[key]>;
};