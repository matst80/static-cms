export type FieldEditorProps<T, TParent = unknown> = {
  data: T|undefined;
  parent?: TParent;
  label?: string;
  onChange: (data: T|undefined) => void;
};

export type FieldEditorSchemaProps<
  T extends Record<string,unknown>,
  TParent = unknown
> = {
  data: T|undefined;
  parent?: TParent;
  schema: Schema<T>;
  label?: string;
  onChange: (data: T|undefined) => void;
};

export type SchemaBase = {
  title: string;
  hideTitle?: boolean;
};

export type SchemaField<T> = SchemaBase & {
  type: string | FieldEditor<T>;
	schema?: Schema<Record<string,unknown>>
};

export type SchemaEditor = SchemaBase & {
  schema: Schema<Record<string,unknown>>;
};

export type FieldProps<T> = T extends Record<string,unknown>
  ? FieldEditorSchemaProps<T>
  : FieldEditorProps<T>;

export type FieldEditor<T,TProps=Record<string,never>> = (props: FieldProps<T> & TProps) => JSX.Element|null;

export type Schema<T> = {
  [key in keyof T]: SchemaEditor | SchemaField<NonNullable<T[key]>>;
};
