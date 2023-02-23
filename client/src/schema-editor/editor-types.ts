export type FieldEditorProps<T, TParent = unknown> = {
  data: T;
  parent?: TParent;
  label?: string;
  onChange: (data: T) => void;
};

export type FieldEditorSchemaProps<
  T extends Record<string, unknown>,
  TParent = unknown
> = {
  data: T;
  parent?: TParent;
  schema?: Schema<T>;
  label?: string;
  onChange: (data: T) => void;
};

export type SchemaBase<T> = {
  title: string;
  defaultValue?: T;
  hideTitle?: boolean;
};

export type SchemaField<T> = SchemaBase<T> & {
  type: string | FieldEditor<T>;
  schema?: Schema<Record<string, unknown>>;
};

export type SchemaEditor<T> = SchemaBase<T> & {
  schema: Schema<Record<string, unknown>>;
};

export type FieldProps<T> = FieldEditorProps<T>;

/*
T extends Record<string, unknown>
  ? FieldEditorSchemaProps<T>
  :
  */

export type FieldEditor<T, TProps = Record<string, unknown>> = (
  props: FieldProps<T> & TProps
) => JSX.Element | null;

export type Schema<T> = {
  [key in keyof T]: SchemaEditor<T[key]> | SchemaField<T[key]>;
};
