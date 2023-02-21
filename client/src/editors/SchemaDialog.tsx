import { useState } from "react";
import { Schema } from "./editor-types";
import ObjectEditor from "./ObjectEditor";
import { Dialog, DialogProps, DialogButtons } from "./Dialog";

export function SchemaDialog<T extends Record<string, unknown>>({
  data,
  schema,
  ignoredFields,
  onChange,
  onClose,
  children,
  open,
}: SchemaDialogProps<T>) {
  return (
    <Dialog open={open} onClose={onClose}>
      <ObjectEditor
        data={data}
        ignoredFields={ignoredFields}
        schema={schema as Schema<T>}
        onChange={onChange}
      />
      {children}
    </Dialog>
  );
}
type SchemaDialogProps<T extends Record<string, unknown>> = DialogProps & {
  data: T;
  ignoredFields?: (keyof T)[];
  onChange: (data: T | undefined) => void;
  schema: Schema<T>;
};

export function useSchemaDialog<T extends Record<string, unknown>>(
  initialValue: T,
  buttons: DialogButtons<T>,
  schema: Schema<T>
) {
  const [data, setData] = useState<T>(initialValue);
  const [open, setOpen] = useState<boolean>(false);
  const dialog = (
    <SchemaDialog
      open={open}
      data={data}
      onChange={(d) => {
        setData(d ?? initialValue);
      }}
      schema={schema}
      onClose={() => setOpen(false)}
    ></SchemaDialog>
  );
  return { setOpen, dialog };
}
